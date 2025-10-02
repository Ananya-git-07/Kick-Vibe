import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getShoeReviews, createReview } from '../lib/api';
import Button from './Button';
import { Star } from 'lucide-react';

const ReviewsSection = ({ shoeId }) => {
  const { isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await getShoeReviews(shoeId);
      setReviews(data);
    } catch (err) {
      setError('Could not load reviews.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [shoeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment) {
      setFormError('Please write a comment.');
      return;
    }
    setIsSubmitting(true);
    setFormError('');
    try {
      await createReview(shoeId, { rating, comment });
      setComment('');
      setRating(5);
      fetchReviews(); // Refetch reviews to show the new one
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-12 border-t border-(--border-color) pt-12">
      <h2 className="text-2xl font-bold tracking-tight">Customer Reviews</h2>
      {isAuthenticated && (
        <form onSubmit={handleSubmit} className="my-8 p-6 bg-(--surface-color) border border-(--border-color) rounded-lg">
          <h3 className="text-lg font-semibold">Write a Review</h3>
          <div className="mt-4">
            <label className="block text-sm font-medium">Rating</label>
            <div className="flex items-center gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`cursor-pointer h-6 w-6 ${rating >= star ? 'text-yellow-400 fill-current' : 'text-(--text-color)/30'}`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="comment" className="block text-sm font-medium">Comment</label>
            <textarea
              id="comment"
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-1 w-full rounded-md border border-(--border-color) bg-(--bg-color) p-2 focus:ring-(--brand-color) focus:border-(--brand-color)"
            ></textarea>
          </div>
          {formError && <p className="text-sm text-red-500 mt-2">{formError}</p>}
          <Button type="submit" disabled={isSubmitting} className="mt-4">
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      )}
      <div className="mt-6 space-y-6">
        {loading ? <p>Loading reviews...</p> : error ? <p className="text-red-500">{error}</p> : reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="flex gap-4">
              <img src={review.user.avatar} alt={review.user.username} className="h-10 w-10 rounded-full" />
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{review.user.username}</p>
                  <div className="flex">
                    {[...Array(review.rating)].map((_, i) => <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />)}
                  </div>
                </div>
                <p className="mt-2 text-(--text-color)/80">{review.comment}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-(--text-color)/60">No reviews yet. Be the first to write one!</p>
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;