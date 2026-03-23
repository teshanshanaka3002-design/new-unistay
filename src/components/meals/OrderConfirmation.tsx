import React from 'react';
import { CheckCircle2, ShoppingBag, ArrowRight, MapPin, Calendar, Clock, Star, X } from 'lucide-react';
import { Order, Canteen } from '../../types/canteen';
import { Card, Button } from '../UI';
import { motion, AnimatePresence } from 'motion/react';
import { RatingStars } from '../reviews/RatingStars';
import { ReviewModal } from '../reviews/ReviewModal';

interface OrderConfirmationProps {
  order: Order;
  canteen: Canteen;
  onDone: () => void;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  order,
  canteen,
  onDone,
}) => {
  const [isReviewModalOpen, setIsReviewModalOpen] = React.useState(false);
  const [quickRating, setQuickRating] = React.useState(0);

  const [showQuickReview, setShowQuickReview] = React.useState(true);

  const handleQuickRating = (rating: number) => {
    setQuickRating(rating);
    setIsReviewModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-paper/30 flex items-center justify-center p-4">
      {/* Review Modal */}
      <ReviewModal 
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={(review) => {
          console.log('Post-order Review:', review);
          setShowQuickReview(false);
        }}
        title={`Rate your meal from ${canteen.name}`}
        categories={['Food Quality', 'Service Speed', 'Cleanliness']}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="w-full max-w-2xl"
      >
        <Card className="p-12 border-black/5 bg-white shadow-2xl shadow-black/10 space-y-12 rounded-[3rem] text-center">
          <div className="flex flex-col items-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-gold/10 flex items-center justify-center text-gold">
              <CheckCircle2 size={64} className="animate-pulse" />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-serif text-ink">Order Placed Successfully!</h1>
              <p className="text-ink/40 text-sm font-medium">Your order ID is <span className="font-bold text-ink">#{order.id.slice(-6).toUpperCase()}</span></p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="p-8 rounded-[2rem] bg-paper/50 border border-black/5 space-y-4">
              <div className="flex items-center gap-3 text-gold">
                <MapPin size={20} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Pickup Location</span>
              </div>
              <div className="space-y-1">
                <p className="font-serif text-xl text-ink">{canteen.name}</p>
                <p className="text-sm text-ink/40 font-medium leading-relaxed">{canteen.location}</p>
              </div>
            </div>

            <div className="p-8 rounded-[2rem] bg-paper/50 border border-black/5 space-y-4">
              <div className="flex items-center gap-3 text-gold">
                <Clock size={20} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Pickup Time</span>
              </div>
              <div className="space-y-1">
                <p className="font-serif text-xl text-ink">Ready in 15-20 mins</p>
                <p className="text-sm text-ink/40 font-medium leading-relaxed">Please pay Rs. {order.totalPrice} at the counter.</p>
              </div>
            </div>
          </div>

          {/* Post-order Experience: Quick Review */}
          <AnimatePresence>
            {showQuickReview && (
              <motion.div 
                initial={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0, overflow: 'hidden' }}
                className="p-6 rounded-[2rem] bg-gold/5 border border-gold/10 space-y-4 relative group"
              >
                <button 
                  onClick={() => setShowQuickReview(false)}
                  className="absolute top-4 right-4 w-6 h-6 rounded-full bg-white border border-gold/20 flex items-center justify-center text-ink/20 hover:text-ink hover:border-gold/40 transition-all opacity-0 group-hover:opacity-100"
                  title="Dismiss"
                >
                  <X size={12} />
                </button>
                <div className="space-y-1">
                  <h3 className="text-xl font-serif text-ink">How was your meal?</h3>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-ink/30">Quickly rate your experience</p>
                </div>
                <div className="flex justify-center">
                  <RatingStars 
                    rating={quickRating} 
                    size={24} 
                    interactive 
                    onRatingChange={handleQuickRating} 
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-8 pt-8 border-t border-black/5">
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center gap-2 text-ink/40">
                <ShoppingBag size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{order.items.length} Items Ordered</span>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {order.items.map((item, i) => (
                  <span key={i} className="px-4 py-1.5 rounded-full bg-paper text-ink/60 text-[10px] font-bold uppercase tracking-widest border border-black/5">
                    {item.quantity}x {item.name}
                  </span>
                ))}
              </div>
            </div>

            <button 
              onClick={onDone}
              className="w-full flex items-center justify-center gap-4 bg-ink text-white py-5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gold transition-all shadow-2xl shadow-ink/20 group"
            >
              Back to Dashboard
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
