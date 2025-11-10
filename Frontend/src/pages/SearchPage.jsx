import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchShoes } from '../lib/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Input from '../components/Input';
import Button from '../components/Button';
import { SearchX } from 'lucide-react';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false); // Track if a search has been performed

  useEffect(() => {
    const currentQuery = searchParams.get('q');
    if (currentQuery) {
      setQuery(currentQuery);
      performSearch(currentQuery);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
        setResults([]);
        setError('');
        return;
    }
    
    setIsLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const data = await searchShoes(searchQuery);
      setResults(data || []);
    } catch (err) {
      if(err.response?.status === 404) {
        setResults([]); // API returns 404 for no results
      } else {
        setError('An error occurred while searching. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ q: query });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">Search</h1>
        <form onSubmit={handleSearchSubmit} className="mt-6 flex gap-2">
          <Input
            id="search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for sneakers, boots, brands..."
            className="flex-grow"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </form>
      </div>

      <div className="mt-12">
        {isLoading ? (
          <Loader size="lg" />
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : hasSearched && results.length > 0 ? (
          <>
            <h2 className="text-xl font-bold mb-6">Showing results for "{searchParams.get('q')}"</h2>
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {results.map((shoe) => (
                <ProductCard key={shoe._id} shoe={shoe} />
              ))}
            </div>
          </>
        ) : hasSearched && results.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-(--border-color) rounded-lg">
            <SearchX className="mx-auto h-12 w-12 text-(--text-color)/40" />
            <h3 className="mt-2 text-lg font-medium">No results found</h3>
            <p className="mt-1 text-sm text-(--text-color)/60">
              We couldn't find any products matching "{searchParams.get('q')}". Try a different search term.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SearchPage;