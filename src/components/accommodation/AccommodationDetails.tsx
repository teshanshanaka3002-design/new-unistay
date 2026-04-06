import React, { useState, useEffect } from 'react';
import { 
  Star, MapPin, Home, ShieldCheck, Check, 
  Phone, MessageSquare, ArrowLeft, Calendar, 
  Wifi, Wind, Bath, Car, Utensils, Info,
  Share2, Heart, ChevronRight, ChevronLeft,
  Plus, RefreshCw
} from 'lucide-react';
import { Card, Button, Badge } from '../UI';
import { Accommodation } from '../../types/accommodation';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { RatingSummary } from '../reviews/RatingSummary';
import { ReviewList } from '../reviews/ReviewList';
import { ReviewModal } from '../reviews/ReviewModal';
import { reviewService } from '../../services/api';

interface AccommodationDetailsProps {
  accommodation: Accommodation;
  onBack: () => void;
  onBook: () => void;
  onContact: () => void;
}

export const AccommodationDetails: React.FC<AccommodationDetailsProps> = ({ accommodation, onBack, onBook, onContact }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [accommodation._id]);

  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      const res = await reviewService.getReviewsByTarget('STAY', accommodation._id);
      setReviews(res.data);
    } catch (err) {
      console.error('Failed to fetch reviews', err);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleReviewSubmit = async (data: any) => {
    try {
      await reviewService.submitReview({
        type: 'STAY',
        targetId: accommodation._id,
        rating: data.rating,
        comment: data.comment
      });
      fetchReviews();
    } catch (err) {
      console.error('Failed to submit review', err);
    }
  };

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

  // Calculate breakdown for RatingSummary
  const breakdown = reviews.reduce((acc, review) => {
    const rating = Math.round(review.rating);
    acc[rating] = (acc[rating] || 0) + 1;
    return acc;
  }, {} as { [key: number]: number });

  const avgRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : 0;

  const mappedReviews = reviews.map(r => ({
    id: r._id,
    userName: r.userName,
    rating: r.rating,
    comment: r.comment,
    date: new Date(r.createdAt).toLocaleDateString(),
    isVerified: true,
    adminReply: r.adminReply,
    adminName: r.adminName
  }));

  const displayImages = (accommodation.images && accommodation.images.length > 0) 
    ? accommodation.images 
    : [accommodation.image].filter(Boolean);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 pb-24"
    >
      {/* Review Modal */}
      <ReviewModal 
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
        title={`Rate your stay at ${accommodation.name}`}
      />

      {/* Navigation & Actions */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-ink/40 hover:text-gold font-bold text-[10px] uppercase tracking-widest transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Listings
        </button>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-paper transition-colors text-ink/60">
            <Share2 size={20} />
          </button>
          <button className="p-2 rounded-full hover:bg-paper transition-colors text-ink/60">
            <Heart size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left Column: Gallery & Info */}
        <div className="lg:col-span-8 space-y-16">
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-[16/9] rounded-[2.5rem] overflow-hidden shadow-2xl group">
              <img 
                src={displayImages[activeImage] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80'} 
                alt={accommodation.name}
                className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full text-xs font-bold text-ink flex items-center gap-2 shadow-xl border border-white/20">
                <Star size={14} className="text-gold fill-gold" />
                {avgRating > 0 ? avgRating.toFixed(1) : 'No ratings'} <span className="text-ink/40 font-medium">({reviews.length} reviews)</span>
              </div>
              
              {/* Gallery Navigation */}
              {displayImages.length > 1 && (
                <div className="absolute inset-y-0 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => setActiveImage(prev => (prev > 0 ? prev - 1 : displayImages.length - 1))}
                    className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-ink shadow-lg hover:bg-white transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={() => setActiveImage(prev => (prev < displayImages.length - 1 ? prev + 1 : 0))}
                    className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-ink shadow-lg hover:bg-white transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
            
            {displayImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2">
                {displayImages.map((img, i) => (
                  <button 
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      "relative w-28 h-20 rounded-2xl overflow-hidden flex-shrink-0 transition-all duration-300 border-2",
                      activeImage === i ? "border-gold scale-105 shadow-lg" : "border-transparent opacity-50 hover:opacity-100"
                    )}
                  >
                    <img src={img as string} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Header Info */}
          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-4">
              <span className="px-4 py-1.5 rounded-full bg-paper text-ink/60 text-[10px] font-bold uppercase tracking-widest border border-black/5">
                {accommodation.university}
              </span>
              <span className="px-4 py-1.5 rounded-full bg-gold/10 text-gold text-[10px] font-bold uppercase tracking-widest border border-gold/20 flex items-center gap-1.5">
                <ShieldCheck size={14} /> Verified Boarding
              </span>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-serif text-ink leading-[1.1]">
                {accommodation.name}
              </h1>
              <div className="flex items-center gap-2 text-ink/60 text-lg font-medium">
                <MapPin size={20} className="text-gold" />
                <span>{accommodation.location}, {accommodation.city}</span>
              </div>
            </div>

            <div className="max-w-3xl">
              <p className="text-ink/70 text-xl leading-relaxed font-light">
                {accommodation.description}
              </p>
            </div>
          </div>

          {/* Facilities & Utilities */}
          <div className="space-y-12 pt-8 border-t border-black/5">
            <div className="space-y-6">
              <h2 className="text-3xl font-serif text-ink flex items-center gap-3">
                <Info size={28} className="text-gold" />
                Amenities & Features
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {accommodation.facilities?.map((facility, i) => (
                  <div key={i} className="flex items-center gap-5 p-6 rounded-[2rem] bg-paper/30 border border-black/5 hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all group">
                    <div className="w-12 h-12 rounded-full bg-white text-gold flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      {getFacilityIcon(facility)}
                    </div>
                    <span className="font-bold text-ink/80 text-sm uppercase tracking-wider">{facility}</span>
                  </div>
                ))}
              </div>
            </div>

            {accommodation.utilitiesIncluded && accommodation.utilitiesIncluded.length > 0 && (
              <div className="space-y-6 pt-6 border-t border-black/5">
                <h3 className="text-sm font-bold text-ink/40 uppercase tracking-[0.2em] ml-2">Utilities Included in Rent</h3>
                <div className="flex flex-wrap gap-3">
                  {accommodation.utilitiesIncluded.map((utility, i) => (
                    <span key={i} className="px-6 py-2.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-bold uppercase tracking-widest">
                      {utility}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Location & Map */}
          <div className="space-y-8 pt-8 border-t border-black/5">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-serif text-ink">Location</h2>
              <div className="flex items-center gap-2 text-gold">
                <MapPin size={18} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{accommodation.location}, {accommodation.city}</span>
              </div>
            </div>
            <div className="aspect-video rounded-[2.5rem] bg-paper overflow-hidden relative group shadow-2xl shadow-black/5 border border-black/5">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src={accommodation.mapEmbedUrl || `https://maps.google.com/maps?q=${encodeURIComponent(`${accommodation.location}, ${accommodation.city}, Sri Lanka`)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
                title={`Map of ${accommodation.name}`}
              />
              <div className="absolute bottom-8 left-8 pointer-events-none">
                <div className="bg-white/95 backdrop-blur-md px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20">
                  <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                    <MapPin size={18} className="text-gold" />
                  </div>
                  <span className="font-serif text-lg text-ink">View on Google Maps</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="space-y-16 pt-16 border-t border-black/5">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-2">
                <h2 className="text-4xl font-serif text-ink leading-tight">Student Reviews</h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-ink/30">Real feedback from verified residents</p>
              </div>
              <Button 
                onClick={() => setIsReviewModalOpen(true)}
                className="h-14 px-8 rounded-full bg-ink text-gold text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-ink/10"
              >
                <Plus size={16} />
                Write a Review
              </Button>
            </div>

            {/* Rating Summary */}
            <RatingSummary 
              averageRating={avgRating}
              totalReviews={reviews.length}
              breakdown={breakdown}
              className="p-12 rounded-[3rem] bg-paper/20 border border-black/5"
            />

            {/* Review List */}
            {loadingReviews ? (
              <div className="flex justify-center py-20">
                <RefreshCw className="animate-spin text-gold" size={32} />
              </div>
            ) : (
              <ReviewList reviews={mappedReviews} />
            )}
          </div>
        </div>

        {/* Right Column: Booking Card */}
        <div className="lg:col-span-4">
          <Card className="p-10 space-y-10 sticky top-24 border-black/5 shadow-2xl shadow-black/5 rounded-[3rem] bg-white">
            <div className="flex items-end justify-between">
              <div className="space-y-2">
                <span className="text-[10px] text-ink/40 font-bold uppercase tracking-widest">Monthly Rent</span>
                <p className="text-4xl font-serif text-ink">
                  Rs. {accommodation.price.toLocaleString()}
                </p>
              </div>
              <Badge className="bg-gold/10 text-gold border-none font-bold uppercase text-[10px] tracking-widest px-4 py-1.5 rounded-full">Available</Badge>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">Room Type Available</p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 rounded-full bg-paper text-ink/80 text-xs font-bold uppercase tracking-wider border border-black/5">
                    {accommodation.roomType}
                  </span>
                </div>
              </div>

              <div className="space-y-5 pt-8 border-t border-black/5">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-paper flex items-center justify-center text-ink/60">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] text-ink/30 font-bold uppercase tracking-widest">Minimum Stay</p>
                    <p className="font-bold text-ink text-sm uppercase tracking-wider">6 Months</p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-paper flex items-center justify-center text-ink/60">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] text-ink/30 font-bold uppercase tracking-widest">Security Deposit</p>
                    <p className="font-bold text-ink text-sm uppercase tracking-wider">{accommodation.deposit || 'Contact Owner'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <Button className="w-full h-16 text-sm uppercase tracking-widest font-bold rounded-full bg-ink text-gold hover:bg-ink/90 shadow-xl shadow-ink/10 transition-all hover:scale-[1.02]" onClick={onBook}>
                Book Now
              </Button>
              <Button 
                variant="outline" 
                className="w-full h-16 text-sm uppercase tracking-widest font-bold rounded-full border-black/10 hover:bg-paper flex items-center justify-center gap-3 transition-all"
                onClick={onContact}
              >
                <MessageSquare size={20} className="text-gold" />
                Contact Owner
              </Button>
            </div>

            <div className="pt-8 text-center space-y-2">
              <p className="text-[10px] text-ink/30 font-bold uppercase tracking-widest">
                Managed by <span className="text-ink">{accommodation.ownerName}</span>
              </p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[9px] text-ink/20 uppercase tracking-tighter font-bold">Response time: &lt; 2 hours</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};
