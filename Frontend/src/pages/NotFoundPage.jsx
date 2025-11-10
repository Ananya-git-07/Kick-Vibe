import { useState, useEffect } from 'react';
import PageWrapper from '../components/PageWrapper';
import Button from '../components/Button';
import { getFeaturedShoes } from '../lib/api';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';

const NotFoundPage = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const featured = await getFeaturedShoes();
        setSuggestions(featured.slice(0, 4) || []);
      } catch (err) {
        console.error("Could not fetch suggestions for 404 page");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSuggestions();
  }, []);

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-8xl font-extrabold tracking-tighter text-(--brand-color)">404</h1>
        <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Page Not Found</h2>
        <p className="mt-6 text-lg text-(--text-color)/70">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button to="/">Go back home</Button>
          <Button to="/products" variant="secondary">
            View all products
          </Button>
        </div>
      </div>

      { (isLoading || suggestions.length > 0) && (
        <div className="container mx-auto px-4 mt-24">
          <h2 className="text-2xl font-bold text-center mb-8">Maybe one of these?</h2>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : suggestions.map(shoe => <ProductCard key={shoe._id} shoe={shoe} />)
            }
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default NotFoundPage;