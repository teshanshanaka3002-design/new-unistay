import React from 'react';
import { Star, MapPin, ArrowRight } from 'lucide-react';
import { Card, Button } from '../UI';
import { Canteen } from '../../types/canteen';

interface CanteenCardProps {
  canteen: Canteen;
  onClick: (id: string) => void;
}

export const CanteenCard: React.FC<CanteenCardProps> = ({ canteen, onClick }) => {
  return (
    <Card 
      className="p-0 group cursor-pointer hover:shadow-xl transition-all duration-300 border-slate-100 overflow-hidden"
      onClick={() => onClick(canteen.id)}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={canteen.image} 
          alt={canteen.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-slate-900 flex items-center gap-1 shadow-sm">
          <Star size={12} className="text-amber-500 fill-amber-500" />
          {canteen.rating}
        </div>
      </div>
      <div className="p-5 space-y-3">
        <div className="space-y-1">
          <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{canteen.name}</h3>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <MapPin size={12} />
            <span>{canteen.location}</span>
          </div>
        </div>
        
        <p className="text-xs text-slate-500 line-clamp-2">
          {canteen.description}
        </p>

        <div className="pt-3 flex items-center text-blue-600 font-bold text-sm gap-2">
          View Menu <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Card>
  );
};
