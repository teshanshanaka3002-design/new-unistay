import React from 'react';
import { 
  Star, MapPin, Home, Heart, Layers, Wifi, Wind, Bath, 
  Car, Utensils, WashingMachine, BookOpen, ChefHat, 
  ShieldCheck, Zap, ChevronRight 
} from 'lucide-react';
import { Card, Button, Badge } from '../UI';
import { Accommodation } from '../../types/accommodation';
import { cn } from '../../lib/utils';

interface AccommodationCardProps {
  accommodation: Accommodation;
  onClick: (id: string) => void;
}

const FACILITY_ICONS: Record<string, React.ReactNode> = {
  'WiFi': <Wifi size={14} />,
  'Air Conditioning': <Wind size={14} />,
  'Attached Bathroom': <Bath size={14} />,
  'Parking': <Car size={14} />,
  'Meals Included': <Utensils size={14} />,
  'Laundry': <WashingMachine size={14} />,
  'Study Desk': <BookOpen size={14} />,
  'Kitchen Access': <ChefHat size={14} />,
  'CCTV Security': <ShieldCheck size={14} />,
  '24/7 Water & Electricity': <Zap size={14} />,
};

export const AccommodationCard: React.FC<AccommodationCardProps> = ({ accommodation, onClick }) => {
  const [isWishlisted, setIsWishlisted] = React.useState(false);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  const displayFacilities = accommodation.facilities?.slice(0, 5) || [];

  return (
    <Card 
      className="p-0 group cursor-pointer hover:shadow-2xl transition-all duration-500 border-black/5 overflow-hidden bg-white rounded-[2.5rem]"
      onClick={() => onClick(accommodation.id)}
    >
      {/* Image Section */}
      <div className="relative aspect-[1.4/1] overflow-hidden">
        <img 
          src={accommodation.image} 
          alt={accommodation.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          referrerPolicy="no-referrer"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {accommodation.price < 20000 && (
            <div className="bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg backdrop-blur-md">
              <Layers size={12} className="rotate-180" />
              Budget Friendly
            </div>
          )}
          <div className="bg-rose-500 text-white px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-widest shadow-lg backdrop-blur-md">
            Verified Stay
          </div>
        </div>

        {/* Action Icons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            className={cn(
              "p-2.5 backdrop-blur-md rounded-xl transition-all shadow-xl",
              isWishlisted ? "bg-rose-500 text-white" : "bg-black/20 text-white hover:bg-white hover:text-ink"
            )}
            onClick={(e) => { 
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
          >
            <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-2xl text-ink group-hover:text-gold transition-colors line-clamp-1">
                {accommodation.name}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-ink/40">
              <MapPin size={12} className="text-gold" />
              <span>{accommodation.location || accommodation.city}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-paper rounded-xl text-sm font-bold text-ink">
            <Star size={14} className="text-gold fill-gold" />
            {accommodation.rating}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge className="bg-paper text-ink/60 border-none text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg">
            {accommodation.roomType}
          </Badge>
          <Badge className="bg-paper text-ink/60 border-none text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg">
            {accommodation.propertyType}
          </Badge>
        </div>

        {/* Facilities */}
        <div className="flex items-center gap-4 pt-2">
          <div className="flex items-center gap-3">
            {displayFacilities.map((facility, i) => (
              <div 
                key={i} 
                className="w-8 h-8 rounded-lg bg-paper flex items-center justify-center text-ink/40 hover:text-gold transition-colors cursor-help" 
                title={facility}
              >
                {FACILITY_ICONS[facility] || <Zap size={14} />}
              </div>
            ))}
          </div>
          {accommodation.facilities.length > 5 && (
            <span className="text-[9px] font-bold text-ink/20 uppercase tracking-widest">
              +{accommodation.facilities.length - 5} more
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-black/5">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-ink/20 uppercase tracking-widest">Monthly Rent</span>
            <div className="flex items-baseline gap-1">
              <span className="text-ink font-serif text-3xl">LKR {accommodation.price.toLocaleString()}</span>
            </div>
          </div>
          <Button 
            className="bg-ink text-gold px-8 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-ink/90 transition-all shadow-xl shadow-ink/10"
          >
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
};
