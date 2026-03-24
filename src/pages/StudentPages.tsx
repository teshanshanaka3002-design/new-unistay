import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Input, Modal, Container, Badge } from '../components/UI';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { 
  Search, 
  MapPin, 
  Home,
  Utensils,
  Zap,
  Eye,
  Heart,
  Star, 
  StarHalf,
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Minus, 
  Trash2, 
  Upload,
  Filter,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  User,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Globe,
  GraduationCap,
  ShieldCheck,
  Users,
  Bed,
  Mail,
  MessageSquare,
  Phone,
  MessageCircle,
  LayoutGrid,
  List,
  Calendar,
  History,
  Layers,
  Building2
} from 'lucide-react';

import { MapSection } from '../components/MapSection';
import { RequestSystem } from '../components/requests/RequestSystem';

// --- Student Dashboard ---
export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  
  const slides = [
    {
      image: "https://static.sliit.lk/wp-content/uploads/2024/09/13103301/SLIIT-Convocation-2024-September-6.jpeg",
      title: "Celebrate your success,",
      subtitle: "at the heart of campus.",
      desc: "StudentNest connects you to verified student housing, real-time meal menus, and a thriving campus community."
    },
    {
      image: "https://scontent.fcmb12-1.fna.fbcdn.net/v/t39.30808-6/473813801_920181070231389_5455240850749251132_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=2a1932&_nc_ohc=1JWLb8X7G6AQ7kNvwFvxjH9&_nc_oc=AdoTCgDZhMirOgEQxREFyOrrC7O-v4MDkg3_jmWibAj5CJDzBPeYnak_VskDkfbVJTTH2E-I9QN115gl39miv2gG&_nc_zt=23&_nc_ht=scontent.fcmb12-1.fna&_nc_gid=epTvNtsy-c0it9tu35Pd5Q&_nc_ss=7a30f&oh=00_AfyTPxRqjQyTogsYiWeWMQ8pk7qKHDngYFCB98zxvjG8iQ&oe=69C71389",
      title: "Join the community,",
      subtitle: "of future leaders.",
      desc: "Connect with thousands of fellow students. Share experiences, find roommates, and grow together."
    },
    {
      image: "https://utscollege.edu.lk/getmedia/4b87c23b-c5bd-4eff-b2d8-81ad29c306bb/1724900197-sl-hero-banner_start-in-october-dk.jpg",
      title: "Start your journey,",
      subtitle: "with the right stay.",
      desc: "Find verified boarding houses and apartments near your university. Safe, secure, and student-friendly."
    },
    {
      image: "https://umsl.campus-dining.com/wp-content/themes/he-ada/assets/img/menus/Menus-Hero.webp",
      title: "Fuel your ambition,",
      subtitle: "with healthy meals.",
      desc: "Pre-order from campus canteens and skip the queue. Fresh, affordable, and student-focused meals."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-32 pb-32">
      {/* Hero Section */}
      <section className="relative h-[90vh] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
            className="absolute inset-0"
          >
            <img 
              src={slides[index].image} 
              alt="Hero" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <motion.div
            key={`content-${index}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="max-w-5xl space-y-8"
          >
            <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-white/60 mb-4">
              <div className="w-1 h-1 rounded-full bg-gold" />
              The Campus OS 2.0
            </div>
            
            <h1 className="text-6xl md:text-[8rem] font-serif leading-[0.85] text-white tracking-tight">
              {slides[index].title} <br />
              <span className="italic text-gold">{slides[index].subtitle}</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed font-medium">
              {slides[index].desc}
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 pt-8">
              <button 
                onClick={() => navigate('/student/find-accommodation')}
                className="bg-white text-ink px-10 py-5 rounded-full font-bold text-sm uppercase tracking-widest hover:scale-105 transition-all duration-500 shadow-2xl flex items-center gap-3"
              >
                <Search size={18} />
                Find Housing
              </button>
              <button 
                onClick={() => navigate('/student/find-restaurants')}
                className="bg-transparent text-white border border-white/30 px-10 py-5 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition-all duration-500 backdrop-blur-sm"
              >
                Explore Meals
              </button>
            </div>
          </motion.div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-30">
          {slides.map((_, i) => (
            <button
              key={`hero-indicator-${i}`}
              onClick={() => setIndex(i)}
              className={cn(
                "h-1 rounded-full transition-all duration-500",
                index === i ? "w-12 bg-gold" : "w-4 bg-white/30"
              )}
            />
          ))}
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=2070" 
              alt="Student Life" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="space-y-8"
          >
            <h2 className="text-6xl md:text-8xl font-serif leading-[0.9] text-ink">
              Designed for <br />
              <span className="italic">Student Success.</span>
            </h2>
            <p className="text-xl text-ink/50 leading-relaxed max-w-lg">
              University life is chaotic enough. Your digital tools shouldn't add to the noise. StudentNest is built with a philosophy of clarity, speed, and reliability.
            </p>
            <button className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-ink hover:text-gold transition-colors group">
              Read our philosophy
              <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Quick Stats / Features */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12">
          {[
            { label: "Verified Stays", value: "1,200+", desc: "Every property is manually inspected for safety and comfort." },
            { label: "Campus Meals", value: "45+", desc: "Real-time menus and nutritional info from all campus canteens." },
            { label: "Student Community", value: "15k+", desc: "Join a thriving network of students sharing tips and experiences." }
          ].map((stat, i) => (
            <motion.div
              key={`stat-${i}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 rounded-[2.5rem] bg-white border border-black/5 space-y-6 shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="text-xs font-bold uppercase tracking-widest text-gold">{stat.label}</div>
              <div className="text-5xl font-serif">{stat.value}</div>
              <p className="text-ink/40 leading-relaxed">{stat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Map Section */}
      <MapSection />

      {/* Reviews Section */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto">
        <div className="space-y-20">
          <div className="text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold"
            >
              Student Testimonials
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-serif text-ink"
            >
              What students <br />
              <span className="italic text-gold">say about us.</span>
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                text: "StudentNest made finding a boarding house so much easier. The verification process gives me peace of mind as an international student.",
                author: "Sarah Johnson",
                uni: "SLIIT",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
              },
              {
                text: "The meal menu feature is a lifesaver! I can check what's available before even leaving my lecture and skip the long queues.",
                author: "Jason Perera",
                uni: "NSBM",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
              },
              {
                text: "The community aspect is great. I found my current roommate through the requests system. It's safe and very user-friendly.",
                author: "Amali Silva",
                uni: "IIT",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150"
              }
            ].map((review, i) => (
              <motion.div
                key={`testimonial-${i}`}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-[3rem] bg-white border border-black/5 space-y-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group"
              >
                <div className="flex gap-1 text-gold">
                  {[...Array(5)].map((_, starIdx) => (
                    <Star key={`star-${i}-${starIdx}`} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-lg text-ink/60 leading-relaxed italic">
                  "{review.text}"
                </p>
                <div className="flex items-center gap-4 pt-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gold/20 group-hover:border-gold transition-colors duration-500">
                    <img src={review.avatar} alt={review.author} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-ink">{review.author}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-ink/30">{review.uni}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-end">
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              onClick={() => navigate('/student/reviews')}
              className="group flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40 hover:text-gold transition-all duration-500"
            >
              View all reviews
              <div className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center group-hover:border-gold group-hover:bg-gold group-hover:text-white transition-all duration-500 shadow-sm">
                <ArrowRight size={14} />
              </div>
            </motion.button>
          </div>
        </div>
      </section>

      {/* FAQ & Support Section */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto pb-32">
        <div className="grid lg:grid-cols-2 gap-24">
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-ink/30">
                Common Inquiries
              </div>
              <h2 className="text-6xl font-serif leading-tight text-ink">
                We have 24/7 support <br />
                <span className="italic text-gold">available.</span>
              </h2>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <button className="flex items-center gap-3 px-8 py-4 rounded-full border border-emerald-500/20 bg-emerald-50 text-emerald-600 font-bold text-xs uppercase tracking-widest hover:bg-emerald-100 transition-all duration-300">
                <MessageCircle size={18} />
                Whatsapp Us
              </button>
              <button className="flex items-center gap-3 px-8 py-4 rounded-full bg-gold text-white font-bold text-xs uppercase tracking-widest hover:bg-ink transition-all duration-300 shadow-lg shadow-gold/20">
                <Phone size={18} />
                Call an Expert
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <FAQItem 
              question="What types of accommodation are available for students" 
              answer="At StudentNest, students can choose from a variety of accommodation options. These include studio rooms, ensuites, shared apartments and private apartments."
              defaultOpen={true}
            />
            <FAQItem 
              question="How to book student accommodation with StudentNest?" 
              answer="Booking is simple. Browse our verified listings, select your preferred stay, and click 'Book Now'. Our team will guide you through the verification and payment process."
            />
            <FAQItem 
              question="Is there any deposit or booking fee?" 
              answer="Yes, a standard security deposit is usually required by property owners. StudentNest itself does not charge hidden booking fees for students."
            />
            <FAQItem 
              question="Are the rooms and apartments provided by StudentNest verified?" 
              answer="Absolutely. Every property listed on StudentNest undergoes a rigorous manual inspection process to ensure it meets our standards for safety, cleanliness, and comfort."
            />
            <FAQItem 
              question="Does StudentNest Offer Group Bookings?" 
              answer="Yes, we support group bookings. If you and your friends want to stay together, simply reach out to our support team or mention it in your booking request."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FAQItem: React.FC<{ question: string; answer: string; defaultOpen?: boolean }> = ({ question, answer, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-black/5 py-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <span className={cn(
          "text-xl font-serif transition-colors",
          isOpen ? "text-gold" : "text-ink group-hover:text-gold"
        )}>
          {question}
        </span>
        <div className={cn(
          "w-8 h-8 rounded-full border border-black/5 flex items-center justify-center transition-all duration-500",
          isOpen ? "bg-ink text-white rotate-180" : "bg-white text-ink"
        )}>
          <ChevronRight size={16} />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            className="overflow-hidden"
          >
            <p className="text-ink/50 leading-relaxed pb-6 text-sm max-w-xl">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


import { Accommodation, BookingRequest } from '../types/accommodation';
import { FilterState, INITIAL_FILTERS } from '../types/filters';
import { Canteen, MenuItem, Order, OrderItem, OrderStatus } from '../types/canteen';
import { MealsDashboard } from '../components/meals/MealsDashboard';
import { AccommodationCard } from '../components/accommodation/AccommodationCard';
import { FilterSidebar } from '../components/accommodation/FilterSidebar';
import { TopFilterBar } from '../components/accommodation/TopFilterBar';
import { AccommodationDetails } from '../components/accommodation/AccommodationDetails';
import { BookingModal } from '../components/accommodation/BookingModal';
import { ContactModal } from '../components/accommodation/ContactModal';
import axios from 'axios';

// --- Find Accommodation ---
export const FindAccommodation: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [listings, setListings] = useState<any[]>([]);
  const [filteredListings, setFilteredListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, listings]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/accommodations');
      const mapped = (Array.isArray(res.data) ? res.data : []).map((item: any) => ({
        ...item,
        id: item._id || item.id || `acc-${Math.random()}`
      }));
      setListings(mapped);
    } catch (err) {
      console.error('Failed to fetch listings', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...listings];

    // City Filter
    if (filters.city) {
      result = result.filter(l => 
        l.city?.toLowerCase().includes(filters.city.toLowerCase()) ||
        l.location?.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    // University Filter
    if (filters.university) {
      result = result.filter(l => l.university === filters.university);
    }

    // Price Filter
    result = result.filter(l => l.price >= filters.minPrice && l.price <= filters.maxPrice);

    // Room Type Filter
    if (filters.roomTypes.length > 0) {
      result = result.filter(l => filters.roomTypes.includes(l.roomType));
    }

    // Property Type Filter
    if (filters.propertyTypes.length > 0) {
      result = result.filter(l => filters.propertyTypes.includes(l.propertyType));
    }

    // Facilities Filter
    if (filters.facilities.length > 0) {
      result = result.filter(l => 
        filters.facilities.every(f => l.facilities?.includes(f))
      );
    }

    // Gender Preference
    if (filters.genderPreference !== 'Any') {
      result = result.filter(l => l.genderPreference === filters.genderPreference || l.genderPreference === 'Mixed');
    }

    // Rating Filter
    if (filters.minRating > 0) {
      result = result.filter(l => l.rating >= filters.minRating);
    }

    // Sorting
    if (filters.sortBy === 'Price: Low to High') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'Price: High to Low') {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'Rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    setFilteredListings(result);
  };

  const handleBookingSubmit = async (data: any) => {
    try {
      await axios.post('/api/bookings', {
        ...data,
        accommodationId: selectedListing._id,
        studentId: 'student-123', // Mock student ID
      });
      setIsBookingModalOpen(false);
      alert('Booking request sent successfully!');
    } catch (err) {
      console.error('Failed to submit booking', err);
    }
  };

  if (selectedListing) {
    return (
      <div className="min-h-screen bg-paper pb-20">
        <div className="max-w-7xl mx-auto px-6 pt-12">
          <AccommodationDetails 
            accommodation={selectedListing}
            onBack={() => setSelectedListing(null)}
            onBook={() => setIsBookingModalOpen(true)}
            onContact={() => setIsContactModalOpen(true)}
          />
        </div>

        {isBookingModalOpen && (
          <BookingModal 
            isOpen={isBookingModalOpen}
            onClose={() => setIsBookingModalOpen(false)}
            accommodation={selectedListing}
            onSubmit={handleBookingSubmit}
          />
        )}

        {isContactModalOpen && (
          <ContactModal 
            isOpen={isContactModalOpen}
            onClose={() => setIsContactModalOpen(false)}
            accommodation={selectedListing}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <main className="max-w-[1600px] mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full lg:w-96 shrink-0">
            <FilterSidebar 
              filters={filters}
              setFilters={setFilters}
              onClear={() => setFilters(INITIAL_FILTERS)}
              onApply={() => {}} // Filters apply automatically via useEffect
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-10">
            <TopFilterBar 
              filters={filters}
              setFilters={setFilters}
              resultsCount={filteredListings.length}
            />

            <div className={cn(
              "grid gap-8",
              viewType === 'grid' ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
            )}>
              {loading ? (
                <div className="col-span-full text-center py-20">
                  <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-ink/30 font-serif text-xl italic">Loading verified stays...</p>
                </div>
              ) : filteredListings.length > 0 ? (
                filteredListings.map((listing) => (
                  <AccommodationCard 
                    key={listing.id} 
                    accommodation={listing} 
                    onClick={() => setSelectedListing(listing)} 
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-20 bg-white rounded-[3rem] border border-black/5">
                  <p className="text-ink/30 font-serif text-2xl italic">No stays found matching your search.</p>
                  <button 
                    onClick={() => setFilters(INITIAL_FILTERS)}
                    className="mt-4 text-gold font-bold uppercase tracking-widest text-xs hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Bar */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-ink text-white px-8 py-4 rounded-2xl flex items-center gap-8 shadow-2xl shadow-ink/40 border border-white/10 backdrop-blur-md">
          <button className="flex items-center gap-3 text-sm font-bold hover:text-gold transition-colors">
            <Layers size={18} />
            Compare
          </button>
          <div className="w-px h-6 bg-white/10" />
          <button className="flex items-center gap-3 text-sm font-bold hover:text-gold transition-colors">
            <Heart size={18} />
            Wishlist
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Find Restaurants ---
export const FindRestaurants: React.FC = () => {
  return <MealsDashboard />;
};


// --- My Bookings ---
export const MyBookings: React.FC = () => {
  const navigate = useNavigate();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-16 pb-32">
      <div className="space-y-6">
        <button 
          onClick={() => navigate('/student/find-accommodation')}
          className="flex items-center gap-3 px-6 py-3 bg-white border border-black/5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-ink/60 hover:text-ink hover:bg-gold/10 transition-all shadow-sm group w-fit"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Stays
        </button>
        <div className="space-y-4">
          <h1 className="text-6xl font-serif text-ink">My Bookings</h1>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-ink/30">Track your housing requests and payments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {[1, 2].map((_, i) => (
          <motion.div 
            key={`booking-${i}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative bg-white rounded-[3rem] border border-black/5 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700"
          >
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/3 h-80 lg:h-auto overflow-hidden relative">
                <img 
                  src={`https://picsum.photos/seed/room${i}/800/800`} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                  referrerPolicy="no-referrer" 
                />
                <div className="absolute top-8 left-8">
                  <div className={cn(
                    "px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest border backdrop-blur-md",
                    i === 0 ? 'bg-emerald-50/80 text-emerald-600 border-emerald-100' : 'bg-amber-50/80 text-amber-600 border-amber-100'
                  )}>
                    {i === 0 ? 'Confirmed' : 'Pending Approval'}
                  </div>
                </div>
              </div>
              
              <div className="flex-1 p-12 lg:p-16 space-y-10">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="text-4xl font-serif text-ink group-hover:text-gold transition-colors">Premium Student Suite</h3>
                    <div className="flex items-center gap-2 text-ink/40 text-[10px] font-bold uppercase tracking-widest">
                      <MapPin size={14} className="text-gold" />
                      123 University Ave, Malabe
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-12 py-10 border-y border-black/5">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-ink/20">Monthly Rent</p>
                    <p className="text-2xl font-serif text-ink">LKR 25,000</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-ink/20">Move-in Date</p>
                    <p className="text-2xl font-serif text-ink">April 1, 2026</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-ink/20">Payment Status</p>
                    <p className={cn("text-2xl font-serif", i === 0 ? "text-emerald-600" : "text-amber-600")}>
                      {i === 0 ? 'Paid' : 'Unpaid'}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-6 pt-4">
                  <button className="text-[10px] font-bold uppercase tracking-widest text-ink/40 hover:text-ink transition-colors">
                    View Details
                  </button>
                  {i !== 0 && (
                    <button 
                      onClick={() => { setSelectedBooking(i); setIsUploadModalOpen(true); }}
                      className="px-8 py-4 bg-ink text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-gold transition-all duration-300"
                    >
                      Upload Receipt
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsUploadModalOpen(false); setPreviewImage(null); }}
              className="absolute inset-0 bg-ink/60 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-paper rounded-[3rem] p-16 shadow-2xl space-y-10"
            >
              <div className="space-y-4">
                <h2 className="text-4xl font-serif text-ink">Upload Payment Proof</h2>
                <p className="text-sm text-ink/40">Please provide a clear image of your bank transfer receipt for verification.</p>
              </div>
              
              <div className="relative aspect-video rounded-[2rem] border-2 border-dashed border-ink/10 bg-white flex flex-col items-center justify-center overflow-hidden group transition-colors hover:border-gold/30">
                {previewImage ? (
                  <>
                    <img src={previewImage} className="w-full h-full object-contain" />
                    <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={() => setPreviewImage(null)}
                        className="px-6 py-3 bg-white text-ink rounded-full text-[10px] font-bold uppercase tracking-widest"
                      >
                        Change Image
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload size={40} className="text-ink/10 mb-4" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Click to select or drag and drop</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-ink/20 mt-2">PNG, JPG up to 5MB</p>
                    <input 
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => { setIsUploadModalOpen(false); setPreviewImage(null); }}
                  className="flex-1 py-5 text-[10px] font-bold uppercase tracking-widest text-ink/40 hover:text-ink transition-colors"
                >
                  Cancel
                </button>
                <button 
                  disabled={!previewImage}
                  onClick={() => setIsUploadModalOpen(false)}
                  className="flex-1 py-5 bg-ink text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-gold disabled:opacity-20 disabled:hover:bg-ink transition-all duration-300"
                >
                  Confirm Upload
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Student Requests ---
export const StudentRequests: React.FC = () => {
  const [view, setView] = useState<'list' | 'new'>('list');
  const [requests] = useState([
    { id: 1, type: 'Maintenance', subject: 'Broken tap in bathroom', status: 'Pending', date: '2026-03-15' },
    { id: 2, type: 'General', subject: 'Inquiry about meal plan', status: 'Resolved', date: '2026-03-10' },
  ]);

  if (view === 'new') {
    return (
      <div className="space-y-12 pb-32">
        <button 
          onClick={() => setView('list')}
          className="flex items-center gap-3 px-6 py-3 bg-white border border-black/5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-ink/60 hover:text-ink hover:bg-gold/10 transition-all shadow-sm group w-fit"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to My Requests
        </button>
        <RequestSystem />
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-32">
      <div className="flex justify-between items-end">
        <div className="space-y-4">
          <h1 className="text-6xl font-serif text-ink">My Requests</h1>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-ink/30">Support and maintenance tracking</p>
        </div>
        <button 
          onClick={() => setView('new')}
          className="px-10 py-5 bg-ink text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-gold transition-all duration-300 flex items-center gap-3 shadow-xl shadow-ink/10"
        >
          <Plus size={18} /> 
          New Request
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {requests.map((req) => (
          <motion.div 
            key={`req-${req.id}`}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-10 rounded-[2.5rem] bg-white border border-black/5 shadow-lg hover:shadow-xl transition-all duration-500 group"
          >
            <div className="flex justify-between items-center">
              <div className="flex gap-8 items-center">
                <div className="w-16 h-16 bg-paper rounded-2xl flex items-center justify-center text-ink/20 group-hover:text-gold transition-colors">
                  <MessageSquare size={28} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-serif text-ink">{req.subject}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-ink/30">{req.type} • {req.date}</p>
                </div>
              </div>
              <div className={cn(
                "px-5 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest border",
                req.status === 'Pending' ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
              )}>
                {req.status}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// --- Canteen Owner Dashboard ---
export const CanteenOwnerDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/orders?canteenId=cant-1');
      const mapped = (Array.isArray(res.data) ? res.data : []).map((item: any) => ({
        ...item,
        id: item._id || item.id || `ord-${Math.random()}`
      }));
      setOrders(mapped);
    } catch (err) {
      console.error('Failed to fetch orders', err);
      // Mock orders for dashboard preview
      setOrders([
        {
          id: 'ord-101',
          userId: 'user-1',
          canteenId: 'cant-1',
          canteenName: 'The Grand Hall',
          items: [{ menuItemId: 'm1', name: 'Signature Truffle Pasta', price: 1200, quantity: 1 }],
          totalPrice: 1200,
          status: 'Pending',
          pickupTime: '12:30 PM',
          createdAt: new Date().toISOString()
        },
        {
          id: 'ord-102',
          userId: 'user-2',
          canteenId: 'cant-1',
          canteenName: 'The Grand Hall',
          items: [{ menuItemId: 'm2', name: 'Quinoa Buddha Bowl', price: 950, quantity: 2 }],
          totalPrice: 1900,
          status: 'Preparing',
          pickupTime: '1:00 PM',
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await axios.patch(`/api/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (err) {
      console.error('Failed to update status', err);
      // Optimistic update for demo
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-paper p-12 lg:p-24 space-y-16">
      <div className="flex justify-between items-end">
        <div className="space-y-4">
          <h1 className="text-6xl font-serif text-ink">Canteen Dashboard</h1>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-ink/30">Order Management System</p>
        </div>
        <div className="flex gap-6">
          <div className="px-8 py-4 bg-white border border-black/5 rounded-full text-center">
            <p className="text-[9px] font-bold uppercase tracking-widest text-ink/30">Active Orders</p>
            <p className="text-xl font-serif text-ink">{orders.filter(o => o.status !== 'Collected').length}</p>
          </div>
          <button 
            onClick={fetchOrders}
            className="w-14 h-14 bg-white border border-black/5 rounded-full flex items-center justify-center text-ink/40 hover:text-ink transition-colors"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {orders.map((order) => (
          <motion.div 
            key={`order-${order.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-12 rounded-[3rem] bg-white border border-black/5 shadow-xl space-y-10"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <h3 className="text-3xl font-serif text-ink">Order #{order.id}</h3>
                  <span className={cn(
                    "px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border",
                    order.status === 'Pending' ? "bg-amber-50 text-amber-600 border-amber-100" : 
                    order.status === 'Preparing' ? "bg-blue-50 text-blue-600 border-blue-100" :
                    "bg-emerald-50 text-emerald-600 border-emerald-100"
                  )}>
                    {order.status}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-ink/40">
                    Student: <span className="text-ink">{order.studentName || 'Anonymous'}</span> ({order.studentUniversity || 'N/A'})
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-ink/20">Pickup Time: {order.pickupTime}</p>
                </div>
              </div>
              <div className="text-right space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-ink/20">Total Value</p>
                <p className="text-3xl font-serif text-ink">LKR {order.totalPrice}</p>
              </div>
            </div>

            <div className="space-y-4 py-8 border-y border-black/5">
              {order.items.map((item, itemIdx) => (
                <div key={`order-item-${order.id}-${itemIdx}`} className="flex justify-between items-center">
                  <span className="text-ink/60 font-medium">{item.name}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-ink/20">Quantity: {item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-4">
              {order.status === 'Pending' && (
                <button 
                  onClick={() => updateStatus(order.id, 'Preparing')}
                  className="px-8 py-4 bg-blue-600 text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all"
                >
                  Start Preparing
                </button>
              )}
              {order.status === 'Preparing' && (
                <button 
                  onClick={() => updateStatus(order.id, 'Ready')}
                  className="px-8 py-4 bg-emerald-600 text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all"
                >
                  Mark as Ready
                </button>
              )}
              {order.status === 'Ready' && (
                <button 
                  onClick={() => updateStatus(order.id, 'Collected')}
                  className="px-8 py-4 bg-ink text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-gold transition-all"
                >
                  Confirm Collection
                </button>
              )}
            </div>
          </motion.div>
        ))}

        {orders.length === 0 && !loading && (
          <div className="text-center py-32 space-y-6 bg-white rounded-[4rem] border border-black/5">
            <ShoppingBag size={48} className="mx-auto text-ink/10" />
            <p className="text-ink/40 font-serif text-2xl">No incoming orders at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- All Reviews Page ---
export const AllReviewsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Simulation: Check eligibility
  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we'll simulate eligibility if the user is a STUDENT
    if (user?.role === 'STUDENT') {
      setIsEligible(true);
    }
  }, [user]);

  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      university: "SLIIT",
      comment: "StudentNest made finding a boarding house so much easier. The verification process gives me peace of mind as an international student.",
      rating: 5,
      date: "2 days ago",
      verified: true,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
    },
    {
      id: 2,
      name: "Jason Perera",
      university: "NSBM",
      comment: "The meal menu feature is a lifesaver! I can check what's available before even leaving my lecture and skip the long queues.",
      rating: 4,
      date: "1 week ago",
      verified: true,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
    },
    {
      id: 3,
      name: "Amali Silva",
      university: "IIT",
      comment: "The community aspect is great. I found my current roommate through the requests system. It's safe and very user-friendly.",
      rating: 5,
      date: "March 2026",
      verified: true,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150"
    },
    {
      id: 4,
      name: "Dulaj Nimna",
      university: "UoM",
      comment: "Great experience overall. The map feature is very accurate and helped me find places I didn't even know existed.",
      rating: 4.5,
      date: "2 weeks ago",
      verified: true,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"
    }
  ]);

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    userId: user?.id || '',
    universityId: '',
    contactNumber: '',
    rating: 0,
    comment: ''
  });

  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const newErrors: any = {};
    if (!formData.fullName || formData.fullName.length < 3) newErrors.fullName = "Full Name must be at least 3 characters";
    if (!formData.userId) newErrors.userId = "User ID is required";
    if (!formData.universityId) newErrors.universityId = "University ID is required";
    if (!formData.contactNumber || !/^\d{10}$/.test(formData.contactNumber)) newErrors.contactNumber = "Contact Number must be 10 digits";
    if (formData.rating < 1 || formData.rating > 5) newErrors.rating = "Rating must be between 1 and 5";
    if (!formData.comment || formData.comment.length < 10) newErrors.comment = "Comment must be at least 10 characters";
    if (formData.comment.length > 300) newErrors.comment = "Comment must be less than 300 characters";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newReview = {
      id: Date.now(),
      name: formData.fullName,
      university: "Student", // Simplified
      comment: formData.comment,
      rating: formData.rating,
      date: "Just now",
      verified: true,
      avatar: user?.avatar || `https://ui-avatars.com/api/?name=${formData.fullName}&background=random`
    };

    setReviews([newReview, ...reviews]);
    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setSuccess(false);
      setFormData({
        fullName: user?.name || '',
        userId: user?.id || '',
        universityId: '',
        contactNumber: '',
        rating: 0,
        comment: ''
      });
    }, 2000);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<Star key={i} size={14} fill="currentColor" className="text-gold" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<StarHalf key={i} size={14} fill="currentColor" className="text-gold" />);
      } else {
        stars.push(<Star key={i} size={14} className="text-ink/10" />);
      }
    }
    return stars;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 space-y-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold"
          >
            Community Feedback
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-serif text-ink"
          >
            Student <br />
            <span className="italic text-gold">Reviews.</span>
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-end gap-4"
        >
          {!isEligible && (
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink/30 max-w-[200px] text-right">
              Only students who have stayed in this accommodation can submit a review.
            </p>
          )}
          <button
            disabled={!isEligible}
            onClick={() => setIsModalOpen(true)}
            className={cn(
              "px-10 py-5 rounded-full font-bold text-sm uppercase tracking-widest transition-all duration-500 shadow-2xl flex items-center gap-3",
              isEligible 
                ? "bg-ink text-white hover:bg-gold hover:scale-105" 
                : "bg-ink/5 text-ink/20 cursor-not-allowed"
            )}
          >
            <Plus size={18} />
            Write a Review
          </button>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reviews.map((review, i) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-10 rounded-[3rem] bg-white border border-black/5 space-y-8 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
          >
            {review.verified && (
              <div className="absolute top-0 right-0 bg-emerald-50 text-emerald-600 px-6 py-2 rounded-bl-3xl text-[9px] font-bold uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={12} />
                Verified Student
              </div>
            )}
            
            <div className="flex gap-1">
              {renderStars(review.rating)}
            </div>

            <p className="text-lg text-ink/60 leading-relaxed italic">
              "{review.comment}"
            </p>

            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gold/20 group-hover:border-gold transition-colors duration-500">
                  <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <div className="text-sm font-bold text-ink">{review.name}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-ink/30">{review.university}</div>
                </div>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-ink/20">
                {review.date}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Review Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Share Your Experience"
      >
        <div className="p-8 space-y-8">
          {success ? (
            <div className="text-center py-12 space-y-6">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-serif text-ink">Thank You!</h3>
                <p className="text-ink/40">Your review has been submitted successfully!</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className={cn(
                      "w-full px-6 py-4 rounded-2xl border bg-paper/50 focus:outline-none transition-all",
                      errors.fullName ? "border-red-500" : formData.fullName.length >= 3 ? "border-emerald-500" : "border-black/5"
                    )}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">{errors.fullName}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-ink/40">User ID</label>
                  <input
                    type="text"
                    value={formData.userId}
                    onChange={(e) => setFormData({...formData, userId: e.target.value})}
                    className={cn(
                      "w-full px-6 py-4 rounded-2xl border bg-paper/50 focus:outline-none transition-all",
                      errors.userId ? "border-red-500" : formData.userId ? "border-emerald-500" : "border-black/5"
                    )}
                    placeholder="Enter your user ID"
                  />
                  {errors.userId && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">{errors.userId}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-ink/40">University ID</label>
                  <input
                    type="text"
                    value={formData.universityId}
                    onChange={(e) => setFormData({...formData, universityId: e.target.value})}
                    className={cn(
                      "w-full px-6 py-4 rounded-2xl border bg-paper/50 focus:outline-none transition-all",
                      errors.universityId ? "border-red-500" : formData.universityId ? "border-emerald-500" : "border-black/5"
                    )}
                    placeholder="Enter your university ID"
                  />
                  {errors.universityId && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">{errors.universityId}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Contact Number</label>
                  <input
                    type="text"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                    className={cn(
                      "w-full px-6 py-4 rounded-2xl border bg-paper/50 focus:outline-none transition-all",
                      errors.contactNumber ? "border-red-500" : /^\d{10}$/.test(formData.contactNumber) ? "border-emerald-500" : "border-black/5"
                    )}
                    placeholder="e.g. 0771234567"
                  />
                  {errors.contactNumber && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">{errors.contactNumber}</p>}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Rating</label>
                <div className="flex gap-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({...formData, rating: star})}
                      className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                        formData.rating >= star ? "bg-gold text-white shadow-lg shadow-gold/20" : "bg-paper text-ink/20 hover:bg-black/5"
                      )}
                    >
                      <Star size={20} fill={formData.rating >= star ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
                {errors.rating && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">{errors.rating}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Review Comment</label>
                  <span className="text-[10px] font-bold text-ink/20">{formData.comment.length}/300</span>
                </div>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({...formData, comment: e.target.value})}
                  rows={4}
                  className={cn(
                    "w-full px-6 py-4 rounded-3xl border bg-paper/50 focus:outline-none transition-all resize-none",
                    errors.comment ? "border-red-500" : formData.comment.length >= 10 ? "border-emerald-500" : "border-black/5"
                  )}
                  placeholder="Tell us about your stay..."
                />
                {errors.comment && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">{errors.comment}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-6 bg-ink text-white rounded-full font-bold text-sm uppercase tracking-widest hover:bg-gold transition-all duration-500 shadow-2xl flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </button>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
};
