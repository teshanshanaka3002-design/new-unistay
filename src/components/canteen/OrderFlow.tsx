import React, { useState } from 'react';
import { Clock, MessageSquare, ArrowLeft, CheckCircle2, Info, ShoppingBag } from 'lucide-react';
import { Card, Button, Input, Badge } from '../UI';
import { OrderItem, Order } from '../../types/canteen';
import { motion, AnimatePresence } from 'motion/react';

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
      className="max-w-4xl mx-auto space-y-8 pb-20"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium transition-colors group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to Menu
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Order Details */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-slate-900 leading-tight">
              Finalize Your Order
            </h1>
            <p className="text-slate-500 font-medium">Pre-order from <span className="text-blue-600 font-bold">{canteenName}</span></p>
          </div>

          {/* Pickup Time Selection */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Clock size={24} className="text-blue-600" />
              Select Pickup Time
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setPickupTime(time)}
                  className={cn(
                    "p-4 rounded-2xl border-2 font-bold transition-all text-center",
                    pickupTime === time 
                      ? "border-blue-600 bg-blue-50 text-blue-600 shadow-lg shadow-blue-600/10" 
                      : "border-slate-100 bg-white text-slate-600 hover:border-blue-200 hover:bg-slate-50"
                  )}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare size={24} className="text-blue-600" />
              Optional Notes
            </h2>
            <textarea
              placeholder="Any special requests? (e.g., less spicy, no onions)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-32 p-4 rounded-2xl border border-slate-200 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
            />
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5">
          <Card className="p-8 space-y-8 sticky top-24 border-slate-100 shadow-2xl shadow-blue-600/5 rounded-3xl">
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <ShoppingBag size={24} className="text-blue-600" />
                Order Summary
              </h2>
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2 scrollbar-hide">
                {items.map((item) => (
                  <div key={item.menuItemId} className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="font-bold text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-blue-600">Rs. {item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-50">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-slate-900">Total Due</span>
                <span className="text-2xl font-bold text-blue-600">Rs. {total}</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                <CheckCircle2 size={18} />
                Cash on Pickup
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <Button 
                className="w-full h-14 text-lg rounded-2xl shadow-xl shadow-blue-600/20" 
                onClick={handleSubmit}
                disabled={!pickupTime || isSubmitting}
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order Now'}
              </Button>
            </div>

            <div className="pt-6 text-center">
              <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50 text-blue-700 text-[10px] leading-relaxed text-left">
                <Info size={14} className="flex-shrink-0 mt-0.5" />
                <p>By placing this order, you agree to collect it at the selected time and pay the total amount in cash at the canteen counter.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

import { cn } from '../../lib/utils';
