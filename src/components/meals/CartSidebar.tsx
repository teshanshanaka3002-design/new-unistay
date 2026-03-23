import React from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { OrderItem } from '../../types/canteen';
import { motion, AnimatePresence } from 'motion/react';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
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
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            <div className="p-8 border-b border-black/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-paper flex items-center justify-center text-ink">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-serif text-ink">Your Cart</h2>
                  <p className="text-[10px] text-ink/40 font-bold uppercase tracking-widest">{items.length} Items</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full hover:bg-paper flex items-center justify-center text-ink/40 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-24 h-24 rounded-full bg-paper flex items-center justify-center text-ink/20">
                    <ShoppingBag size={48} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-serif text-ink">Your cart is empty</h3>
                    <p className="text-ink/40 text-sm">Add some delicious meals to get started!</p>
                  </div>
                  <button 
                    onClick={onClose}
                    className="px-8 py-3 rounded-full bg-ink text-white text-xs font-bold uppercase tracking-widest hover:bg-gold transition-all"
                  >
                    Start Ordering
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.menuItemId} className="flex gap-6 group">
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start gap-4">
                        <h4 className="text-lg font-serif text-ink group-hover:text-gold transition-colors">{item.name}</h4>
                        <span className="text-ink font-bold text-sm">Rs. {item.price * item.quantity}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 bg-paper rounded-full px-3 py-1.5 border border-black/5">
                          <button 
                            onClick={() => onUpdateQuantity(item.menuItemId, -1)}
                            className="text-ink/40 hover:text-ink transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-xs font-bold text-ink min-w-[16px] text-center">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.menuItemId, 1)}
                            className="text-ink/40 hover:text-ink transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button 
                          onClick={() => onRemoveItem(item.menuItemId)}
                          className="text-ink/20 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-8 bg-paper/50 border-t border-black/5 space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-ink/40 text-sm font-medium">Subtotal</span>
                  <span className="text-ink font-bold text-xl">Rs. {total}</span>
                </div>
                <button 
                  onClick={onCheckout}
                  className="w-full flex items-center justify-center gap-4 bg-ink text-white py-5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gold transition-all shadow-2xl shadow-ink/20 group"
                >
                  Proceed to Checkout
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
