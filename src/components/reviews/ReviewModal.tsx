import React, { useState, useEffect } from 'react';
import { X, Star, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button, Card } from '../UI';
import { RatingStars } from './RatingStars';
import { cn } from '../../lib/utils';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: { rating: number; comment: string; categories?: { [key: string]: number } }) => void;
  title: string;
  categories?: string[]; // e.g., ['Cleanliness', 'Safety', 'Facilities']
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title,
  categories = []
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [categoryRatings, setCategoryRatings] = useState<{ [key: string]: number }>(
    categories.reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {})
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [touched, setTouched] = useState({ rating: false, comment: false });

  // Validation Logic
  const commentMinLength = 10;
  const commentMaxLength = 300;
  
  const errors = {
    rating: touched.rating && rating === 0 ? "Please select a rating" : null,
    comment: touched.comment && comment.length < commentMinLength 
      ? `Review must be at least ${commentMinLength} characters` 
      : comment.length > commentMaxLength 
        ? `Review must be under ${commentMaxLength} characters`
        : null
  };

  const isValid = rating > 0 && comment.length >= commentMinLength && comment.length <= commentMaxLength;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ rating: true, comment: true });
    
    if (!isValid) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onSubmit({ 
      rating, 
      comment, 
      categories: categories.length > 0 ? categoryRatings : undefined 
    });
    
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      // Reset form
      setRating(0);
      setComment('');
      setCategoryRatings(categories.reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {}));
      setIsSubmitting(false);
      setTouched({ rating: false, comment: false });
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-ink/40 backdrop-blur-xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="p-8 space-y-8 border-white/20 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] bg-white rounded-[2.5rem] relative overflow-hidden">
              {isSuccess && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-white/95 backdrop-blur-md z-50 flex flex-col items-center justify-center space-y-6 text-center p-8"
                >
                  <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 w-10 h-10 rounded-full bg-paper flex items-center justify-center text-ink/40 hover:text-ink hover:bg-paper/80 transition-all"
                  >
                    <X size={20} />
                  </button>
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-2xl shadow-emerald-100 animate-bounce">
                    <CheckCircle2 size={32} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-serif text-ink">Review submitted successfully!</h3>
                    <p className="text-ink/40 font-bold uppercase tracking-widest text-[10px]">Thank you for your feedback</p>
                  </div>
                  <Button 
                    onClick={onClose}
                    className="h-12 px-6 rounded-full bg-ink text-gold text-[9px] font-bold uppercase tracking-widest hover:scale-105 transition-all"
                  >
                    Close Window
                  </Button>
                </motion.div>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-serif text-ink leading-tight">{title}</h2>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-ink/30">Share your experience with other students</p>
                </div>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-paper flex items-center justify-center text-ink/40 hover:text-ink hover:bg-paper/80 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Main Rating */}
                <div className={cn(
                  "space-y-4 p-6 rounded-[1.5rem] bg-paper/30 border transition-all",
                  errors.rating ? "border-red-500/50 bg-red-50/10" : rating > 0 ? "border-emerald-500/50 bg-emerald-50/10" : "border-black/5"
                )}>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-ink/40 text-center">Overall Rating (Required)</p>
                  <div className="flex justify-center">
                    <RatingStars 
                      rating={rating} 
                      size={36} 
                      interactive 
                      onRatingChange={(val) => {
                        setRating(val);
                        setTouched(prev => ({ ...prev, rating: true }));
                      }} 
                    />
                  </div>
                  {errors.rating && (
                    <p className="text-[10px] text-red-500 text-center font-medium animate-pulse">{errors.rating}</p>
                  )}
                  {rating > 0 && !errors.rating && (
                    <p className="text-[10px] text-emerald-500 text-center font-medium">Looks good!</p>
                  )}
                </div>

                {/* Category Ratings */}
                {categories.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {categories.map((cat) => (
                      <div key={cat} className="space-y-2">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-ink/40">{cat}</p>
                        <RatingStars 
                          rating={categoryRatings[cat]} 
                          size={16} 
                          interactive 
                          onRatingChange={(val) => setCategoryRatings(prev => ({ ...prev, [cat]: val }))} 
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Comment */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-ink/40">Your Review</p>
                    <span className={cn(
                      "text-[9px] font-mono",
                      comment.length > commentMaxLength ? "text-red-500" : "text-ink/30"
                    )}>
                      {comment.length} / {commentMaxLength}
                    </span>
                  </div>
                  <textarea
                    required
                    value={comment}
                    onBlur={() => setTouched(prev => ({ ...prev, comment: true }))}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us about your experience..."
                    className={cn(
                      "w-full h-32 p-6 rounded-[1.5rem] border transition-all outline-none text-ink text-base font-light resize-none",
                      errors.comment ? "border-red-500/50 bg-red-50/10 focus:ring-red-500/20" : 
                      touched.comment && comment.length >= commentMinLength ? "border-emerald-500/50 bg-emerald-50/10 focus:ring-emerald-500/20" : 
                      "bg-paper/30 border-black/5 focus:bg-white focus:ring-2 focus:ring-gold/20 focus:border-gold/30"
                    )}
                  />
                  {errors.comment && (
                    <p className="text-[10px] text-red-500 font-medium">{errors.comment}</p>
                  )}
                  {touched.comment && !errors.comment && comment.length >= commentMinLength && (
                    <p className="text-[10px] text-emerald-500 font-medium">Looks good!</p>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1 h-12 rounded-full text-[10px] font-bold uppercase tracking-widest border-black/10 hover:bg-paper transition-all"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className={cn(
                      "flex-[2] h-12 rounded-full text-[10px] font-bold uppercase tracking-widest bg-ink text-gold hover:bg-ink/90 shadow-xl shadow-ink/10 transition-all flex items-center justify-center gap-2",
                      (!isValid || isSubmitting) && "opacity-50 cursor-not-allowed grayscale"
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        Submitting...
                      </>
                    ) : (
                      "Submit Review"
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
