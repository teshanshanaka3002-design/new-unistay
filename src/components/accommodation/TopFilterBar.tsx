import React from 'react';
import { 
  GraduationCap, Home, Calendar, ChevronDown, 
  ArrowUpDown, X, MapPin
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { FilterState } from '../../types/filters';
import { Badge } from '../UI';

interface TopFilterBarProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  resultsCount: number;
}

export const TopFilterBar: React.FC<TopFilterBarProps> = ({ filters, setFilters, resultsCount }) => {
  const universities = ['University of Moratuwa', 'SLIIT', 'NSBM', 'Horizon Campus', 'CINEC'];
  const roomTypes = ['Single Room', 'Double Room', 'Shared Room'];
  const sortOptions = ['Price: Low to High', 'Price: High to Low', 'Rating', 'Distance', 'Most Popular', 'Recently Added'];

  const removeFilter = (key: keyof FilterState, value?: any) => {
    if (Array.isArray(filters[key])) {
      const current = filters[key] as any[];
      setFilters({ ...filters, [key]: current.filter(v => v !== value) });
    } else if (typeof filters[key] === 'boolean') {
      setFilters({ ...filters, [key]: false });
    } else if (typeof filters[key] === 'number') {
      setFilters({ ...filters, [key]: key === 'distance' ? 10 : 0 });
    } else {
      setFilters({ ...filters, [key]: '' });
    }
  };

  const getActiveFilters = () => {
    const active: { key: keyof FilterState; label: string; value?: any }[] = [];
    
    if (filters.city) active.push({ key: 'city', label: `City: ${filters.city}` });
    if (filters.university) active.push({ key: 'university', label: filters.university });
    if (filters.distance < 10) active.push({ key: 'distance', label: `< ${filters.distance}km` });
    if (filters.minPrice > 0 || filters.maxPrice < 100000) active.push({ key: 'maxPrice', label: `Rs. ${filters.minPrice} - ${filters.maxPrice}` });
    if (filters.budgetFriendlyOnly) active.push({ key: 'budgetFriendlyOnly', label: 'Budget Friendly' });
    
    filters.roomTypes?.forEach(t => active.push({ key: 'roomTypes', label: t, value: t }));
    filters.propertyTypes?.forEach(t => active.push({ key: 'propertyTypes', label: t, value: t }));
    filters.facilities?.forEach(f => active.push({ key: 'facilities', label: f, value: f }));
    
    if (filters.genderPreference !== 'Any') active.push({ key: 'genderPreference', label: `Gender: ${filters.genderPreference}` });
    if (filters.quietEnvironment) active.push({ key: 'quietEnvironment', label: 'Quiet' });
    if (filters.moveInDate) active.push({ key: 'moveInDate', label: `From: ${filters.moveInDate}` });
    if (filters.minRating > 0) active.push({ key: 'minRating', label: `${filters.minRating}+ Stars` });

    return active;
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Quick Filters & Sorting */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* University Selector */}
          <div className="relative group">
            <select 
              value={filters.university}
              onChange={e => setFilters({ ...filters, university: e.target.value })}
              className="appearance-none pl-10 pr-10 py-3 bg-white border border-black/5 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-ink/60 hover:text-ink hover:border-black/20 transition-all cursor-pointer outline-none shadow-sm"
            >
              <option value="">All Universities</option>
              {universities.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
            <GraduationCap size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" />
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/20 group-hover:text-ink/40 transition-colors" />
          </div>

          {/* Room Type Selector */}
          <div className="relative group">
            <select 
              value={filters.roomTypes?.[0] || ''}
              onChange={e => {
                const val = e.target.value;
                setFilters({ ...filters, roomTypes: val ? [val] : [] });
              }}
              className="appearance-none pl-10 pr-10 py-3 bg-white border border-black/5 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-ink/60 hover:text-ink hover:border-black/20 transition-all cursor-pointer outline-none shadow-sm"
            >
              <option value="">Any Room Type</option>
              {roomTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <Home size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" />
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/20 group-hover:text-ink/40 transition-colors" />
          </div>

          {/* Move-in Date Quick Pick */}
          <div className="relative group">
            <input 
              type="date"
              value={filters.moveInDate}
              onChange={e => setFilters({ ...filters, moveInDate: e.target.value })}
              className="appearance-none pl-10 pr-4 py-3 bg-white border border-black/5 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-ink/60 hover:text-ink hover:border-black/20 transition-all cursor-pointer outline-none shadow-sm min-w-[180px]"
            />
            <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" />
          </div>
        </div>

        {/* Sorting */}
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold text-ink/20 uppercase tracking-widest hidden sm:inline">Sort By</span>
          <div className="relative group">
            <select 
              value={filters.sortBy}
              onChange={e => setFilters({ ...filters, sortBy: e.target.value })}
              className="appearance-none pl-10 pr-10 py-3 bg-ink text-gold rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-ink/90 transition-all cursor-pointer outline-none shadow-xl shadow-ink/10"
            >
              {sortOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <ArrowUpDown size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/60" />
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/40 group-hover:text-gold/60 transition-colors" />
          </div>
        </div>
      </div>

      {/* Results Count & Active Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-black/5">
        <div className="flex items-center gap-3">
          <span className="font-serif text-2xl text-ink">{resultsCount}</span>
          <span className="text-[10px] font-bold text-ink/40 uppercase tracking-widest mt-1">Accommodations Found</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {getActiveFilters().map((f, i) => (
            <Badge 
              key={`${f.key}-${i}`}
              className="bg-paper text-ink/60 border-black/5 pl-3 pr-2 py-1.5 rounded-xl flex items-center gap-2 group hover:border-gold/30 transition-all"
            >
              <span className="text-[9px] font-bold uppercase tracking-wider">{f.label}</span>
              <button 
                onClick={() => removeFilter(f.key, f.value)}
                className="p-0.5 rounded-md hover:bg-gold hover:text-white transition-all"
              >
                <X size={10} />
              </button>
            </Badge>
          ))}
          {getActiveFilters().length > 0 && (
            <button 
              onClick={() => setFilters({ ...filters, ...INITIAL_FILTERS })}
              className="text-[9px] font-bold text-gold uppercase tracking-widest hover:underline px-2"
            >
              Clear All
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const INITIAL_FILTERS: any = {
  city: '',
  distance: 10,
  university: '',
  minPrice: 0,
  maxPrice: 100000,
  priceType: 'monthly',
  budgetFriendlyOnly: false,
  roomTypes: [],
  propertyTypes: [],
  facilities: [],
  genderPreference: 'Any',
  studentType: 'Any',
  quietEnvironment: false,
  moveInDate: '',
  availableNow: false,
  leaseDuration: 'Any',
  minRating: 0,
  topRatedOnly: false,
  smokingAllowed: null,
  visitorsAllowed: null,
  curfew: null,
  sortBy: 'Recently Added'
};
