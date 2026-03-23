import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export const RatingStars: React.FC<RatingStarsProps> = ({ 
  rating, 
  maxRating = 5, 
  size = 20, 
  interactive = false,
  onRatingChange,
  className
}) => {
  const [hoverRating, setHoverRating] = React.useState(0);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[...Array(maxRating)].map((_, i) => {
        const starValue = i + 1;
        const isActive = interactive ? (hoverRating || rating) >= starValue : rating >= starValue;
        
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            onClick={() => interactive && onRatingChange?.(starValue)}
            onKeyDown={(e) => {
              if (!interactive || !onRatingChange) return;
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onRatingChange(starValue);
              }
              if (e.key === 'ArrowRight' && starValue < maxRating) {
                e.preventDefault();
                onRatingChange(starValue + 1);
              }
              if (e.key === 'ArrowLeft' && starValue > 1) {
                e.preventDefault();
                onRatingChange(starValue - 1);
              }
            }}
            aria-label={`Rate ${starValue} out of ${maxRating} stars`}
            className={cn(
              "transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-gold/50 rounded-sm",
              interactive ? "cursor-pointer hover:scale-125" : "cursor-default",
              isActive ? "text-gold fill-gold" : "text-ink/10 fill-transparent"
            )}
          >
            <Star size={size} />
          </button>
        );
      })}
    </div>
  );
};
