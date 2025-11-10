import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton'; // <-- IMPORT
import FilterSidebar from '../components/FilterSidebar';
import { getAllShoes } from '../lib/api';

const ProductsPage = () => {
  const [shoes, setShoes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
  });

  useEffect(() => {
    const fetchShoes = async () => {
      // Don't set loading to true if it's just a filter change on already loaded data
      // For a better UX, we only show the big skeleton screen on initial load.
      // A small spinner could be added for subsequent filter changes if desired.
      if (shoes.length === 0) {
        setIsLoading(true);
      }
      try {
        setError(null);
        const queryParams = new URLSearchParams();
        if (filters.category) queryParams.set('category', filters.category);
        if (filters.brand) queryParams.set('brand', filters.brand);

        navigate(`?${queryParams.toString()}`, { replace: true });
        
        const result = await getAllShoes(filters);
        setShoes(result.shoes);
      } catch (err) {
        setError("Failed to fetch products. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchShoes();
  }, [filters, navigate]);

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
        <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />

        <div className="w-full mt-10 lg:mt-0 lg:pl-8"> {/* Added lg:pl-8 */}
          {error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
              {isLoading 
                ? Array.from({ length: 9 }).map((_, index) => <ProductCardSkeleton key={index} />)
                : shoes.length > 0 
                  ? shoes.map((shoe) => <ProductCard key={shoe._id} shoe={shoe} />)
                  : <div className="text-center text-(--text-color)/60 sm:col-span-2 xl:col-span-3">No products found.</div>
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;