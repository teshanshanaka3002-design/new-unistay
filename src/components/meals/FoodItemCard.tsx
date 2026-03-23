import React from 'react';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { MenuItem } from '../../types/canteen';
import { Card, Badge } from '../UI';
import { motion } from 'motion/react';

interface FoodItemCardProps {
  item: MenuItem;
  quantity: number;
  onAddToCart: (item: MenuItem) => void;
  onRemoveFromCart: (id: string) => void;
}

export const FoodItemCard: React.FC<FoodItemCardProps> = ({
  item,
  quantity,
  onAddToCart,
  onRemoveFromCart,
}) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden border-black/5 bg-white group shadow-sm hover:shadow-xl transition-all duration-300">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 left-4">
            <Badge className="bg-white/90 backdrop-blur-md text-ink border-none font-bold uppercase text-[9px] tracking-widest px-3 py-1 rounded-full shadow-sm">
              {item.category}
            </Badge>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between items-start gap-4">
              <h3 className="text-lg font-serif text-ink group-hover:text-gold transition-colors leading-tight">{item.name}</h3>
              <span className="text-gold font-bold text-lg shrink-0">Rs. {item.price}</span>
            </div>
            <p className="text-ink/40 text-xs line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          </div>
          
          <div className="pt-4 flex items-center justify-between border-t border-black/5">
            {quantity > 0 ? (
              <div className="flex items-center gap-4 bg-paper/50 rounded-full px-4 py-2 border border-black/5">
                <button 
                  onClick={() => onRemoveFromCart(item.id)}
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-ink hover:bg-ink hover:text-white transition-all shadow-sm"
                >
                  <Minus size={16} />
                </button>
                <span className="text-sm font-bold text-ink min-w-[20px] text-center">{quantity}</span>
                <button 
                  onClick={() => onAddToCart(item)}
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-ink hover:bg-ink hover:text-white transition-all shadow-sm"
                >
                  <Plus size={16} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => onAddToCart(item)}
                className="w-full flex items-center justify-center gap-3 bg-ink text-white py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gold transition-all shadow-lg shadow-ink/10"
              >
                <ShoppingCart size={16} />
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
