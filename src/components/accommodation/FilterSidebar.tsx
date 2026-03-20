import React from 'react';
import { Card, Input, Button } from '../UI';
import { Search, MapPin, GraduationCap, Filter, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FilterSidebarProps {
  filters: {
    roomTypes: string[];
    minPrice: number;
    maxPrice: number;
    facilities: string[];
  };
  setFilters: (filters: any) => void;
  onClear: () => void;
  onApply: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, setFilters, onClear, onApply }) => {
  const roomTypeOptions = ['Single', 'Double', 'Shared'];
  const facilityOptions = ['WiFi', 'AC', 'Attached Bathroom', 'Parking', 'Meals'];

  const toggleRoomType = (type: string) => {
    const newTypes = filters.roomTypes.includes(type)
      ? filters.roomTypes.filter(t => t !== type)
      : [...filters.roomTypes, type];
    setFilters({ ...filters, roomTypes: newTypes });
  };

  const toggleFacility = (facility: string) => {
    const newFacilities = filters.facilities.includes(facility)
      ? filters.facilities.filter(f => f !== facility)
      : [...filters.facilities, facility];
    setFilters({ ...filters, facilities: newFacilities });
  };

  return (
    <Card className="p-6 space-y-8 h-fit sticky top-24 border-slate-100 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-900 font-bold">
          <Filter size={18} />
          <span>Filters</span>
        </div>
        <button 
          onClick={onClear}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Room Type */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Room Type</h3>
        <div className="space-y-2">
          {roomTypeOptions.map(type => (
            <label key={type} className="flex items-center gap-3 group cursor-pointer">
              <input 
                type="checkbox" 
                checked={filters.roomTypes.includes(type)}
                onChange={() => toggleRoomType(type)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Budget Range */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Budget Range (Rs.)</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Min</span>
            <Input 
              type="number" 
              placeholder="0" 
              value={filters.minPrice || ''}
              onChange={e => setFilters({ ...filters, minPrice: Number(e.target.value) })}
              className="h-9 text-sm"
            />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Max</span>
            <Input 
              type="number" 
              placeholder="50000" 
              value={filters.maxPrice || ''}
              onChange={e => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
              className="h-9 text-sm"
            />
          </div>
        </div>
        <input 
          type="range" 
          min="0" 
          max="100000" 
          step="1000"
          value={filters.maxPrice || 50000}
          onChange={e => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
          className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>

      {/* Facilities */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Facilities</h3>
        <div className="space-y-2">
          {facilityOptions.map(facility => (
            <label key={facility} className="flex items-center gap-3 group cursor-pointer">
              <input 
                type="checkbox" 
                checked={filters.facilities.includes(facility)}
                onChange={() => toggleFacility(facility)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{facility}</span>
            </label>
          ))}
        </div>
      </div>

      <Button className="w-full rounded-xl h-11" onClick={onApply}>
        Apply Filters
      </Button>
    </Card>
  );
};
