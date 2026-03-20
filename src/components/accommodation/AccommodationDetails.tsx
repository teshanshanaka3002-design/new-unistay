import React, { useState } from 'react';
import { 
  Star, MapPin, Home, ShieldCheck, Check, 
  Phone, MessageSquare, ArrowLeft, Calendar, 
  Wifi, Wind, Bath, Car, Utensils, Info
} from 'lucide-react';
import { Card, Button, Badge } from '../UI';
import { Accommodation } from '../../types/accommodation';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface AccommodationDetailsProps {
  accommodation: Accommodation;
  onBack: () => void;
  onBook: () => void;
}

export const AccommodationDetails: React.FC<AccommodationDetailsProps> = ({ accommodation, onBack, onBook }) => {
  const [activeImage, setActiveImage] = useState(0);

  const getFacilityIcon = (facility: string) => {
    switch (facility.toLowerCase()) {
      case 'wifi': return <Wifi size={18} />;
      case 'ac': return <Wind size={18} />;
      case 'attached bathroom': return <Bath size={18} />;
      case 'parking': return <Car size={18} />;
      case 'meals': return <Utensils size={18} />;
      default: return <Check size={18} />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-20"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium transition-colors group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to Listings
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Gallery & Info */}
        <div className="lg:col-span-8 space-y-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={accommodation.images[activeImage]} 
                alt={accommodation.name}
                className="w-full h-full object-cover transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-sm font-bold text-slate-900 flex items-center gap-2 shadow-xl">
                <Star size={16} className="text-amber-500 fill-amber-500" />
                {accommodation.rating} ({accommodation.reviews.length} reviews)
              </div>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {accommodation.images.map((img, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 transition-all duration-300 border-2",
                    activeImage === i ? "border-blue-600 scale-105 shadow-lg" : "border-transparent opacity-70 hover:opacity-100"
                  )}
                >
                  <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* Header Info */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-blue-100 text-blue-700 border-none font-bold uppercase tracking-wider px-3 py-1">
                {accommodation.university}
              </Badge>
              <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold uppercase tracking-wider px-3 py-1 flex items-center gap-1">
                <ShieldCheck size={14} /> Verified Boarding
              </Badge>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                {accommodation.name}
              </h1>
              <div className="flex items-center gap-2 text-slate-500 text-lg">
                <MapPin size={20} className="text-blue-600" />
                <span>{accommodation.location}, {accommodation.city}</span>
              </div>
            </div>

            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 text-lg leading-relaxed">
                {accommodation.description}
              </p>
            </div>
          </div>

          {/* Facilities */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Info size={24} className="text-blue-600" />
              What this place offers
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {accommodation.facilities.map((facility, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    {getFacilityIcon(facility)}
                  </div>
                  <span className="font-medium text-slate-700">{facility}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Where you'll be</h2>
            <div className="aspect-video rounded-3xl bg-slate-100 overflow-hidden relative group">
              <img 
                src="https://picsum.photos/seed/map/1200/600" 
                className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 transition-all duration-700" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-200">
                  <MapPin size={24} className="text-red-500" />
                  <span className="font-bold text-slate-900">{accommodation.city} Campus Area</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Reviews</h2>
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Star size={20} className="text-amber-500 fill-amber-500" />
                {accommodation.rating} • {accommodation.reviews.length} reviews
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {accommodation.reviews.map((review) => (
                <Card key={review.id} className="p-6 space-y-4 border-slate-100 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                        {review.userName[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{review.userName}</p>
                        <p className="text-xs text-slate-400">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star size={14} fill="currentColor" />
                      <span className="text-sm font-bold">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm italic leading-relaxed">
                    "{review.comment}"
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Booking Card */}
        <div className="lg:col-span-4">
          <Card className="p-8 space-y-8 sticky top-24 border-slate-100 shadow-2xl shadow-blue-600/5 rounded-3xl">
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Monthly Rent</span>
                <p className="text-3xl font-bold text-blue-600">
                  Rs. {accommodation.price.toLocaleString()}
                </p>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold">Available</Badge>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-bold text-slate-900 uppercase tracking-wider">Room Types</p>
                <div className="flex flex-wrap gap-2">
                  {accommodation.roomTypes.map((type, i) => (
                    <Badge key={i} variant="outline" className="border-slate-200 text-slate-600 font-medium px-3 py-1">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Minimum Stay</p>
                    <p className="font-bold text-slate-900">6 Months</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Security Deposit</p>
                    <p className="font-bold text-slate-900">1 Month Rent</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <Button className="w-full h-14 text-lg rounded-2xl shadow-xl shadow-blue-600/20" onClick={onBook}>
                Book Now
              </Button>
              <Button variant="outline" className="w-full h-14 text-lg rounded-2xl border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-2">
                <MessageSquare size={20} />
                Contact Owner
              </Button>
            </div>

            <div className="pt-6 text-center">
              <p className="text-xs text-slate-400">
                Managed by <span className="font-bold text-slate-900">{accommodation.ownerName}</span>
              </p>
              <p className="text-[10px] text-slate-300 mt-1 uppercase tracking-widest">Response time: &lt; 2 hours</p>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};
