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
    <div className="group relative rounded-2xl border border-(--border-color)/50 hover:border-(--brand-color)/50 transition-all duration-500 bg-(--surface-color) shadow-md hover:shadow-2xl hover:shadow-(--brand-color)/10 overflow-hidden">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-(--brand-color)/0 via-(--brand-secondary)/0 to-(--brand-color)/0 group-hover:from-(--brand-color)/5 group-hover:via-(--brand-secondary)/5 group-hover:to-(--brand-color)/5 transition-all duration-500 pointer-events-none rounded-2xl" />
      
      <Link to={`/product/${_id}`} className="block overflow-hidden p-3">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-gradient-to-br from-(--border-light) to-(--border-color)/30 dark:from-(--border-dark) dark:to-(--border-color)/30">
          {/* Shimmer effect */}
          <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <img 
            src={imageUrl} 
            alt={name} 
            className="h-full w-full object-cover object-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-2" 
          />
          {/* Gradient overlay on image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        <div className="mt-4 px-2 space-y-2">
          <p className="text-xs font-bold text-(--brand-color) uppercase tracking-wider">{brand}</p>
          <h3 className="text-sm font-bold text-(--text-color) line-clamp-2 group-hover:text-(--brand-color) transition-colors mt-1 leading-tight">{name}</h3>
          
          {numberOfReviews > 0 && (
            <div className="flex items-center gap-2">
              <StaticStarRating rating={averageRating} size={14} />
              <span className="text-xs text-(--text-color)/70 font-medium">({numberOfReviews})</span>
            </div>
          )}
        </div>
        <div className="mt-3 px-2 pb-2 flex items-center justify-between">
          <p className="text-lg font-extrabold text-(--text-color)">
            {price ? formatPrice(price) : 'Price not available'}
          </p>
          <span className="text-xs text-(--text-color)/70 font-medium opacity-0 group-hover:opacity-100 transition-opacity">View →</span>
        </div>
      </Link>
      
      <button
        onClick={handleWishlistToggle}
        className="absolute top-5 right-5 z-10 p-2.5 rounded-full glass border border-white/20 dark:border-white/10 shadow-lg transition-all duration-300 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 focus:opacity-100 focus:scale-100 hover:scale-110 active:scale-95"
        aria-label="Toggle Wishlist"
      >
        <Heart 
          size={20} 
          className={`transition-all duration-300 ${isWishlisted ? 'text-red-500 fill-red-500 scale-110' : 'text-(--text-color)/70'}`} 
        />
      </button>
    </div>
  );
};

export default ProductCard;