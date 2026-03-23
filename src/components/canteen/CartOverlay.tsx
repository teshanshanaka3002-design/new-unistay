import React from 'react';
import { ShoppingBag, X, Plus, Minus, ArrowRight, Clock } from 'lucide-react';
import { OrderItem } from '../../types/canteen';
import { motion, AnimatePresence } from 'motion/react';

interface CartOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onProceed: () => void;
}

export const CartOverlay: React.FC<CartOverlayProps> = ({ isOpen, onClose, items, onUpdateQuantity, onProceed }) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
          />
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-paper shadow-2xl z-[60] flex flex-col"
          >
            <div className="p-10 border-b border-black/5 flex items-center justify-between bg-white">
              <div className="space-y-1">
                <h2 className="text-3xl font-serif text-ink">Your Selection</h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-ink/30">{items.length} items curated</p>
              </div>
              <button 
                onClick={onClose}
                className="w-12 h-12 rounded-full border border-black/5 flex items-center justify-center text-ink/40 hover:text-ink hover:bg-paper transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-10">
              {items.length > 0 ? (
                items.map((item) => (
                  <div key={item.menuItemId} className="flex items-start gap-6 group">
                    <div className="flex-1 space-y-2">
                      <h3 className="text-xl font-serif text-ink group-hover:text-gold transition-colors">{item.name}</h3>
                      <p className="text-sm font-bold text-gold">LKR {item.price}</p>
                    </div>
                    <div className="flex items-center gap-4 bg-white p-1 rounded-full border border-black/5 shadow-sm">
                      <button 
                        onClick={() => onUpdateQuantity(item.menuItemId, -1)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-ink/40 hover:text-ink hover:bg-paper transition-all"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-bold text-xs text-ink min-w-[20px] text-center">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.menuItemId, 1)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-ink/40 hover:text-ink hover:bg-paper transition-all"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40">
                  <div className="w-24 h-24 rounded-full border border-dashed border-ink/20 flex items-center justify-center">
                    <ShoppingBag size={40} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl font-serif text-ink">Empty Selection</p>
                    <p className="text-sm text-ink/50">Your culinary journey begins with a single choice.</p>
                  </div>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-10 border-t border-black/5 bg-white space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-ink/30">
                    <span>Subtotal</span>
                    <span>LKR {total}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-2xl font-serif text-ink">Total</span>
                    <span className="text-4xl font-serif text-gold">LKR {total}</span>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 rounded-3xl bg-paper border border-black/5 text-[10px] font-bold uppercase tracking-widest text-ink/40 leading-relaxed">
                  <Clock size={16} className="flex-shrink-0 mt-0.5" />
                  <p>Pre-order system. Collection at canteen. Cash on pickup only.</p>
                </div>

                <button 
                  className="w-full bg-ink text-white py-6 rounded-2xl font-bold text-sm uppercase tracking-widest hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl"
                  onClick={onProceed}
                >
                  Proceed to Order
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
