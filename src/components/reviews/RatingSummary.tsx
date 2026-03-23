import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

interface RatingSummaryProps {
  averageRating: number;
  totalReviews: number;
  breakdown: { [key: number]: number }; // e.g., { 5: 80, 4: 20, 3: 10, 2: 5, 1: 5 }
  className?: string;
}

export const RatingSummary: React.FC<RatingSummaryProps> = ({ 
  averageRating, 
  totalReviews, 
  breakdown,
  className
}) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-12 gap-12 items-center", className)}>
      {/* Average Section */}
      <div className="md:col-span-4 text-center space-y-4">
        <div className="space-y-1">
          <p className="text-7xl font-serif text-ink">{averageRating.toFixed(1)}</p>
          <div className="flex justify-center gap-1 text-gold">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={24} 
                fill={i < Math.round(averageRating) ? "currentColor" : "none"} 
                className={i < Math.round(averageRating) ? "" : "text-ink/10"}
              />
            ))}
          </div>
        </div>
        <p className="text-sm font-bold uppercase tracking-widest text-ink/40">
          Based on {totalReviews} reviews
        </p>
      </div>

      {/* Breakdown Section */}
      <div className="md:col-span-8 space-y-3">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = breakdown[star] || 0;
          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
          
          return (
            <div key={star} className="flex items-center gap-4 group">
              <div className="flex items-center gap-1.5 w-12 shrink-0">
                <span className="text-sm font-bold text-ink/60">{star}</span>
                <Star size={12} className="text-gold fill-gold" />
              </div>
              <div className="flex-1 h-2.5 bg-paper rounded-full overflow-hidden border border-black/5">
                <div 
                  className="h-full bg-gold transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(212,175,55,0.3)]"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-xs font-bold text-ink/30 w-10 text-right group-hover:text-ink/60 transition-colors">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
