import { useWishlist } from '../../hooks/useWishlist';
import Loader from '../../components/Loader';
import ProductCard from '../../components/ProductCard';
import Button from '../../components/Button';
import { HeartCrack } from 'lucide-react';

const WishlistPage = () => {
  const { wishlistItems, loading, error } = useWishlist();

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((shoe) => (
            <ProductCard key={shoe._id} shoe={shoe} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-(--border-color) rounded-lg">
          <HeartCrack className="mx-auto h-12 w-12 text-(--text-color)/40" />
          <h3 className="mt-2 text-lg font-medium">Your wishlist is empty</h3>
          <p className="mt-1 text-sm text-(--text-color)/60">
            Click the heart on any product to save it here.
          </p>
          <Button to="/products" className="mt-6">
            Discover Products
          </Button>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;