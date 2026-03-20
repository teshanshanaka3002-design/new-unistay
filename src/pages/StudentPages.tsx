import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Globe,
  GraduationCap,
  ShieldCheck,
  Users,
  Bed,
  Mail,
  MessageSquare,
  Phone,
  MessageCircle
} from 'lucide-react';

// --- Student Dashboard ---
export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  
  const bannerImages = [
    "https://www.bigrivergroup.com.au/wp-content/uploads/2015/09/aaa-untitled-9-1130x480.jpg",
    "https://a.storyblok.com/f/305884/2880x1440/c7d1253582/scape-girl-drinking-tea-on-bed-2-1.jpg/m/1440x720/filters:quality(80):format(webp)",
    "https://umsl.campus-dining.com/wp-content/themes/he-ada/assets/img/menus/Menus-Hero.webp"
  ];

  const bannerContent = [
    {
      title: "Trusted by Many Students",
      accent: "Serving students since 2021"
    },
    {
      title: "Find Your Perfect Home",
      accent: "100% Verified Properties"
    },
    {
      title: "Healthy & Affordable Meals",
      accent: "Student-Friendly Prices"
    }
  ];

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentImageIndex((prev) => (prev + newDirection + bannerImages.length) % bannerImages.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 1.1
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9
    })
  };

  return (
    <div className="pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero Section - Carousel */}
      <div className="relative h-[600px] overflow-hidden group mb-12">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentImageIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 100, damping: 20 },
              opacity: { duration: 0.5 }
            }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
            <img 
              src={bannerImages[currentImageIndex]} 
              alt="Banner" 
              className="w-full h-full object-cover scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 md:px-16 max-w-4xl space-y-8">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight"
              >
                {bannerContent[currentImageIndex].title}
              </motion.h1>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-6 pt-4"
              >
                <Button size="lg" className="h-14 px-8 text-lg rounded-xl shadow-xl shadow-blue-600/20" onClick={() => navigate('/student/find-accommodation')}>
                  Explore Now
                </Button>
                <div className="flex items-center gap-3 text-white font-medium bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl border border-white/20">
                  <ShieldCheck size={24} className="text-emerald-400" />
                  <span className="text-lg">{bannerContent[currentImageIndex].accent}</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <button 
          onClick={() => paginate(-1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={() => paginate(1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-all"
        >
          <ChevronRight size={24} />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {bannerImages.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > currentImageIndex ? 1 : -1);
                setCurrentImageIndex(i);
              }}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                i === currentImageIndex ? "bg-white w-6" : "bg-white/50"
              )}
            />
          ))}
        </div>
      </div>

      <Container className="space-y-12">
        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-8 hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden" onClick={() => navigate('/student/find-accommodation')}>
          <img 
            src="https://www.lancaster.ac.uk/media/lancaster-university/content-assets/images/colleges/county/accommodation/County-Bedroom-with-private-bathroom.jpg" 
            alt="Accommodation" 
            className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-500 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/60 z-10" />
          <div className="flex items-start gap-6 relative z-20">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-blue-600 transition-colors">
              <Home size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Find Accommodation</h2>
              <p className="text-white/80">Discover verified boarding houses and apartments near your university.</p>
              <div className="pt-4 flex items-center text-blue-400 font-bold gap-2">
                Browse Properties <ArrowRight size={18} />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8 hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden" onClick={() => navigate('/student/find-restaurants')}>
          <img 
            src="https://www.udel.edu/academics/colleges/cas/units/eli/students/dining/_jcr_content/par_udel/panelforpages/par_1/columngenerator_copy/par_1/image.coreimg.jpeg/1734372047747/diningoncampus-3.jpeg" 
            alt="Meals" 
            className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-500 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/60 z-10" />
          <div className="flex items-start gap-6 relative z-20">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-emerald-600 transition-colors">
              <Utensils size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Order Meals</h2>
              <p className="text-white/80">Order healthy, affordable meals delivered straight to your doorstep.</p>
              <div className="pt-4 flex items-center text-emerald-400 font-bold gap-2">
                Explore Menus <ArrowRight size={18} />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Featured Cities */}
      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Featured Cities</h2>
            <p className="text-slate-500">Find the best places to stay in top university towns.</p>
          </div>
          <Button variant="ghost" className="text-blue-600 font-bold">
            View All Cities <ChevronRight size={18} className="ml-1" />
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: "Colombo", count: 124, img: "https://images.unsplash.com/photo-1588127333419-b9d7de223dcf?q=80&w=2069&auto=format&fit=crop" },
            { name: "Kandy", count: 86, img: "https://images.unsplash.com/photo-1590050752117-23a9d7fc6bbd?q=80&w=2070&auto=format&fit=crop" },
            { name: "Galle", count: 52, img: "https://images.unsplash.com/photo-1627664819818-e147d6221422?q=80&w=2070&auto=format&fit=crop" },
            { name: "Matara", count: 45, img: "https://images.unsplash.com/photo-1551918120-9739cb430c6d?q=80&w=2070&auto=format&fit=crop" }
          ].map((city, i) => (
            <div key={i} className="relative h-48 rounded-2xl overflow-hidden group cursor-pointer shadow-md">
              <img src={city.img} alt={city.name} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4">
                <h3 className="text-white font-bold text-lg">{city.name}</h3>
                <p className="text-white/80 text-xs">{city.count} Properties</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Properties Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Popular Properties</h2>
            <p className="text-slate-500">Hand-picked accommodations for your comfort.</p>
          </div>
          <Button variant="ghost" className="text-blue-600 font-bold">
            View All <ChevronRight size={18} className="ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'SLIIT Green Residence', price: '25,000', type: 'Studio Apartment', img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop', rating: '4.9' },
            { name: 'Kaduwela Student Inn', price: '18,500', type: 'Shared Room', img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop', rating: '4.7' },
            { name: 'Pittugala Luxury Boarding', price: '35,000', type: 'Premium Suite', img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop', rating: '5.0' },
          ].map((prop, i) => (
            <Card key={i} className="p-0 overflow-hidden hover:shadow-lg transition-all group border-slate-100">
              <div className="relative h-48">
                <img src={prop.img} alt={prop.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                  <Star size={12} className="text-amber-500 fill-amber-500" /> {prop.rating}
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">{prop.type}</p>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{prop.name}</h3>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <p className="text-blue-600 font-bold text-xl">Rs. {prop.price}<span className="text-xs text-slate-400 font-normal">/mo</span></p>
                  <Button size="sm" className="rounded-lg">View Details</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>


      {/* Popular Meals Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Popular Meals</h2>
            <p className="text-slate-500">Healthy and affordable meals for students.</p>
          </div>
          <Button variant="ghost" className="text-emerald-600 font-bold">
            View Menu <ChevronRight size={18} className="ml-1" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { name: 'Chicken Fried Rice', price: '450', rating: '4.8', img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=2050&auto=format&fit=crop' },
            { name: 'Veggie Pasta', price: '380', rating: '4.6', img: 'https://images.unsplash.com/photo-1473093226795-af9932fe5855?q=80&w=2018&auto=format&fit=crop' },
            { name: 'Classic Burger', price: '550', rating: '4.9', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899&auto=format&fit=crop' },
            { name: 'Healthy Salad', price: '320', rating: '4.7', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop' },
          ].map((meal, i) => (
            <Card key={i} className="p-0 overflow-hidden hover:shadow-md transition-all group">
              <div className="relative h-40">
                <img src={meal.img} alt={meal.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                  <Star size={12} className="text-amber-500 fill-amber-500" /> {meal.rating}
                </div>
              </div>
              <div className="p-4 space-y-3">
                <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{meal.name}</h3>
                <div className="flex items-center justify-between">
                  <p className="text-emerald-600 font-bold">Rs. {meal.price}</p>
                  <Button size="sm" variant="outline" className="h-8 px-3">Order</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>


      {/* Why Choose Us Section */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { icon: <Globe className="text-blue-600" />, value: '640', label: 'Cities' },
          { icon: <GraduationCap className="text-blue-600" />, value: '5.5k+', label: 'Universities' },
          { icon: <ShieldCheck className="text-blue-600" />, value: '65k+', label: 'Verified Homes' },
          { icon: <Users className="text-blue-600" />, value: '12Mn', label: 'Students' },
          { icon: <Bed className="text-blue-600" />, value: '23Mn', label: 'Nights Booked' },
        ].map((item, i) => (
          <Card key={i} className="text-center p-6 space-y-2">
            <div className="flex justify-center">{item.icon}</div>
            <p className="text-2xl font-bold text-slate-900">{item.value}</p>
            <p className="text-xs text-slate-500 font-medium">{item.label}</p>
          </Card>
        ))}
      </section>

      {/* Let's Connect Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">Let's Connect</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { icon: <Mail className="text-blue-600" />, title: 'Email Us', desc: 'care@universityliving.com' },
            { icon: <MessageSquare className="text-blue-600" />, title: 'Live Chat', desc: 'Start a conversation' },
            { icon: <Phone className="text-blue-600" />, title: 'Call Us', desc: '+44 203 695 6785' },
            { icon: <MessageCircle className="text-blue-600" />, title: 'WhatsApp', desc: 'Chat with us' },
          ].map((item, i) => (
            <Card key={i} className="p-6 text-center space-y-3 hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="flex justify-center">{item.icon}</div>
              <h3 className="font-bold text-slate-900">{item.title}</h3>
              <p className="text-sm text-slate-500">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Security Banner */}
      <div className="bg-slate-900 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 text-center md:text-left">
          <h2 className="text-2xl font-bold">Your Security is Our Priority</h2>
          <p className="text-slate-400 max-w-md">We use industry-leading encryption and verified boarding owners to ensure your university life is safe.</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-300 font-medium">
              <CheckCircle2 size={16} className="text-emerald-500" /> Verified Owners
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300 font-medium">
              <CheckCircle2 size={16} className="text-emerald-500" /> Secure Payments
            </div>
          </div>
        </div>
        <div className="text-center md:text-right">
          <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Established Since</p>
          <p className="text-5xl font-bold">2021</p>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="py-16 border-t border-slate-100">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Support Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Frequently Asked Questions</p>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                We have 24/7 support available.
              </h2>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <a 
                href="https://wa.me/yournumber" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 rounded-xl border-2 border-emerald-500 text-emerald-600 font-bold hover:bg-emerald-50 transition-colors"
              >
                <MessageCircle size={20} className="fill-emerald-500 text-emerald-500" />
                Whatsapp Us
              </a>
              <a 
                href="tel:+442036956785"
                className="flex items-center gap-3 px-6 py-3 rounded-xl bg-[#F27D26] text-white font-bold hover:bg-[#d96a1a] transition-colors shadow-lg shadow-orange-200"
              >
                <Phone size={20} className="fill-white" />
                Call an Expert
              </a>
            </div>
          </div>

          {/* Right Column: Accordion */}
          <div className="lg:col-span-7 space-y-4">
            {[
              {
                q: "What types of accommodation are available for students",
                a: "At University Living, students can choose from a variety of accommodation options. These include studio rooms, ensuites, shared apartments and private apartments."
              },
              {
                q: "How to book student accommodation with University Living?",
                a: "Booking is simple! Browse our verified properties, select your preferred option, and click 'Book Now'. Our experts will guide you through the documentation and payment process."
              },
              {
                q: "Is there any deposit or booking fee?",
                a: "Deposit requirements vary by property. Most student accommodations require a security deposit which is refundable at the end of your stay, subject to property conditions."
              },
              {
                q: "Are the rooms and apartments provided by University Living verified?",
                a: "Yes, 100% of our properties are verified. We conduct physical inspections and background checks on all boarding owners to ensure your safety and comfort."
              },
              {
                q: "Does University Living Offer Group Bookings?",
                a: "Absolutely! We specialize in group bookings. If you and your friends want to stay together, just let our experts know and we'll find the perfect multi-room apartment for you."
              }
            ].map((item, i) => (
              <FAQItem key={i} question={item.q} answer={item.a} defaultOpen={i === 0} />
            ))}
          </div>
        </div>
      </section>
      </Container>
    </div>
  );
};

const FAQItem: React.FC<{ question: string; answer: string; defaultOpen?: boolean }> = ({ question, answer, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-slate-100 pb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <span className={cn(
          "text-lg font-semibold transition-colors",
          isOpen ? "text-blue-600" : "text-slate-800 group-hover:text-blue-600"
        )}>
          {question}
        </span>
        <ChevronRight 
          size={20} 
          className={cn(
            "text-slate-400 transition-transform duration-300",
            isOpen ? "rotate-90 text-blue-600" : ""
          )} 
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
            <p className="text-slate-600 leading-relaxed pb-4">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


import { Accommodation, BookingRequest } from '../types/accommodation';
import { Canteen, MenuItem, Order, OrderItem, OrderStatus } from '../types/canteen';
import { CanteenCard } from '../components/canteen/CanteenCard';
import { MenuItemCard } from '../components/canteen/MenuItemCard';
import { CartOverlay } from '../components/canteen/CartOverlay';
import { OrderFlow } from '../components/canteen/OrderFlow';
import { OrderStatusList } from '../components/canteen/OrderStatusList';
import { AccommodationCard } from '../components/accommodation/AccommodationCard';
import { FilterSidebar } from '../components/accommodation/FilterSidebar';
import { AccommodationDetails } from '../components/accommodation/AccommodationDetails';
import { BookingModal } from '../components/accommodation/BookingModal';
import axios from 'axios';

// --- Find Accommodation ---
export const FindAccommodation: React.FC = () => {
  const [view, setView] = useState<'list' | 'details'>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  const [search, setSearch] = useState('');
  const [university, setUniversity] = useState('');
  const [filters, setFilters] = useState({
    roomTypes: [] as string[],
    minPrice: 0,
    maxPrice: 100000,
    facilities: [] as string[]
  });

  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAccommodations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        location: search,
        university,
        roomType: filters.roomTypes.join(','),
        minPrice: filters.minPrice.toString(),
        maxPrice: filters.maxPrice.toString(),
        facilities: filters.facilities.join(',')
      });
      const res = await axios.get(`/api/accommodations?${params}`);
      setAccommodations(res.data);
    } catch (err) {
      console.error('Failed to fetch accommodations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccommodations();
  }, []);

  const handleBookingSubmit = async (request: BookingRequest) => {
    try {
      await axios.post('/api/bookings', request);
      console.log('Booking submitted successfully');
      // Show success message or redirect
    } catch (err) {
      console.error('Booking failed', err);
    }
  };

  const selectedAccommodation = accommodations.find(a => a.id === selectedId);

  return (
    <Container className="py-8 space-y-8">
      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Search Bar */}
            <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-2xl shadow-blue-600/20">
              <h1 className="text-3xl font-bold mb-6">Find Your Perfect Home Near Campus</h1>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-5 relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-200" size={20} />
                  <Input 
                    placeholder="Search by city or location..." 
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 h-14 pl-12 rounded-2xl focus:bg-white/20 transition-all"
                  />
                </div>
                <div className="md:col-span-4 relative">
                  <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-200" size={20} />
                  <select 
                    value={university}
                    onChange={e => setUniversity(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/10 border border-white/20 text-white focus:bg-white/20 transition-all outline-none appearance-none"
                  >
                    <option value="" className="text-slate-900">All Universities</option>
                    <option value="SLIIT" className="text-slate-900">SLIIT</option>
                    <option value="SAITM" className="text-slate-900">SAITM</option>
                    <option value="NSBM" className="text-slate-900">NSBM</option>
                    <option value="CINEC" className="text-slate-900">CINEC</option>
                  </select>
                </div>
                <div className="md:col-span-3">
                  <Button 
                    onClick={fetchAccommodations}
                    className="w-full h-14 bg-white text-blue-600 hover:bg-blue-50 border-none rounded-2xl font-bold text-lg shadow-lg"
                  >
                    Search Now
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Sidebar Filters */}
              <div className="lg:col-span-3">
                <FilterSidebar 
                  filters={filters} 
                  setFilters={setFilters} 
                  onClear={() => setFilters({ roomTypes: [], minPrice: 0, maxPrice: 100000, facilities: [] })}
                  onApply={fetchAccommodations}
                />
              </div>

              {/* Results Grid */}
              <div className="lg:col-span-9 space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-slate-500 font-medium">
                    Showing <span className="text-slate-900 font-bold">{accommodations.length}</span> results
                  </p>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-80 bg-slate-100 animate-pulse rounded-3xl" />
                    ))}
                  </div>
                ) : accommodations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {accommodations.map((acc) => (
                      <AccommodationCard 
                        key={acc.id} 
                        accommodation={acc} 
                        onClick={(id) => { setSelectedId(id); setView('details'); }} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 space-y-6 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-md text-slate-300">
                      <Search size={40} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-slate-900">No results found</h3>
                      <p className="text-slate-500 max-w-xs mx-auto">We couldn't find any accommodations matching your criteria. Try adjusting your filters.</p>
                    </div>
                    <Button variant="outline" onClick={() => setFilters({ roomTypes: [], minPrice: 0, maxPrice: 100000, facilities: [] })}>
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          selectedAccommodation && (
            <AccommodationDetails 
              accommodation={selectedAccommodation} 
              onBack={() => setView('list')}
              onBook={() => setIsBookingModalOpen(true)}
            />
          )
        )}
      </AnimatePresence>

      {selectedAccommodation && (
        <BookingModal 
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          accommodation={selectedAccommodation}
          onSubmit={handleBookingSubmit}
        />
      )}
    </Container>
  );
};

