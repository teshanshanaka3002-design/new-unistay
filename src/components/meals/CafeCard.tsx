import React from 'react';
import { MapPin, Star, ChevronRight } from 'lucide-react';
import { Canteen } from '../../types/canteen';
import { Card } from '../UI';
import { Badge } from '../UI';
import { motion } from 'motion/react';

interface CafeCardProps {
  cafe: Canteen;
  onViewMenu: (cafe: Canteen) => void;
}

export const CafeCard: React.FC<CafeCardProps> = ({ cafe, onViewMenu }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border-black/5 bg-white group cursor-pointer" onClick={() => onViewMenu(cafe)}>
        <div className="relative aspect-[16/10] overflow-hidden">
          <img 
            src={cafe.image} 
            alt={cafe.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge className="bg-white/90 backdrop-blur-md text-ink border-none font-bold uppercase text-[10px] tracking-widest px-3 py-1 rounded-full shadow-sm">
              {cafe.university}
            </Badge>
          </div>
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-1 bg-ink/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-sm">
              <Star size={12} className="text-gold fill-gold" />
              {cafe.rating}
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="space-y-1">
            <h3 className="text-xl font-serif text-ink group-hover:text-gold transition-colors">{cafe.name}</h3>
            <div className="flex items-center gap-2 text-ink/40 text-xs font-medium">
              <MapPin size={14} className="text-gold" />
              {cafe.location}
            </div>
          </div>
          
          <p className="text-ink/60 text-sm line-clamp-2 leading-relaxed">
            {cafe.description}
          </p>
          
          <div className="pt-4 flex items-center justify-between border-t border-black/5">
            <span className="text-[10px] font-bold text-ink/30 uppercase tracking-widest">Available Now</span>
            <button className="flex items-center gap-2 text-gold font-bold text-xs uppercase tracking-wider group/btn">
              View Menu
              <ChevronRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
