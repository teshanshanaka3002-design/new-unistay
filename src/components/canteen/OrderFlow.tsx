import React, { useState } from 'react';
import { Clock, MessageSquare, ArrowLeft, CheckCircle2, Info, ShoppingBag } from 'lucide-react';
import { OrderItem, Order } from '../../types/canteen';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface OrderFlowProps {
  items: OrderItem[];
  canteenId: string;
  canteenName: string;
  onBack: () => void;
  onSubmit: (order: Partial<Order>) => void;
}

export const OrderFlow: React.FC<OrderFlowProps> = ({ items, canteenId, canteenName, onBack, onSubmit }) => {
  const [pickupTime, setPickupTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async () => {
    if (!pickupTime) return;
    setIsSubmitting(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    onSubmit({
      canteenId,
      canteenName,
      items,
      totalPrice: total,
      pickupTime,
      notes,
      studentId: 'stud-123' // Mock student ID
    });
    setIsSubmitting(false);
  };

  const timeSlots = [
    '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM'
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-12 pb-32"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ink/40 hover:text-ink transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Menu
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
        {/* Left Column: Order Details */}
        <div className="lg:col-span-7 space-y-16">
          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl font-serif text-ink leading-[0.85]">
              Finalize <br />
              <span className="italic">Your Order.</span>
            </h1>
            <p className="text-xl text-ink/50 leading-relaxed">
              Curating your meal from <span className="text-ink font-bold">{canteenName}</span>
            </p>
          </div>

          {/* Pickup Time Selection */}
          <div className="space-y-8">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-ink/30 flex items-center gap-3">
              <Clock size={14} />
              Select Pickup Time
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setPickupTime(time)}
                  className={cn(
                    "p-6 rounded-2xl border font-bold transition-all text-center text-sm tracking-widest uppercase",
                    pickupTime === time 
                      ? "border-gold bg-gold text-white shadow-2xl shadow-gold/20 scale-[1.02]" 
                      : "border-black/5 bg-white text-ink/40 hover:border-black/10 hover:bg-paper"
                  )}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-8">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-ink/30 flex items-center gap-3">
              <MessageSquare size={14} />
              Optional Notes
            </h2>
            <textarea
              placeholder="Any special requests? (e.g., less spicy, no onions)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-40 p-8 rounded-[2rem] border border-black/5 bg-white text-ink font-medium focus:ring-4 focus:ring-gold/10 transition-all outline-none resize-none text-lg"
            />
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5">
          <div className="p-10 rounded-[3rem] bg-white border border-black/5 shadow-2xl space-y-10 sticky top-32">
            <div className="space-y-8">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-ink/30 flex items-center gap-3">
                <ShoppingBag size={14} />
                Order Summary
              </h2>
              <div className="space-y-6 max-h-80 overflow-y-auto pr-4 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.menuItemId} className="flex justify-between items-start group">
                    <div className="space-y-1">
                      <p className="font-serif text-xl text-ink group-hover:text-gold transition-colors">{item.name}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-ink/30">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-serif text-lg text-gold">LKR {item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6 pt-10 border-t border-black/5">
              <div className="flex justify-between items-end">
                <span className="text-2xl font-serif text-ink">Total Due</span>
                <span className="text-4xl font-serif text-gold">LKR {total}</span>
              </div>
              <div className="flex items-center gap-3 text-ink font-bold text-[10px] uppercase tracking-widest bg-paper p-4 rounded-2xl border border-black/5">
                <CheckCircle2 size={16} className="text-gold" />
                Cash on Pickup Only
              </div>
            </div>

            <div className="space-y-4">
              <button 
                className="w-full bg-ink text-white py-6 rounded-2xl font-bold text-sm uppercase tracking-widest hover:scale-[1.02] transition-all duration-300 disabled:opacity-20 shadow-2xl" 
                onClick={handleSubmit}
                disabled={!pickupTime || isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Place Order Now'}
              </button>
              
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-paper/50 text-ink/30 text-[9px] font-bold uppercase tracking-widest leading-relaxed">
                <Info size={14} className="flex-shrink-0 mt-0.5" />
                <p>By placing this order, you agree to collect it at the selected time and pay the total amount in cash at the canteen counter.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
