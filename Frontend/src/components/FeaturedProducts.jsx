import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import Loader from './Loader';
import { getFeaturedShoes } from '../lib/api';

const FeaturedProducts = () => {
  // State to hold our data, loading status, and any errors
  const [shoes, setShoes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    const fetchShoes = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const featuredShoes = await getFeaturedShoes();
        
        // --- THIS IS THE CRITICAL FIX ---
        // We ensure that `shoes` is always an array. If `featuredShoes` is undefined
        // for any reason, we fall back to an empty array `[]` instead of causing a crash.
        setShoes(featuredShoes || []);

      } catch (err) {
        setError("Failed to fetch featured products. Please try again later.");
        console.error(err); // Log the actual error for debugging
      } finally {
        setIsLoading(false); // Stop loading, regardless of success or failure
      }
    };

    fetchShoes();
  }, []); // The empty dependency array [] means this effect runs only once

  // --- Render Logic ---

  // 1. Show a loader while data is being fetched
  if (isLoading) {
    return (
      <div className="container mx-auto py-24">
        <Loader />
      </div>
    );
  }

  // 2. Show an error message if the API call failed
  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }
  
  // 3. Render the main component content
  return (
    <div className="bg-(--bg-color)">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <h2 className="text-3xl font-bold tracking-tighter text-center">Featured Kicks</h2>
        <p className="mt-4 text-center text-(--text-color)/60">
          Handpicked styles, just for you. Check out what's trending.
        </p>

        {/* 
          Conditional Rendering:
          If the shoes array has items, map over them and display the grid.
          Otherwise, show a "not found" message.
        */}
        {shoes.length > 0 ? (
          <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {shoes.map((shoe) => (
              <ProductCard key={shoe._id} shoe={shoe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-(--text-color)/60">
            No featured products available right now.
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedProducts;