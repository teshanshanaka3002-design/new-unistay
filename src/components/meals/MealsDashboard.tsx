import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { ShoppingBag, ArrowLeft, Search, Filter, ChevronRight, Star, MapPin, Clock, MessageSquare, Plus } from 'lucide-react';
import { Canteen, MenuItem, OrderItem, Order } from '../../types/canteen';
import { UniversityFilterBar } from './UniversityFilterBar';
import { CafeCard } from './CafeCard';
import { FoodItemCard } from './FoodItemCard';
import { CartSidebar } from './CartSidebar';
import { CheckoutPage } from './CheckoutPage';
import { OrderConfirmation } from './OrderConfirmation';
import { motion, AnimatePresence } from 'motion/react';
import { Badge, Button } from '../UI';
import { RatingSummary } from '../reviews/RatingSummary';
import { ReviewList } from '../reviews/ReviewList';
import { ReviewModal } from '../reviews/ReviewModal';
import { cn } from '../../lib/utils';

export const MealsDashboard: React.FC = () => {
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState('All');
  const [selectedCafe, setSelectedCafe] = useState<Canteen | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [view, setView] = useState<'dashboard' | 'menu' | 'checkout' | 'confirmation'>('dashboard');
  const [loading, setLoading] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState<'menu' | 'reviews'>('menu');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Mock reviews for canteens
  const mockReviews = [
    { id: '1', userName: 'Amara Silva', rating: 5, comment: 'The best rice and curry in SLIIT! Always fresh and hot.', date: '2 days ago', university: 'SLIIT', isVerified: true },
    { id: '2', userName: 'Kasun Perera', rating: 4, comment: 'Good food but the queue is sometimes too long. Ordering ahead helps!', date: '1 week ago', university: 'SLIIT', isVerified: true },
    { id: '3', userName: 'Nimali Fernando', rating: 5, comment: 'Affordable and delicious. Highly recommend the chicken kottu.', date: '3 days ago', university: 'NSBM', isVerified: true },
    { id: '4', userName: 'Saman Kumara', rating: 3, comment: 'Average taste, but very convenient location.', date: '2 weeks ago', university: 'IIT', isVerified: false },
  ];

  useEffect(() => {
    fetchCanteens();
  }, []);

  const fetchCanteens = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/canteens');
      const mapped = (Array.isArray(res.data) ? res.data : []).map((item: any) => ({
        ...item,
        id: item._id || item.id || `cant-${Math.random()}`
      }));
      setCanteens(mapped);
    } catch (err) {
      console.error('Error fetching canteens:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenu = async (canteenId: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/canteens/${canteenId}/menu`);
      const mapped = (Array.isArray(res.data) ? res.data : []).map((item: any) => ({
        ...item,
        id: item._id || item.id || `menu-${Math.random()}`
      }));
      setMenu(mapped);
    } catch (err) {
      console.error('Error fetching menu:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCanteens = useMemo(() => {
    return canteens.filter(c => 
      (selectedUniversity === 'All' || c.university === selectedUniversity) &&
      (c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
       c.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [canteens, selectedUniversity, searchQuery]);

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(menu.map(m => m.category))];
    return cats;
  }, [menu]);

  const filteredMenu = useMemo(() => {
    return menu.filter(m => 
      (selectedCategory === 'All' || m.category === selectedCategory) &&
      (m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
       m.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [menu, selectedCategory, searchQuery]);

  const handleViewMenu = (cafe: Canteen) => {
    setSelectedCafe(cafe);
    fetchMenu(cafe.id);
    setView('menu');
    setActiveTab('menu');
    setSearchQuery('');
    setSelectedCategory('All');
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

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => 
      i.menuItemId === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i
    ).filter(i => i.quantity > 0));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.menuItemId !== id));
  };

  const handlePlaceOrder = async (formData: any) => {
    if (!selectedCafe) return;
    
    const orderData = {
      studentId: 'stud-123', // Mock student ID
      studentName: formData.fullName,
      studentUniversity: formData.university,
      studentYear: formData.year,
      studentIdNumber: formData.idNumber,
      studentPhone: formData.phone,
      canteenId: selectedCafe.id,
      canteenName: selectedCafe.name,
      items: cart,
      totalPrice: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      pickupTime: '15-20 mins',
      notes: formData.notes,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    try {
      const res = await axios.post('/api/orders', orderData);
      setLastOrder({ ...res.data, id: res.data._id });
      setCart([]);
      setView('confirmation');
    } catch (err) {
      console.error('Error placing order:', err);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (view === 'checkout' && selectedCafe) {
    return (
      <CheckoutPage 
        items={cart}
        canteen={selectedCafe}
        onBack={() => setView('menu')}
        onPlaceOrder={handlePlaceOrder}
        defaultUniversity={selectedUniversity !== 'All' ? selectedUniversity : ''}
      />
    );
  }

  if (view === 'confirmation' && lastOrder && selectedCafe) {
    return (
      <OrderConfirmation 
        order={lastOrder}
        canteen={selectedCafe}
        onDone={() => {
          setView('dashboard');
          setSelectedCafe(null);
          setLastOrder(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-paper/30 pb-20">
      {/* Review Modal */}
      <ReviewModal 
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={(review) => {
          console.log('New Cafe Review:', review);
        }}
        title={`Rate ${selectedCafe?.name}`}
        categories={['Food Quality', 'Service Speed', 'Cleanliness', 'Value for Money']}
      />

      {/* Sticky Cart Button */}
      {cart.length > 0 && view !== 'checkout' && view !== 'confirmation' && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-8 right-8 z-40 bg-ink text-white p-6 rounded-full shadow-2xl shadow-ink/40 flex items-center gap-4 group"
        >
          <div className="relative">
            <ShoppingBag size={24} />
            <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gold text-ink text-[10px] font-bold flex items-center justify-center border-2 border-ink">
              {cartCount}
            </span>
          </div>
          <div className="text-left">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Your Cart</p>
            <p className="text-sm font-bold">Rs. {cartTotal}</p>
          </div>
          <ChevronRight size={20} className="text-gold transition-transform group-hover:translate-x-1" />
        </motion.button>
      )}

      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={() => {
          setIsCartOpen(false);
          setView('checkout');
        }}
      />

      {view === 'dashboard' ? (
        <>
          <UniversityFilterBar 
            selectedUniversity={selectedUniversity}
            onUniversityChange={setSelectedUniversity}
          />

          <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4">
                <h1 className="text-5xl font-serif text-ink tracking-tight">Meals Dashboard</h1>
                <p className="text-ink/40 text-lg max-w-xl leading-relaxed">
                  Discover the best cafes and canteens across campus. Order ahead and skip the queue.
                </p>
              </div>
              
              <div className="relative w-full md:w-96">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-ink/20" size={20} />
                <input 
                  type="text"
                  placeholder="Search for cafes or food..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full h-16 pl-16 pr-6 rounded-full bg-white border border-black/5 text-ink font-medium text-sm focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all outline-none shadow-sm"
                />
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="aspect-[16/10] bg-paper animate-pulse rounded-[2rem]" />
                ))}
              </div>
            ) : filteredCanteens.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCanteens.map((cafe) => (
                  <CafeCard key={cafe.id} cafe={cafe} onViewMenu={handleViewMenu} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center space-y-6">
                <div className="w-24 h-24 rounded-full bg-paper flex items-center justify-center text-ink/20 mx-auto">
                  <Search size={48} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif text-ink">No cafes found</h3>
                  <p className="text-ink/40 text-sm">Try adjusting your search or university filter.</p>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Menu View */}
          <div className="bg-white border-b border-black/5 sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
              <button 
                onClick={() => setView('dashboard')}
                className="flex items-center gap-3 text-ink/40 hover:text-ink transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-paper flex items-center justify-center group-hover:bg-ink group-hover:text-white transition-all">
                  <ArrowLeft size={20} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">Back to Cafes</span>
              </button>
              
              <div className="flex items-center gap-4">
                <div className="text-right hidden md:block">
                  <h2 className="text-xl font-serif text-ink">{selectedCafe?.name}</h2>
                  <div className="flex items-center justify-end gap-2 text-ink/40 text-[10px] font-bold uppercase tracking-widest">
                    <MapPin size={12} className="text-gold" />
                    {selectedCafe?.location}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg">
                  <img src={selectedCafe?.image} alt="" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
            {/* Cafe Header Info */}
            <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge className="bg-gold/10 text-gold border-none font-bold uppercase text-[10px] tracking-widest px-4 py-1.5 rounded-full">Open Now</Badge>
                  <div className="flex items-center gap-1 text-ink/40 text-[10px] font-bold uppercase tracking-widest">
                    <Star size={14} className="text-gold fill-gold" />
                    {selectedCafe?.rating} (120+ ratings)
                  </div>
                </div>
                <h1 className="text-5xl font-serif text-ink tracking-tight">{selectedCafe?.name}</h1>
                <p className="text-ink/40 text-lg max-w-2xl leading-relaxed">
                  {selectedCafe?.description}
                </p>
              </div>
              
              <div className="flex gap-4">
                <div className="p-6 rounded-[2rem] bg-white border border-black/5 flex items-center gap-4 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-paper flex items-center justify-center text-gold">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-ink/30 uppercase tracking-widest">Est. Pickup</p>
                    <p className="text-sm font-bold text-ink">15-20 Mins</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-8 border-b border-black/5">
              <button
                onClick={() => setActiveTab('menu')}
                className={cn(
                  "pb-4 text-[10px] font-bold uppercase tracking-widest transition-all relative",
                  activeTab === 'menu' ? "text-ink" : "text-ink/30 hover:text-ink/60"
                )}
              >
                Menu
                {activeTab === 'menu' && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={cn(
                  "pb-4 text-[10px] font-bold uppercase tracking-widest transition-all relative flex items-center gap-2",
                  activeTab === 'reviews' ? "text-ink" : "text-ink/30 hover:text-ink/60"
                )}
              >
                Reviews
                <span className="px-1.5 py-0.5 rounded-full bg-paper text-[8px]">{mockReviews.length}</span>
                {activeTab === 'reviews' && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
                )}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'menu' ? (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-12"
                >
                  {/* Category Filter */}
                  <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide pb-2">
                    <div className="flex items-center gap-2 text-ink/40 mr-4 shrink-0">
                      <Filter size={18} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Categories</span>
                    </div>
                    <div className="flex gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border shrink-0 ${
                            selectedCategory === cat
                              ? 'bg-ink text-white border-ink'
                              : 'bg-white text-ink/60 border-black/5 hover:border-ink/20'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Menu Grid */}
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="aspect-[4/3] bg-paper animate-pulse rounded-[2rem]" />
                      ))}
                    </div>
                  ) : filteredMenu.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                      {filteredMenu.map((item) => (
                        <FoodItemCard 
                          key={item.id} 
                          item={item} 
                          quantity={cart.find(i => i.menuItemId === item.id)?.quantity || 0}
                          onAddToCart={addToCart}
                          onRemoveFromCart={(id) => updateQuantity(id, -1)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center space-y-6">
                      <div className="w-24 h-24 rounded-full bg-paper flex items-center justify-center text-ink/20 mx-auto">
                        <Search size={48} />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-serif text-ink">No items found</h3>
                        <p className="text-ink/40 text-sm">Try selecting a different category.</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-16"
                >
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-2">
                      <h2 className="text-4xl font-serif text-ink leading-tight">Cafe Reviews</h2>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-ink/30">What students are saying about {selectedCafe?.name}</p>
                    </div>
                    <Button 
                      onClick={() => setIsReviewModalOpen(true)}
                      className="h-14 px-8 rounded-full bg-ink text-gold text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-ink/10"
                    >
                      <Plus size={16} />
                      Rate This Cafe
                    </Button>
                  </div>

                  {/* Rating Summary */}
                  <RatingSummary 
                    averageRating={selectedCafe?.rating || 0}
                    totalReviews={mockReviews.length}
                    breakdown={{ 5: 2, 4: 1, 3: 1, 2: 0, 1: 0 }}
                    className="p-12 rounded-[3rem] bg-paper/20 border border-black/5"
                  />

                  {/* Review List */}
                  <ReviewList reviews={mockReviews} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
};
