import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingBag, ArrowLeft, Search, Filter, ChevronRight, Star, MapPin, Clock, Plus, History, CheckCircle2, ChefHat, Package, RefreshCw } from 'lucide-react';
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
import { restaurantService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const MealsDashboard: React.FC = () => {
  const { user } = useAuth();
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState('All');
  const [selectedCafe, setSelectedCafe] = useState<Canteen | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [view, setView] = useState<'dashboard' | 'menu' | 'checkout' | 'confirmation' | 'my-orders' | 'countdown'>('dashboard');
  const [pendingOrderData, setPendingOrderData] = useState<any>(null);
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
      const res = await restaurantService.getAllCanteens();
      const data = Array.isArray(res.data) ? res.data : [];
      const mapped = data.map((item: any) => ({
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
      const res = await restaurantService.getMenu(canteenId);
      const data = Array.isArray(res.data) ? res.data : [];
      const mapped = data.map((item: any) => ({
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

  const handlePlaceOrder = (formData: any) => {
    if (!selectedCafe) return;

    const pickupDate = new Date();
    pickupDate.setMinutes(pickupDate.getMinutes() + 20);

    const orderData = {
      studentId: user?.id || 'guest',
      studentName: formData.fullName,
      studentUniversity: formData.university,
      studentYear: formData.year,
      studentIdNumber: formData.idNumber,
      studentPhone: formData.phone,
      identityProof: formData.identityProof || null,
      canteenId: selectedCafe.id,
      canteenName: selectedCafe.name,
      items: cart,
      totalPrice: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      pickupTime: pickupDate.toISOString(),
      notes: formData.notes || '',
      status: 'Pending',
    };

    // Store & show 6-second cancel window instead of immediately placing
    setPendingOrderData(orderData);
    setView('countdown');
  };

  const handleConfirmOrder = async () => {
    if (!pendingOrderData) return;
    try {
      const res = await restaurantService.placeOrder(pendingOrderData);
      setLastOrder({ ...res.data, id: res.data._id });
      setCart([]);
      setPendingOrderData(null);
      setView('confirmation');
    } catch (err) {
      console.error('Error placing order:', err);
      alert('Failed to place order. Please try again.');
      setView('checkout');
    }
  };

  const handleCancelCountdown = () => {
    setPendingOrderData(null);
    setView('checkout');
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // ── My Orders View ─────────────────────────────────────────────
  if (view === 'my-orders') {
    return <MyOrdersView onBack={() => setView('dashboard')} studentId={user?.id || ''} />;
  }

  // ── 6-Second Countdown Cancel Window ───────────────────────────
  if (view === 'countdown' && pendingOrderData && selectedCafe) {
    return (
      <OrderCountdownOverlay
        orderData={pendingOrderData}
        canteenName={selectedCafe.name}
        onConfirm={handleConfirmOrder}
        onCancel={handleCancelCountdown}
      />
    );
  }

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
              
              <div className="flex items-center gap-3">
                <div className="relative flex-1 min-w-[200px] md:w-80">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-ink/20" size={20} />
                  <input 
                    type="text"
                    placeholder="Search for cafes or food..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full h-16 pl-16 pr-6 rounded-full bg-white border border-black/5 text-ink font-medium text-sm focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all outline-none shadow-sm"
                  />
                </div>
                <button
                  onClick={() => setView('my-orders')}
                  className="h-16 px-6 flex items-center gap-2 rounded-full bg-ink text-white font-bold uppercase tracking-widest text-[10px] shadow-xl hover:bg-gold transition-all duration-300 whitespace-nowrap shrink-0"
                >
                  <History size={16} />
                  My Orders
                </button>
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


// ─── My Orders View ─────────────────────────────────────────────────
interface MyOrdersViewProps {
  onBack: () => void;
  studentId: string;
}

const STATUS_STEPS = ['Pending', 'Preparing', 'Ready', 'Collected'];

const statusConfig: Record<string, { color: string; bg: string; label: string; icon: React.ReactNode }> = {
  Pending:   { color: 'text-amber-600',   bg: 'bg-amber-50   border-amber-100',   label: 'Pending Review',  icon: <Clock size={14} /> },
  Preparing: { color: 'text-blue-600',    bg: 'bg-blue-50    border-blue-100',    label: 'Preparing',       icon: <ChefHat size={14} /> },
  Ready:     { color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100', label: 'Ready to Pick Up', icon: <Package size={14} /> },
  Collected: { color: 'text-ink/40',      bg: 'bg-paper      border-black/5',     label: 'Collected',        icon: <CheckCircle2 size={14} /> },
};

const MyOrdersView: React.FC<MyOrdersViewProps> = ({ onBack, studentId }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (studentId) fetchOrders();
  }, [studentId]);

  const fetchOrders = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await restaurantService.getOrdersByStudent(studentId);
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const activeOrders = orders.filter(o => o.status !== 'Collected');
  const pastOrders   = orders.filter(o => o.status === 'Collected');

  return (
    <div className="min-h-screen bg-paper/30 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-black/5 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-3 text-ink/40 hover:text-ink transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-paper flex items-center justify-center group-hover:bg-ink group-hover:text-white transition-all">
              <ArrowLeft size={20} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest">Back to Cafes</span>
          </button>
          <h1 className="text-2xl font-serif text-ink">My Orders</h1>
          <button
            onClick={() => fetchOrders(true)}
            className={`w-10 h-10 rounded-full bg-paper flex items-center justify-center text-ink/40 hover:text-ink hover:bg-gold/20 transition-all ${refreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">
        {loading ? (
          <div className="space-y-6">
            {[1, 2].map(i => (
              <div key={i} className="h-48 bg-white rounded-[2.5rem] animate-pulse border border-black/5" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-black/5 shadow-xl">
            <ShoppingBag size={52} className="text-ink/15 mx-auto mb-6" />
            <h2 className="text-2xl font-serif text-ink mb-2">No orders yet</h2>
            <p className="text-ink/40 text-sm">Head back to the cafes and place your first order!</p>
            <button
              onClick={onBack}
              className="mt-8 px-10 py-4 bg-ink text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-gold transition-all duration-300"
            >
              Browse Cafes
            </button>
          </div>
        ) : (
          <>
            {/* Active Orders */}
            {activeOrders.length > 0 && (
              <section className="space-y-8">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <h2 className="text-2xl font-serif text-ink">Active Orders</h2>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest border border-emerald-100">{activeOrders.length}</span>
                </div>
                <div className="space-y-6">
                  {activeOrders.map(order => (
                    <OrderCard key={order._id || order.id} order={order} />
                  ))}
                </div>
              </section>
            )}

            {/* Past Orders */}
            {pastOrders.length > 0 && (
              <section className="space-y-8">
                <h2 className="text-2xl font-serif text-ink/50">Past Orders</h2>
                <div className="space-y-6">
                  {pastOrders.map(order => (
                    <OrderCard key={order._id || order.id} order={order} isPast />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// ─── Individual Order Card ───────────────────────────────────────────
const OrderCard: React.FC<{ order: any; isPast?: boolean }> = ({ order, isPast = false }) => {
  const currentStepIdx = STATUS_STEPS.indexOf(order.status);
  const cfg = statusConfig[order.status] || statusConfig['Pending'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-[2.5rem] border border-black/5 overflow-hidden shadow-xl transition-all duration-700 ${isPast ? 'opacity-70' : ''}`}
    >
      {/* Order Header */}
      <div className="px-10 py-8 flex items-center justify-between border-b border-black/5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30">Order</p>
          <h3 className="text-xl font-bold text-ink mt-1">#{(order._id || order.id)?.slice(-6).toUpperCase()}</h3>
          <p className="text-xs text-ink/40 font-medium mt-1">{order.canteenName}</p>
        </div>
        <div className="text-right">
          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border ${cfg.bg} ${cfg.color}`}>
            {cfg.icon}
            {cfg.label}
          </span>
          <p className="text-xs text-ink/30 font-medium mt-2">
            {order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}
          </p>
        </div>
      </div>

      {/* Progress Timeline */}
      {!isPast && (
        <div className="px-10 py-8 border-b border-black/5">
          <div className="flex items-center justify-between relative">
            {/* Progress line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-black/5" />
            <div
              className="absolute top-5 left-0 h-0.5 bg-emerald-400 transition-all duration-700"
              style={{ width: `${(currentStepIdx / (STATUS_STEPS.length - 1)) * 100}%` }}
            />
            {STATUS_STEPS.map((step, idx) => {
              const done = idx <= currentStepIdx;
              const active = idx === currentStepIdx;
              const stepCfg = statusConfig[step];
              return (
                <div key={step} className="relative flex flex-col items-center gap-2 z-10">
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                    done
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200'
                      : 'bg-white border-black/10 text-ink/20'
                  } ${active ? 'scale-110 ring-4 ring-emerald-100' : ''}`}>
                    {done ? <CheckCircle2 size={16} /> : stepCfg.icon}
                  </div>
                  <p className={`text-[9px] font-bold uppercase tracking-widest whitespace-nowrap ${done ? 'text-ink' : 'text-ink/25'}`}>
                    {step === 'Pending' ? 'Received' : step === 'Preparing' ? 'Preparing' : step === 'Ready' ? 'Ready' : 'Collected'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Order Items */}
      <div className="px-10 py-8 space-y-6">
        <div className="space-y-3">
          {order.items?.map((item: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-paper text-ink text-[10px] font-bold flex items-center justify-center border border-black/5">
                  {item.quantity}
                </span>
                <span className="text-sm font-medium text-ink">{item.name}</span>
              </div>
              <span className="text-sm font-bold text-ink">Rs. {item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-6 border-t border-black/5">
          <div className="text-[10px] font-bold uppercase tracking-widest text-ink/30">Total Amount</div>
          <div className="text-2xl font-serif text-gold font-bold">Rs. {order.totalPrice}</div>
        </div>
      </div>

      {/* Status Message */}
      {!isPast && (
        <div className={`px-10 py-5 ${order.status === 'Ready' ? 'bg-emerald-50' : 'bg-paper/50'}`}>
          <p className={`text-xs font-bold uppercase tracking-widest ${order.status === 'Ready' ? 'text-emerald-600' : 'text-ink/30'}`}>
            {order.status === 'Pending'   && '🕐 Your order has been received. Waiting for cafe to accept…'}
            {order.status === 'Preparing' && '👨‍🍳 The cafe is preparing your order right now!'}
            {order.status === 'Ready'     && '🎉 Your order is ready! Head to the counter to collect it.'}
          </p>
        </div>
      )}

      {isPast && (
        <div className="px-10 py-5 bg-paper/30">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink/25">✓ Collected — Thank you for ordering!</p>
        </div>
      )}
    </motion.div>
  );
};


// ─── Order Countdown Overlay ─────────────────────────────────────────
interface OrderCountdownOverlayProps {
  orderData: any;
  canteenName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const COUNTDOWN_SECONDS = 6;

const OrderCountdownOverlay: React.FC<OrderCountdownOverlayProps> = ({
  orderData,
  canteenName,
  onConfirm,
  onCancel,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (confirmed) return;
    if (secondsLeft === 0) {
      setConfirmed(true);
      onConfirm();
      return;
    }
    const timer = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, confirmed]);

  const handleSkip = () => {
    if (confirmed) return;
    setConfirmed(true);
    onConfirm();
  };

  const handleCancel = () => {
    setConfirmed(true);
    onCancel();
  };

  const circumference = 2 * Math.PI * 44;
  const dashOffset = circumference - (circumference * ((COUNTDOWN_SECONDS - secondsLeft) / COUNTDOWN_SECONDS));

  return (
    <div className="min-h-screen bg-ink/95 backdrop-blur-xl flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="w-full max-w-lg"
      >
        <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl">

          {/* Gold header strip */}
          <div className="bg-gold px-10 py-6 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-ink/50">Order Placed</p>
              <h2 className="text-xl font-serif text-ink mt-0.5">{canteenName}</h2>
            </div>
            <ShoppingBag size={28} className="text-ink/30" />
          </div>

          <div className="px-10 py-10 space-y-10">

            {/* Animated countdown ring */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-28 h-28">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="44" fill="none" stroke="#f0ede8" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="44"
                    fill="none"
                    stroke={secondsLeft <= 2 ? '#ef4444' : '#c9a96e'}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={secondsLeft}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.4 }}
                      transition={{ duration: 0.2 }}
                      className={`text-4xl font-bold font-serif ${secondsLeft <= 2 ? 'text-red-500' : 'text-ink'}`}
                    >
                      {secondsLeft}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>

              <div className="text-center space-y-1">
                <p className="text-sm font-bold text-ink">Confirming your order…</p>
                <p className="text-[10px] text-ink/40 font-bold uppercase tracking-widest">
                  Order will be placed in{' '}
                  <span className={secondsLeft <= 2 ? 'text-red-500' : 'text-gold'}>{secondsLeft}s</span>
                </p>
              </div>
            </div>

            {/* Order summary */}
            <div className="bg-paper/60 rounded-[2rem] p-6 border border-black/5 space-y-3">
              {orderData.items?.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-ink/60 font-medium">{item.quantity}× {item.name}</span>
                  <span className="font-bold text-ink">Rs. {item.price * item.quantity}</span>
                </div>
              ))}
              <div className="flex justify-between pt-3 border-t border-black/5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-ink/30">Total</span>
                <span className="font-bold text-gold text-base">Rs. {orderData.totalPrice}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleCancel}
                className="flex-1 flex flex-col items-center justify-center gap-1.5 py-5 rounded-2xl border-2 border-red-100 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-200 transition-all"
              >
                <span className="text-xl font-bold">✕</span>
                <span className="text-[9px] font-bold uppercase tracking-widest">Cancel Order</span>
                <span className="text-[8px] text-red-400 font-medium">Return to checkout</span>
              </button>

              <button
                onClick={handleSkip}
                className="flex-1 flex flex-col items-center justify-center gap-1.5 py-5 rounded-2xl bg-ink text-white hover:bg-gold transition-all group"
              >
                <ChevronRight size={22} className="transition-transform group-hover:translate-x-1" />
                <span className="text-[9px] font-bold uppercase tracking-widest">Place Now</span>
                <span className="text-[8px] text-white/40 font-medium">Skip the countdown</span>
              </button>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};
