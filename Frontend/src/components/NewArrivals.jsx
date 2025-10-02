import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import Loader from './Loader';
import { getNewArrivals } from '../lib/api';

const NewArrivals = () => {
  const [shoes, setShoes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShoes = async () => {
      try {
        const newArrivals = await getNewArrivals();
        setShoes(newArrivals || []);
      } catch (err) {
        setError("Failed to fetch new arrivals. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchShoes();
  }, []);

  if (isLoading) return <Loader />;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="bg-(--surface-color)">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <h2 className="text-3xl font-bold tracking-tighter text-center">New Arrivals</h2>
        <p className="mt-4 text-center text-(--text-color)/60">
          Fresh off the line. Grab the latest styles before they're gone.
        </p>
        {shoes.length > 0 ? (
          <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {shoes.map((shoe) => (
              <ProductCard key={shoe._id} shoe={shoe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-(--text-color)/60">
            No new arrivals to show right now.
          </div>
        )}
      </div>
    </div>
  );
};

export default NewArrivals;