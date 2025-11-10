import { Star } from 'lucide-react';
import { useState } from 'react';

// For displaying static ratings
export const StaticStarRating = ({ rating, size = 16 }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} size={size} className="text-yellow-400 fill-yellow-400" />
      ))}
      {halfStar && (
        <Star key="half" size={size} className="text-yellow-400" style={{ clipPath: 'inset(0 50% 0 0)' }} />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} size={size} className="text-gray-300 dark:text-gray-600" />
      ))}
    </div>
  );
};


// For input forms
export const InputStarRating = ({ rating, setRating }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <label key={index}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => setRating(ratingValue)}
              className="hidden"
            />
            <Star
              size={24}
              className="cursor-pointer transition-colors"
              color={ratingValue <= (hover || rating) ? '#facc15' : '#e5e7eb'}
              fill={ratingValue <= (hover || rating) ? '#facc15' : 'transparent'}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(0)}
            />
          </label>
        );
      })}
    </div>
  );
};