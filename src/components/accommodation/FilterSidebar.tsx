import React, { useState } from 'react';
import { Card, Input, Button } from '../UI';
import { 
  Search, MapPin, GraduationCap, Filter, X, ChevronDown, 
  Wifi, Wind, Bath, Car, Utensils, WashingMachine, 
  BookOpen, ChefHat, ShieldCheck, Zap, 
  Users, Home, Calendar, Star, Cigarette, 
  UserPlus, Clock, DollarSign, Map
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { FilterState } from '../../types/filters';
import { getMinDate, isPastDate } from '../../lib/validation';

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  onClear: () => void;
  onApply: () => void;
}

const FilterSection: React.FC<{ 
  title: string; 
  icon: React.ReactNode; 
  children: React.ReactNode; 
  defaultOpen?: boolean 
}> = ({ title, icon, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-black/5 pb-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full group py-2"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-paper flex items-center justify-center text-ink/40 group-hover:text-gold transition-colors">
            {icon}
          </div>
          <span className="text-[10px] font-bold text-ink/40 uppercase tracking-widest group-hover:text-ink transition-colors">
            {title}
          </span>
        </div>
        <ChevronDown 
          size={16} 
          className={cn("text-ink/20 transition-transform duration-300", isOpen && "rotate-180")} 
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, setFilters, onClear, onApply }) => {
  const roomTypeOptions = ['Single Room', 'Double Room', 'Shared Room'];
  const propertyTypeOptions = ['Boarding House', 'Annex', 'Hostel'];
  const facilityOptions = [
    { id: 'WiFi', icon: <Wifi size={16} /> },
    { id: 'Air Conditioning', icon: <Wind size={16} /> },
    { id: 'Attached Bathroom', icon: <Bath size={16} /> },
    { id: 'Parking', icon: <Car size={16} /> },
    { id: 'Meals Included', icon: <Utensils size={16} /> },
    { id: 'Laundry', icon: <WashingMachine size={16} /> },
    { id: 'Study Desk', icon: <BookOpen size={16} /> },
    { id: 'Kitchen Access', icon: <ChefHat size={16} /> },
    { id: 'CCTV Security', icon: <ShieldCheck size={16} /> },
    { id: '24/7 Water & Electricity', icon: <Zap size={16} /> },
  ];

  const toggleArrayItem = (key: keyof FilterState, item: string) => {
    const currentItems = filters[key] as string[];
    const newItems = currentItems.includes(item)
      ? currentItems.filter(i => i !== item)
      : [...currentItems, item];
    setFilters({ ...filters, [key]: newItems });
  };

  return (
    <Card className="p-8 space-y-8 h-fit sticky top-24 border-black/5 shadow-sm rounded-[2.5rem] bg-white max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between sticky top-0 bg-white z-10 pb-4 border-b border-black/5">
        <div className="flex items-center gap-2 text-ink font-serif text-xl">
          <Filter size={20} className="text-gold" />
          <span>Filters</span>
        </div>
        <button 
          onClick={onClear}
          className="text-[10px] text-ink/40 hover:text-gold font-bold uppercase tracking-widest transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="space-y-2">
        {/* Location & Distance */}
        <FilterSection title="Location & Distance" icon={<Map size={18} />}>
          <div className="space-y-4">
            <div className="relative">
              <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/20" />
              <Input 
                placeholder="City / Area" 
                value={filters.city}
                onChange={e => setFilters({ ...filters, city: e.target.value })}
                className="pl-12 h-12 rounded-2xl bg-paper/50 border-none text-sm"
              />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-ink/40">
                <span>Distance</span>
                <span className="text-gold">{filters.distance} km</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="10" 
                step="0.5"
                value={filters.distance}
                onChange={e => setFilters({ ...filters, distance: Number(e.target.value) })}
                className="w-full h-1 bg-paper rounded-full appearance-none cursor-pointer accent-gold"
              />
            </div>
          </div>
        </FilterSection>

        {/* Price & Budget */}
        <FilterSection title="Price & Budget" icon={<DollarSign size={18} />}>
          <div className="space-y-4">
            <div className="flex p-1 bg-paper rounded-xl border border-black/5">
              <button 
                onClick={() => setFilters({ ...filters, priceType: 'monthly' })}
                className={cn(
                  "flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all",
                  filters.priceType === 'monthly' ? "bg-white text-ink shadow-sm" : "text-ink/30 hover:text-ink/60"
                )}
              >
                Monthly
              </button>
              <button 
                onClick={() => setFilters({ ...filters, priceType: 'daily' })}
                className={cn(
                  "flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all",
                  filters.priceType === 'daily' ? "bg-white text-ink shadow-sm" : "text-ink/30 hover:text-ink/60"
                )}
              >
                Daily
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input 
                type="number" 
                placeholder="Min" 
                value={filters.minPrice || ''}
                onChange={e => setFilters({ ...filters, minPrice: Number(e.target.value) })}
                className="h-12 rounded-2xl bg-paper/50 border-none text-sm"
              />
              <Input 
                type="number" 
                placeholder="Max" 
                value={filters.maxPrice || ''}
                onChange={e => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                className="h-12 rounded-2xl bg-paper/50 border-none text-sm"
              />
            </div>
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-sm text-ink/60 group-hover:text-ink transition-colors font-medium">Budget-friendly only</span>
              <div className="relative">
                <input 
                  type="checkbox" 
                  checked={filters.budgetFriendlyOnly}
                  onChange={() => setFilters({ ...filters, budgetFriendlyOnly: !filters.budgetFriendlyOnly })}
                  className="peer appearance-none w-10 h-5 rounded-full bg-paper checked:bg-gold transition-all cursor-pointer"
                />
                <div className="absolute left-1 top-1 w-3 h-3 rounded-full bg-white transition-all peer-checked:translate-x-5" />
              </div>
            </label>
          </div>
        </FilterSection>

        {/* Room & Property Type */}
        <FilterSection title="Room & Property" icon={<Home size={18} />}>
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-[9px] font-bold text-ink/30 uppercase tracking-widest">Room Type</p>
              {roomTypeOptions.map(type => (
                <label key={type} className="flex items-center gap-3 group cursor-pointer">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      checked={filters.roomTypes.includes(type)}
                      onChange={() => toggleArrayItem('roomTypes', type)}
                      className="peer appearance-none w-5 h-5 rounded-lg border border-black/10 checked:bg-ink checked:border-ink transition-all cursor-pointer"
                    />
                    <Check size={12} className="absolute left-1 top-1 text-gold opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                  <span className="text-sm text-ink/60 group-hover:text-ink transition-colors font-medium">{type}</span>
                </label>
              ))}
            </div>
            <div className="space-y-3">
              <p className="text-[9px] font-bold text-ink/30 uppercase tracking-widest">Property Type</p>
              {propertyTypeOptions.map(type => (
                <label key={type} className="flex items-center gap-3 group cursor-pointer">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      checked={filters.propertyTypes.includes(type)}
                      onChange={() => toggleArrayItem('propertyTypes', type)}
                      className="peer appearance-none w-5 h-5 rounded-lg border border-black/10 checked:bg-ink checked:border-ink transition-all cursor-pointer"
                    />
                    <Check size={12} className="absolute left-1 top-1 text-gold opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                  <span className="text-sm text-ink/60 group-hover:text-ink transition-colors font-medium">{type}</span>
                </label>
              ))}
            </div>
          </div>
        </FilterSection>

        {/* Facilities & Amenities */}
        <FilterSection title="Facilities" icon={<Zap size={18} />}>
          <div className="grid grid-cols-1 gap-3">
            {facilityOptions.map(facility => (
              <label key={facility.id} className="flex items-center gap-3 group cursor-pointer">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    checked={filters.facilities.includes(facility.id)}
                    onChange={() => toggleArrayItem('facilities', facility.id)}
                    className="peer appearance-none w-5 h-5 rounded-lg border border-black/10 checked:bg-ink checked:border-ink transition-all cursor-pointer"
                  />
                  <Check size={12} className="absolute left-1 top-1 text-gold opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                </div>
                <div className="flex items-center gap-2 text-ink/60 group-hover:text-ink transition-colors">
                  <span className="text-gold/60">{facility.icon}</span>
                  <span className="text-sm font-medium">{facility.id}</span>
                </div>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Student Preferences */}
        <FilterSection title="Preferences" icon={<Users size={18} />}>
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-[9px] font-bold text-ink/30 uppercase tracking-widest">Gender</p>
              <div className="flex flex-wrap gap-2">
                {['Male', 'Female', 'Mixed', 'Any'].map(gender => (
                  <button 
                    key={gender}
                    onClick={() => setFilters({ ...filters, genderPreference: gender as any })}
                    className={cn(
                      "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all",
                      filters.genderPreference === gender 
                        ? "bg-ink text-gold border-ink" 
                        : "bg-paper text-ink/40 border-black/5 hover:border-black/20"
                    )}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-sm text-ink/60 group-hover:text-ink transition-colors font-medium">Quiet Environment</span>
              <div className="relative">
                <input 
                  type="checkbox" 
                  checked={filters.quietEnvironment}
                  onChange={() => setFilters({ ...filters, quietEnvironment: !filters.quietEnvironment })}
                  className="peer appearance-none w-10 h-5 rounded-full bg-paper checked:bg-gold transition-all cursor-pointer"
                />
                <div className="absolute left-1 top-1 w-3 h-3 rounded-full bg-white transition-all peer-checked:translate-x-5" />
              </div>
            </label>
          </div>
        </FilterSection>

        {/* Availability */}
        <FilterSection title="Availability" icon={<Calendar size={18} />}>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-[9px] font-bold text-ink/30 uppercase tracking-widest ml-4">Move-in Date</p>
              <Input 
                type="date" 
                value={filters.moveInDate}
                min={getMinDate()}
                onChange={e => {
                  const nextDate = e.target.value;
                  if (nextDate && isPastDate(nextDate)) return;
                  setFilters({ ...filters, moveInDate: nextDate });
                }}
                className="h-12 rounded-2xl bg-paper/50 border-none text-sm"
              />
            </div>
            <div className="space-y-3">
              <p className="text-[9px] font-bold text-ink/30 uppercase tracking-widest">Lease Duration</p>
              <div className="flex flex-wrap gap-2">
                {['Short-term', 'Long-term', 'Any'].map(duration => (
                  <button 
                    key={duration}
                    onClick={() => setFilters({ ...filters, leaseDuration: duration as any })}
                    className={cn(
                      "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all",
                      filters.leaseDuration === duration 
                        ? "bg-ink text-gold border-ink" 
                        : "bg-paper text-ink/40 border-black/5 hover:border-black/20"
                    )}
                  >
                    {duration}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </FilterSection>

        {/* Ratings */}
        <FilterSection title="Ratings" icon={<Star size={18} />}>
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-ink/40">
                <span>Min Rating</span>
                <span className="text-gold">{filters.minRating} Stars</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="5" 
                step="0.5"
                value={filters.minRating}
                onChange={e => setFilters({ ...filters, minRating: Number(e.target.value) })}
                className="w-full h-1 bg-paper rounded-full appearance-none cursor-pointer accent-gold"
              />
            </div>
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-sm text-ink/60 group-hover:text-ink transition-colors font-medium">Top Rated Only</span>
              <div className="relative">
                <input 
                  type="checkbox" 
                  checked={filters.topRatedOnly}
                  onChange={() => setFilters({ ...filters, topRatedOnly: !filters.topRatedOnly })}
                  className="peer appearance-none w-10 h-5 rounded-full bg-paper checked:bg-gold transition-all cursor-pointer"
                />
                <div className="absolute left-1 top-1 w-3 h-3 rounded-full bg-white transition-all peer-checked:translate-x-5" />
              </div>
            </label>
          </div>
        </FilterSection>

        {/* Safety & Rules */}
        <FilterSection title="Safety & Rules" icon={<ShieldCheck size={18} />}>
          <div className="space-y-4">
            {[
              { label: 'Smoking Allowed', key: 'smokingAllowed' },
              { label: 'Visitors Allowed', key: 'visitorsAllowed' },
              { label: 'Curfew', key: 'curfew' }
            ].map(rule => (
              <div key={rule.key} className="space-y-3">
                <p className="text-[9px] font-bold text-ink/30 uppercase tracking-widest">{rule.label}</p>
                <div className="flex gap-2">
                  {[
                    { label: 'Yes', value: true },
                    { label: 'No', value: false },
                    { label: 'Any', value: null }
                  ].map(opt => (
                    <button 
                      key={opt.label}
                      onClick={() => setFilters({ ...filters, [rule.key]: opt.value })}
                      className={cn(
                        "flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all",
                        filters[rule.key as keyof FilterState] === opt.value 
                          ? "bg-ink text-gold border-ink" 
                          : "bg-paper text-ink/40 border-black/5 hover:border-black/20"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </FilterSection>
      </div>

      <div className="sticky bottom-0 bg-white pt-4 border-t border-black/5">
        <Button 
          className="w-full rounded-full h-14 bg-ink text-gold hover:bg-ink/90 shadow-xl shadow-ink/10 transition-all hover:scale-[1.02]" 
          onClick={onApply}
        >
          Apply Filters
        </Button>
      </div>
    </Card>
  );
};

const Check = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
