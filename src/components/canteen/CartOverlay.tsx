import React from 'react';
import { ShoppingCart, X, Plus, Minus, ArrowRight, Clock } from 'lucide-react';
import { Card, Button, Badge } from '../UI';
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[60] flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20">
                  <ShoppingCart size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Your Cart</h2>
                  <p className="text-xs text-slate-500 font-medium">{items.length} items selected</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length > 0 ? (
                items.map((item) => (
                  <div key={item.menuItemId} className="flex items-start gap-4 group">
                    <div className="flex-1 space-y-1">
                      <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.name}</h3>
                      <p className="text-sm text-blue-600 font-bold">Rs. {item.price}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 px-2 py-1 rounded-xl border border-slate-100">
                      <button 
                        onClick={() => onUpdateQuantity(item.menuItemId, -1)}
                        className="w-8 h-8 rounded-lg bg-white text-slate-600 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-all shadow-sm border border-slate-100"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-bold text-slate-900 min-w-[20px] text-center">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.menuItemId, 1)}
                        className="w-8 h-8 rounded-lg bg-white text-slate-600 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm border border-slate-100"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
                  <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                    <ShoppingCart size={40} />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900">Your cart is empty</p>
                    <p className="text-sm text-slate-500">Add some delicious food to get started!</p>
                  </div>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-slate-500 font-medium">
                    <span>Subtotal</span>
                    <span>Rs. {total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-slate-900">Total</span>
                    <span className="text-2xl font-bold text-blue-600">Rs. {total}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50 text-blue-700 text-xs leading-relaxed border border-blue-100">
                  <Clock size={16} className="flex-shrink-0 mt-0.5" />
                  <p>This is a pre-order system. You will need to collect your food at the canteen and pay by cash on pickup.</p>
                </div>

                <Button 
                  className="w-full h-14 text-lg rounded-2xl shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 group"
                  onClick={onProceed}
                >
                  Proceed to Order
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
