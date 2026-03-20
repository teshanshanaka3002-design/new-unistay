import React from 'react';
import { Star, MapPin, Home } from 'lucide-react';
import { Card, Button } from '../UI';
import { Accommodation } from '../../types/accommodation';
import { cn } from '../../lib/utils';

interface AccommodationCardProps {
  accommodation: Accommodation;
  onClick: (id: string) => void;
}

export const AccommodationCard: React.FC<AccommodationCardProps> = ({ accommodation, onClick }) => {
  return (
    <Card 
      className="p-0 group cursor-pointer hover:shadow-xl transition-all duration-300 border-slate-100 overflow-hidden"
      onClick={() => onClick(accommodation.id)}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={accommodation.image} 
          alt={accommodation.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-slate-900 flex items-center gap-1 shadow-sm">
          <Star size={12} className="text-amber-500 fill-amber-500" />
          {accommodation.rating}
        </div>
        <div className="absolute bottom-3 left-3 bg-blue-600/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider">
          {accommodation.university}
        </div>
      </div>
      <div className="p-5 space-y-3">
        <div className="space-y-1">
          <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">{accommodation.name}</h3>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <MapPin size={12} />
            <span>{accommodation.city}</span>
          </div>
        </div>
        
        <p className="text-xs text-slate-500 line-clamp-2 min-h-[32px]">
          {accommodation.description}
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          {accommodation.roomTypes.slice(0, 2).map((type, i) => (
            <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
              {type}
            </span>
          ))}
          {accommodation.roomTypes.length > 2 && (
            <span className="text-[10px] text-slate-400">+{accommodation.roomTypes.length - 2} more</span>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400">Starting from</span>
            <p className="text-blue-600 font-bold text-lg leading-none">
              Rs. {accommodation.price.toLocaleString()}
              <span className="text-xs text-slate-400 font-normal">/mo</span>
            </p>
          </div>
          <Button size="sm" variant="outline" className="rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all h-9">
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
};
