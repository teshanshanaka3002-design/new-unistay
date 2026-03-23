import React, { useState, useMemo } from 'react';
import { Filter, SortAsc, SortDesc, MessageSquareOff } from 'lucide-react';
import { ReviewCard } from './ReviewCard';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  university?: string;
  isVerified?: boolean;
}

interface ReviewListProps {
  reviews: Review[];
  className?: string;
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews, className }) => {
  const [sortBy, setSortBy] = useState<'latest' | 'highest' | 'lowest'>('latest');
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const filteredAndSortedReviews = useMemo(() => {
    let result = [...reviews];

    // Filter
    if (filterRating !== null) {
      result = result.filter(r => r.rating === filterRating);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'latest') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'highest') return b.rating - a.rating;
      if (sortBy === 'lowest') return a.rating - b.rating;
      return 0;
    });

    return result;
  }, [reviews, sortBy, filterRating]);

  return (
    <div className={cn("space-y-12", className)}>
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-8 pb-8 border-b border-black/5">
        <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide pb-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink/30 shrink-0">Filter by Rating:</p>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterRating(null)}
              className={cn(
                "px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all",
                filterRating === null 
                  ? "bg-ink text-gold border-ink shadow-lg shadow-ink/10" 
                  : "bg-paper text-ink/40 border-black/5 hover:bg-white hover:text-ink"
              )}
            >
              All
            </button>
            {[5, 4, 3, 2, 1].map(rating => (
              <button
                key={rating}
                onClick={() => setFilterRating(rating)}
                className={cn(
                  "px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all flex items-center gap-1.5",
                  filterRating === rating 
                    ? "bg-ink text-gold border-ink shadow-lg shadow-ink/10" 
                    : "bg-paper text-ink/40 border-black/5 hover:bg-white hover:text-ink"
                )}
              >
                {rating} ★
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink/30">Sort by:</p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-paper border border-black/5 rounded-full px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-ink/60 outline-none focus:ring-2 focus:ring-gold/20 transition-all cursor-pointer appearance-none hover:bg-white"
          >
            <option value="latest">Latest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <AnimatePresence mode="popLayout">
          {filteredAndSortedReviews.length > 0 ? (
            filteredAndSortedReviews.map((review) => (
              <motion.div
                key={review.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              >
                <ReviewCard {...review} />
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-32 flex flex-col items-center justify-center space-y-6 text-center"
            >
              <div className="w-24 h-24 rounded-full bg-paper flex items-center justify-center text-ink/20 shadow-inner">
                <MessageSquareOff size={48} />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-serif text-ink">No reviews found</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-ink/30">Try adjusting your filters</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
