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
  const [sortBy, setSortBy] = useState('featured');
  
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

  const sortedShoes = [...shoes].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'rating':
        return (b.averageRating || 0) - (a.averageRating || 0);
      default:
        return 0;
    }
  });

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
            <>
              <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
                <p className="text-lg text-(--text-color)/75">
                  {isLoading ? 'Loading...' : `${shoes.length} ${shoes.length === 1 ? 'product' : 'products'} available`}
                </p>
                <div className="flex items-center gap-2">
                  <label htmlFor="sort" className="text-sm font-semibold text-(--text-color)">Sort by:</label>
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2.5 rounded-lg border-2 border-(--border-color) bg-(--surface-color) text-(--text-color) text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-(--brand-color) focus:border-(--brand-color) transition-all cursor-pointer hover:border-(--brand-color) shadow-sm"
                    style={{
                      colorScheme: 'light dark'
                    }}
                  >
                    <option value="featured" className="bg-(--surface-color) text-(--text-color)">Featured</option>
                    <option value="price-low" className="bg-(--surface-color) text-(--text-color)">Price: Low to High</option>
                    <option value="price-high" className="bg-(--surface-color) text-(--text-color)">Price: High to Low</option>
                    <option value="name-asc" className="bg-(--surface-color) text-(--text-color)">Name: A to Z</option>
                    <option value="name-desc" className="bg-(--surface-color) text-(--text-color)">Name: Z to A</option>
                    <option value="rating" className="bg-(--surface-color) text-(--text-color)">Highest Rated</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
                {isLoading 
                  ? Array.from({ length: 9 }).map((_, index) => <ProductCardSkeleton key={index} />)
                  : sortedShoes.length > 0 
                    ? sortedShoes.map((shoe) => <ProductCard key={shoe._id} shoe={shoe} />)
                    : <div className="text-center text-(--text-color)/60 sm:col-span-2 xl:col-span-3">No products found.</div>
                }
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;