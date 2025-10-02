import { useState, useEffect } from 'react';
import { getWishlist } from '../lib/api';
import Loader from '../components/Loader';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const data = await getWishlist();
        setWishlist(data);
      } catch (err) {
        setError('Failed to fetch your wishlist. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  if (loading) return <Loader size="lg" />;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight mb-8">My Wishlist</h1>
      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {wishlist.map((shoe) => (
            <ProductCard key={shoe._id} shoe={shoe} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold">Your Wishlist is Empty</h2>
          <p className="mt-4 text-(--text-color)/60">Looks like you haven't added anything yet.</p>
          <Button to="/products" className="mt-6">Explore Products</Button>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;