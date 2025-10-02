import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchShoes } from '../lib/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await searchShoes(query);
        setResults(data);
      } catch (err) {
        setError(err.response?.data?.message || 'No products found matching your search.');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tighter">Search Results</h1>
        <p className="mt-4 max-w-2xl mx-auto text-(--text-color)/60">
          Showing results for: <span className="font-bold text-(--brand-color)">"{query}"</span>
        </p>
      </div>

      {loading ? (
        <Loader size="lg" />
      ) : error ? (
        <div className="text-center text-red-500 py-10">{error}</div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {results.map((shoe) => (
            <ProductCard key={shoe._id} shoe={shoe} />
          ))}
        </div>
      ) : (
        <div className="text-center text-(--text-color)/60 py-10">
          No products found. Try a different search term.
        </div>
      )}
    </div>
  );
};

export default SearchPage;
