import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../hooks/useWishlist';
import { useAuth } from '../hooks/useAuth';
import { Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { StaticStarRating } from './StarRating'; // <-- IMPORT

const ProductCard = ({ shoe }) => {
  // --- ADDED averageRating & numberOfReviews ---
  const { _id, name, brand, price, images, averageRating, numberOfReviews } = shoe;
  const imageUrl = images && images.length > 0 ? images[0] : 'https://via.placeholder.com/400x500.png?text=No+Image';

  const { wishlistSet, toggleItem } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isWishlisted = wishlistSet.has(_id);

  const formatPrice = (amount) => {
    return amount.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    });
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please log in to use the wishlist.');
      navigate('/login');
      return;
    }
    toggleItem(_id, shoe);
  }

  return (
    <div className="group relative rounded-xl border border-transparent hover:border-(--border-color) transition-all duration-300 bg-(--surface-color) shadow-sm hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20">
      <Link to={`/product/${_id}`} className="block overflow-hidden p-2">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-(--border-light) dark:bg-(--border-dark)">
          <img src={imageUrl} alt={name} className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105" />
        </div>
        <div className="mt-4 px-2">
          <p className="text-xs text-(--text-color)/70">{brand}</p>
          <h3 className="text-sm font-semibold text-(--text-color) truncate group-hover:text-(--brand-color) transition-colors mt-1">{name}</h3>
          
          {/* --- ADDED RATING SECTION --- */}
          {numberOfReviews > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <StaticStarRating rating={averageRating} size={14} />
              <span className="text-xs text-(--text-color)/50">({numberOfReviews})</span>
            </div>
          )}
        </div>
        <p className="mt-2 px-2 pb-1 text-base font-bold text-(--text-color)">
          {price ? formatPrice(price) : 'Price not available'}
        </p>
      </Link>
      
      <button
        onClick={handleWishlistToggle}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/70 dark:bg-black/70 backdrop-blur-sm shadow-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label="Toggle Wishlist"
      >
        <Heart 
            size={20} 
            className={`transition-all ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-(--text-color)/60'}`} 
        />
      </button>
    </div>
  );
};

export default ProductCard;