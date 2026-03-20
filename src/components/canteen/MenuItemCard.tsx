import React from 'react';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { Card, Button } from '../UI';
import { MenuItem } from '../../types/canteen';

interface MenuItemCardProps {
  item: MenuItem;
  quantity: number;
  onAdd: (item: MenuItem) => void;
  onRemove: (id: string) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, quantity, onAdd, onRemove }) => {
  return (
    <Card className="p-0 group hover:shadow-lg transition-all duration-300 border-slate-100 overflow-hidden flex flex-col h-full">
      <div className="relative h-40 overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-blue-600 shadow-sm">
          Rs. {item.price}
        </div>
      </div>
      <div className="p-4 space-y-3 flex flex-col flex-1">
        <div className="space-y-1">
          <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">{item.name}</h3>
          <p className="text-xs text-slate-500 line-clamp-2 min-h-[32px]">
            {item.description}
          </p>
        </div>
        
        <div className="pt-3 mt-auto flex items-center justify-between">
          {quantity > 0 ? (
            <div className="flex items-center gap-3 bg-blue-50 px-2 py-1 rounded-xl border border-blue-100">
              <button 
                onClick={() => onRemove(item.id)}
                className="w-8 h-8 rounded-lg bg-white text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm"
              >
                <Minus size={16} />
              </button>
              <span className="font-bold text-blue-600 min-w-[20px] text-center">{quantity}</span>
              <button 
                onClick={() => onAdd(item)}
                className="w-8 h-8 rounded-lg bg-white text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm"
              >
                <Plus size={16} />
              </button>
            </div>
          ) : (
            <Button 
              size="sm" 
              className="w-full rounded-xl flex items-center justify-center gap-2 h-10"
              onClick={() => onAdd(item)}
            >
              <ShoppingCart size={16} />
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
