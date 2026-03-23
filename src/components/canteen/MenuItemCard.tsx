import React from 'react';
import { Plus, Minus, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { MenuItem } from '../../types/canteen';

interface MenuItemCardProps {
  item: MenuItem;
  quantity: number;
  onAdd: (item: MenuItem) => void;
  onRemove: (id: string) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, quantity, onAdd, onRemove }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group space-y-6"
    >
      <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500 bg-white">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          referrerPolicy="no-referrer"
        />
        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
          <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-ink shadow-lg">
            LKR {item.price}
          </div>
          
          {quantity > 0 ? (
            <div className="flex items-center gap-3 bg-ink text-white p-1 rounded-full shadow-xl">
              <button 
                onClick={() => onRemove(item.id)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="font-bold text-xs min-w-[20px] text-center">{quantity}</span>
              <button 
                onClick={() => onAdd(item)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => onAdd(item)}
              className="w-12 h-12 bg-gold text-ink rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-300"
            >
              <Plus size={20} />
            </button>
          )}
        </div>
      </div>
      
      <div className="px-2 space-y-2">
        <h3 className="text-xl font-serif text-ink group-hover:text-gold transition-colors line-clamp-1">{item.name}</h3>
        <p className="text-xs text-ink/40 leading-relaxed line-clamp-2">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
};
