import React from 'react';
import { Star, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Canteen } from '../../types/canteen';

interface CanteenCardProps {
  canteen: Canteen;
  onClick: (id: string) => void;
}

export const CanteenCard: React.FC<CanteenCardProps> = ({ canteen, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group cursor-pointer space-y-6"
      onClick={() => onClick(canteen.id)}
    >
      <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-500">
        <img 
          src={canteen.image} 
          alt={canteen.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">
          <Star size={14} className="text-gold fill-gold" />
          {canteen.rating}
        </div>
      </div>
      
      <div className="px-4 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-3xl font-serif text-ink group-hover:text-gold transition-colors">{canteen.name}</h3>
            <div className="flex items-center gap-2 text-xs font-bold text-ink/30">
              <MapPin size={14} />
              {canteen.location}
            </div>
          </div>
        </div>
        
        <p className="text-sm text-ink/50 leading-relaxed line-clamp-2">
          {canteen.description}
        </p>

        <div className="pt-2 flex items-center text-ink font-bold text-[10px] uppercase tracking-[0.2em] gap-3 group-hover:text-gold transition-colors">
          Explore Menu 
          <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
};