// --- Find Restaurants ---
export const FindRestaurants: React.FC = () => {
  const [view, setView] = useState<'canteens' | 'menu' | 'order' | 'status'>('canteens');
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [selectedCanteen, setSelectedCanteen] = useState<Canteen | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCanteens = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/canteens');
      setCanteens(res.data);
    } catch (err) {
      console.error('Failed to fetch canteens', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenu = async (canteenId: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/canteens/${canteenId}/menu`);
      setMenu(res.data);
    } catch (err) {
      console.error('Failed to fetch menu', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/orders?studentId=stud-123');
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    }
  };

  useEffect(() => {
    fetchCanteens();
    fetchOrders();
  }, []);

  const handleCanteenSelect = (id: string) => {
    const canteen = canteens.find(c => c.id === id);
    if (canteen) {
      setSelectedCanteen(canteen);
      fetchMenu(id);
      setView('menu');
    }
  };

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.menuItemId === item.id);
      if (existing) {
        return prev.map(i => i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { menuItemId: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.map(i => i.menuItemId === id ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => i.menuItemId === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i).filter(i => i.quantity > 0));
  };

  const handleOrderSubmit = async (orderData: Partial<Order>) => {
    try {
      await axios.post('/api/orders', orderData);
      setCart([]);
      fetchOrders();
      setView('status');
    } catch (err) {
      console.error('Failed to place order', err);
    }
  };

  return (
    <Container className="py-8 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
            Campus <span className="text-blue-600">Dining</span>
          </h1>
          <p className="text-slate-500 font-medium">Pre-order your favorite meals and skip the queue.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant={view === 'status' ? 'primary' : 'outline'} 
            onClick={() => setView('status')}
            className="rounded-xl font-bold"
          >
            My Orders
          </Button>
          <Button 
            onClick={() => setIsCartOpen(true)} 
            className="relative rounded-xl font-bold shadow-lg shadow-blue-600/20"
          >
            <ShoppingBag size={18} className="mr-2" />
            Cart
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white font-bold animate-bounce">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'canteens' && (
          <motion.div 
            key="canteens"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {canteens.map((canteen) => (
              <CanteenCard 
                key={canteen.id} 
                canteen={canteen} 
                onClick={handleCanteenSelect} 
              />
            ))}
          </motion.div>
        )}

        {view === 'menu' && selectedCanteen && (
          <motion.div 
            key="menu"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setView('canteens')}
                className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium transition-colors group"
              >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Back to Canteens
              </button>
              <h2 className="text-2xl font-bold text-slate-900">{selectedCanteen.name} Menu</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {menu.map((item) => (
                <MenuItemCard 
                  key={item.id} 
                  item={item} 
                  quantity={cart.find(i => i.menuItemId === item.id)?.quantity || 0}
                  onAdd={addToCart}
                  onRemove={removeFromCart}
                />
              ))}
            </div>
          </motion.div>
        )}

        {view === 'order' && selectedCanteen && (
          <OrderFlow 
            items={cart}
            canteenId={selectedCanteen.id}
            canteenName={selectedCanteen.name}
            onBack={() => setView('menu')}
            onSubmit={handleOrderSubmit}
          />
        )}

        {view === 'status' && (
          <motion.div
            key="status"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="mb-8">
              <button 
                onClick={() => setView('canteens')}
                className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium transition-colors group"
              >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Back to Canteens
              </button>
            </div>
            <OrderStatusList orders={orders} onRefresh={fetchOrders} />
          </motion.div>
        )}
      </AnimatePresence>

      <CartOverlay 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={updateQuantity}
        onProceed={() => { setIsCartOpen(false); setView('order'); }}
      />
    </Container>
  );
};

// --- My Bookings ---
export const MyBookings: React.FC = () => {
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
    <Container className="space-y-8 py-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Accommodation Bookings</h1>
        <p className="text-slate-500">Track your housing requests and payment status</p>
      </div>

      <div className="space-y-4">
        {[1, 2].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex flex-col md:flex-row gap-6">
              <img src={`https://picsum.photos/seed/room${i}/200/200`} className="w-full md:w-40 h-40 object-cover rounded-lg" referrerPolicy="no-referrer" />
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Premium Student Suite</h3>
                    <p className="text-sm text-slate-500">123 University Ave, Malabe</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    i === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {i === 0 ? 'Confirmed' : 'Pending'}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500">Rent</p>
                    <p className="font-bold">Rs. 25,000</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Move-in</p>
                    <p className="font-bold">April 1, 2026</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Status</p>
                    <p className="font-bold">{i === 0 ? 'Paid' : 'Unpaid'}</p>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">View Details</Button>
                  {i !== 0 && (
                    <Button size="sm" onClick={() => { setSelectedBooking(i); setIsUploadModalOpen(true); }}>
                      Upload Receipt
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal 
        isOpen={isUploadModalOpen} 
        onClose={() => { setIsUploadModalOpen(false); setPreviewImage(null); }} 
        title="Upload Payment Proof"
        footer={
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => { setIsUploadModalOpen(false); setPreviewImage(null); }}>Cancel</Button>
            <Button disabled={!previewImage} className="rounded-lg" onClick={() => setIsUploadModalOpen(false)}>Confirm Upload</Button>
          </div>
        }
      >
        <div className="space-y-6">
          <p className="text-sm text-slate-500">Please upload a clear screenshot or photo of your bank transfer receipt.</p>
          
          <div className="relative aspect-video rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center overflow-hidden group">
            {previewImage ? (
              <>
                <img src={previewImage} className="w-full h-full object-contain" />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button variant="secondary" size="sm" onClick={() => setPreviewImage(null)}>Change Image</Button>
                </div>
              </>
            ) : (
              <>
                <Upload size={32} className="text-slate-300 mb-2" />
                <p className="text-sm font-medium text-slate-500">Click to select or drag and drop</p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </>
            )}
          </div>
        </div>
      </Modal>
    </Container>
  );
};

// --- Student Requests ---
export const StudentRequests: React.FC = () => {
  const [requests] = useState([
    { id: 1, type: 'Maintenance', subject: 'Broken tap in bathroom', status: 'Pending', date: '2026-03-15' },
    { id: 2, type: 'General', subject: 'Inquiry about meal plan', status: 'Resolved', date: '2026-03-10' },
  ]);

  return (
    <Container className="py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Requests</h1>
          <p className="text-slate-500">Track your support and maintenance requests.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={18} /> New Request
        </Button>
      </div>

      <div className="grid gap-4">
        {requests.map((req) => (
          <Card key={req.id} className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{req.subject}</h3>
                  <p className="text-sm text-slate-500">{req.type} • {req.date}</p>
                </div>
              </div>
              <div className={cn(
                "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                req.status === 'Pending' ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
              )}>
                {req.status}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Container>
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
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders', err);
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
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <Container className="py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Canteen Dashboard</h1>
          <p className="text-slate-500 font-medium">Manage incoming orders and update their status.</p>
        </div>
        <Button onClick={fetchOrders} variant="outline" size="sm" className="rounded-xl">
          <RefreshCw size={16} className={cn("mr-2", loading && "animate-spin")} />
          Refresh Orders
        </Button>
      </div>

      <div className="grid gap-6">
        {orders.length === 0 ? (
          <Card className="p-12 text-center text-slate-500">
            No orders found for your canteen.
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="p-6 border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Order #{order.id.slice(-4).toUpperCase()}</p>
                        <p className="text-xs text-slate-500">Pickup: {order.pickupTime}</p>
                      </div>
                    </div>
                    <Badge variant={
                      order.status === 'Pending' ? 'warning' :
                      order.status === 'Preparing' ? 'info' :
                      order.status === 'Ready' ? 'success' : 'secondary'
                    }>
                      {order.status}
                    </Badge>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-slate-600">{item.quantity}x {item.name}</span>
                        <span className="font-bold text-slate-900">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-slate-200 mt-2 flex justify-between font-bold text-slate-900">
                      <span>Total</span>
                      <span>Rs. {order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {order.notes && (
                    <div className="text-sm text-slate-500 italic bg-amber-50 p-3 rounded-lg border border-amber-100">
                      Note: {order.notes}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 md:w-48">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Update Status</p>
                  <Button 
                    size="sm" 
                    variant={order.status === 'Preparing' ? 'primary' : 'outline'}
                    onClick={() => updateStatus(order.id, 'Preparing')}
                    disabled={order.status === 'Preparing' || order.status === 'Ready' || order.status === 'Collected'}
                    className="rounded-lg text-xs"
                  >
                    Start Preparing
                  </Button>
                  <Button 
                    size="sm" 
                    variant={order.status === 'Ready' ? 'primary' : 'outline'}
                    onClick={() => updateStatus(order.id, 'Ready')}
                    disabled={order.status === 'Ready' || order.status === 'Collected'}
                    className="rounded-lg text-xs"
                  >
                    Mark as Ready
                  </Button>
                  <Button 
                    size="sm" 
                    variant={order.status === 'Collected' ? 'primary' : 'outline'}
                    onClick={() => updateStatus(order.id, 'Collected')}
                    disabled={order.status === 'Collected'}
                    className="rounded-lg text-xs"
                  >
                    Mark as Collected
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </Container>
  );
};
