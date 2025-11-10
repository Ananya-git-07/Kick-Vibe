import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { getShoeById, getShoeReviews, createReview } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { Heart, MessageSquare, Send } from 'lucide-react';
import toast from 'react-hot-toast'; // <-- IMPORT

// Reusable Components
import Loader from '../components/Loader';
import Button from '../components/Button';
import ProductImageGallery from '../components/ProductImageGallery';
import { StaticStarRating, InputStarRating } from '../components/StarRating';

// ... (ReviewForm and ProductReviews components remain the same) ...
const ReviewForm = ({ shoeId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a star rating.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const newReview = await createReview(shoeId, { rating, comment });
      onReviewSubmitted(newReview);
      setRating(0);
      setComment('');
      toast.success('Review submitted successfully!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to submit review.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="mt-8 bg-(--surface-color) p-6 rounded-lg border border-(--border-color)">
      <h3 className="text-lg font-semibold">Write a Review</h3>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Your Rating</label>
          <InputStarRating rating={rating} setRating={setRating} />
        </div>
        <div>
          <label htmlFor="comment" className="block text-sm font-medium mb-1">Your Comment</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-(--border-color) bg-(--bg-color) rounded-md focus:outline-none focus:ring-(--brand-color) focus:border-(--brand-color) sm:text-sm"
            placeholder="Share your thoughts about this product..."
            required
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
          {isLoading ? 'Submitting...' : 'Submit Review'} <Send size={16} />
        </Button>
      </form>
    </div>
  );
};
const ProductReviews = ({ shoeId }) => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getShoeReviews(shoeId);
        setReviews(data);
      } catch (err) {
        console.error("Failed to fetch reviews");
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, [shoeId]);
  
  const handleReviewSubmitted = (newReview) => {
    setReviews(prev => [newReview, ...prev]);
  };

  if (isLoading) return <Loader />;

  return (
    <div className="mt-16 border-t border-(--border-color) pt-12">
      <h2 className="text-2xl font-bold tracking-tight">Customer Reviews</h2>
      
      {reviews.length === 0 ? (
        <div className="mt-6 text-center text-(--text-color)/60 bg-(--surface-color) p-8 rounded-lg border border-(--border-color)">
            <MessageSquare className="mx-auto h-10 w-10" />
            <p className="mt-2 font-medium">No reviews yet</p>
            <p className="text-sm">Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="mt-6 space-y-8">
          {reviews.map((review) => (
            <div key={review._id} className="flex gap-4">
              <img src={review.user.avatar} alt={review.user.username} className="h-10 w-10 rounded-full object-cover" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                    <p className="font-semibold">{review.user.username}</p>
                    <StaticStarRating rating={review.rating} />
                </div>
                <p className="mt-2 text-(--text-color)/80 text-sm leading-relaxed">{review.comment}</p>
                <p className="mt-2 text-xs text-(--text-color)/50">{new Date(review.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {isAuthenticated && <ReviewForm shoeId={shoeId} onReviewSubmitted={handleReviewSubmitted} />}
    </div>
  );
};

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { wishlistSet, toggleItem } = useWishlist();
  const [shoe, setShoe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const addToCartControls = useAnimation();
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (selectedSize) {
      addToCartControls.start({
        scale: [1, 1.05, 1],
        transition: { duration: 0.5, ease: 'easeInOut' },
      });
    }
  }, [selectedSize, addToCartControls]);

  useEffect(() => {
    const fetchShoe = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const shoeData = await getShoeById(id);
        setShoe(shoeData);
        if (shoeData.sizes && shoeData.sizes.length > 0) {
          setSelectedSize(shoeData.sizes[0]);
        }
      } catch (err) {
        setError("Product not found or an error occurred.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchShoe();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!selectedSize) {
      toast.error("Please select a size."); // <-- REPLACE
      return;
    }
    setIsAdding(true);
    try {
      await addItem({ shoeId: shoe._id, quantity: 1, size: selectedSize });
      toast.success(`"${shoe.name}" added to cart!`); // <-- REPLACE
    } catch (error) {
      toast.error(error.message || "Could not add item to cart."); // <-- REPLACE
    } finally {
      setIsAdding(false);
    }
  };
  
  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to use the wishlist.'); // <-- REPLACE
      navigate('/login');
      return;
    }
    toggleItem(shoe._id);
  };

  const formatPrice = (amount) => {
    return amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 });
  };

  if (isLoading) return <div className="flex h-[60vh] items-center justify-center"><Loader size="lg" /></div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!shoe) return <div className="text-center py-20">Product details could not be loaded.</div>;

  const isWishlisted = wishlistSet.has(shoe._id);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        <ProductImageGallery images={shoe.images} />
        <div>
          <p className="text-sm font-medium text-(--brand-color) uppercase tracking-wider">{shoe.brand}</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">{shoe.name}</h1>
          <div className="mt-4 flex items-center gap-2">
            <StaticStarRating rating={shoe.averageRating} />
            <span className="text-sm text-(--text-color)/60">({shoe.numberOfReviews} reviews)</span>
          </div>
          <p className="mt-4 text-3xl font-bold">{formatPrice(shoe.price)}</p>
          <div className="mt-8 border-t border-(--border-color) pt-8">
            <h2 className="text-lg font-semibold">Description</h2>
            <p className="mt-2 text-(--text-color)/70 whitespace-pre-wrap leading-relaxed">{shoe.description}</p>
          </div>
          <div className="mt-8">
            <h2 className="text-lg font-semibold">Select Size</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {shoe.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-md border text-sm font-medium transition-all duration-200 ${
                    selectedSize === size
                      ? 'bg-(--brand-color) text-white border-(--brand-color) ring-2 ring-offset-2 ring-offset-(--bg-color) ring-(--brand-color)'
                      : 'bg-(--surface-color) border-(--border-color) hover:bg-(--border-light) dark:hover:bg-(--border-dark)'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
           <div className="mt-10 flex gap-4">
              {/* --- MODIFIED BUTTON --- */}
              <motion.div className="w-full" animate={addToCartControls}>
                <Button 
                  onClick={handleAddToCart}
                  className="w-full text-base py-4"
                  disabled={isAdding || shoe.stock === 0}
                >
                  {shoe.stock === 0 ? 'Out of Stock' : (isAdding ? 'Adding...' : 'Add to Cart')}
                </Button>
              </motion.div>
            <Button onClick={handleWishlistToggle} variant="secondary" className="px-4" aria-label="Toggle Wishlist">
              <Heart className={`h-6 w-6 transition-all ${isWishlisted ? 'text-red-500 fill-red-500' : ''}`} />
            </Button>
          </div>
          <p className="mt-4 text-sm text-center text-(--text-color)/60">
            {shoe.stock > 0 ? `Hurry! Only ${shoe.stock} left in stock.` : 'This item is currently out of stock.'}
          </p>
        </div>
      </div>
      
      <ProductReviews shoeId={id} />
    </div>
  );
};

export default ProductPage;