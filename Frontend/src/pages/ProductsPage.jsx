import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import FilterSidebar from '../components/FilterSidebar';
import { getAllShoes } from '../lib/api';

const ProductsPage = () => {
  const [shoes, setShoes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Use URL search params to manage filter state
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    // Add more filters here (e.g., sort, price)
  });

  useEffect(() => {
    const fetchShoes = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Construct the query parameters from the filter state
        const queryParams = new URLSearchParams();
        if (filters.category) queryParams.set('category', filters.category);
        if (filters.brand) queryParams.set('brand', filters.brand);

        // Update the browser's URL to reflect the current filters
        navigate(`?${queryParams.toString()}`, { replace: true });
        
        // Fetch the shoes using the filters object
        const result = await getAllShoes(filters);
        setShoes(result.shoes); // The API returns an object { shoes: [...], ... }
      } catch (err) {
        setError("Failed to fetch products. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchShoes();
  }, [filters, navigate]); // Re-run the effect whenever filters change

  const handleFilterChange = (filterName, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tighter">All Kicks</h1>
        <p className="mt-4 max-w-2xl mx-auto text-(--text-color)/60">
          Browse our entire collection. Use the filters to find your perfect pair.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Filters */}
        <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />

        {/* Product Grid */}
        <div className="w-full mt-10 lg:mt-0">
          {isLoading ? (
            <Loader size="lg" />
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : shoes.length > 0 ? (
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
              {shoes.map((shoe) => (
                <ProductCard key={shoe._id} shoe={shoe} />
              ))}
            </div>
          ) : (
            <div className="text-center text-(--text-color)/60">
              No products found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;