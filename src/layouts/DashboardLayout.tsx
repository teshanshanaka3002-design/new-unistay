import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Home, 
  Utensils, 
  BookOpen, 
  ShoppingBag, 
  Star, 
  MessageSquare, 
  User, 
  LogOut, 
  Menu, 
  X, 
  PlusCircle, 
  Settings, 
  Users, 
  CheckCircle, 
  BarChart3,
  CreditCard,
  GraduationCap
} from 'lucide-react';
import { useAuth, Role } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: Role[];
}

const navItems: NavItem[] = [
  // Student
  { label: 'Dashboard', path: '/dashboard/student', icon: <LayoutDashboard size={20} />, roles: ['STUDENT'] },
  { label: 'Accommodation', path: '/student/find-accommodation', icon: <Home size={20} />, roles: ['STUDENT'] },
  { label: 'Meals', path: '/student/find-restaurants', icon: <Utensils size={20} />, roles: ['STUDENT'] },
  { label: 'My bookings', path: '/student/my-bookings', icon: <BookOpen size={20} />, roles: ['STUDENT'] },
  { label: 'Requests', path: '/student/requests', icon: <MessageSquare size={20} />, roles: ['STUDENT'] },
  { label: 'Profile', path: '/profile', icon: <User size={20} />, roles: ['STUDENT'] },

  // Boarding Owner
  { label: 'Dashboard', path: '/owner-dashboard', icon: <LayoutDashboard size={20} />, roles: ['BOARDING_OWNER'] },
  { label: 'My Listings', path: '/owner/listings', icon: <Home size={20} />, roles: ['BOARDING_OWNER'] },
  { label: 'Add New Listing', path: '/owner/add-listing', icon: <PlusCircle size={20} />, roles: ['BOARDING_OWNER'] },
  { label: 'Bookings', path: '/owner/bookings', icon: <BookOpen size={20} />, roles: ['BOARDING_OWNER'] },
  { label: 'Student Requests', path: '/owner/student-requests', icon: <MessageSquare size={20} />, roles: ['BOARDING_OWNER'] },
  { label: 'Reviews & Ratings', path: '/owner/reviews', icon: <Star size={20} />, roles: ['BOARDING_OWNER'] },
  { label: 'Profile', path: '/owner/profile', icon: <User size={20} />, roles: ['BOARDING_OWNER'] },

  // Restaurant Owner
  { label: 'Dashboard', path: '/restaurant-dashboard', icon: <LayoutDashboard size={20} />, roles: ['RESTAURANT_OWNER'] },
  { label: 'My Restaurant', path: '/restaurant/my-restaurant', icon: <Home size={20} />, roles: ['RESTAURANT_OWNER'] },
  { label: 'Menu Management', path: '/restaurant/menu', icon: <Utensils size={20} />, roles: ['RESTAURANT_OWNER'] },
  { label: 'Orders', path: '/restaurant/orders', icon: <ShoppingBag size={20} />, roles: ['RESTAURANT_OWNER'] },
  { label: 'Reviews & Ratings', path: '/restaurant/reviews', icon: <Star size={20} />, roles: ['RESTAURANT_OWNER'] },
  { label: 'Profile', path: '/restaurant/profile', icon: <User size={20} />, roles: ['RESTAURANT_OWNER'] },

  // Admin
  { label: 'Dashboard', path: '/dashboard/admin', icon: <LayoutDashboard size={20} />, roles: ['ADMIN'] },
  { label: 'Users Management', path: '/admin/users', icon: <Users size={20} />, roles: ['ADMIN'] },
  { label: 'Boarding Approvals', path: '/admin/boarding-approvals', icon: <CheckCircle size={20} />, roles: ['ADMIN'] },
  { label: 'Restaurant Approvals', path: '/admin/restaurant-approvals', icon: <CheckCircle size={20} />, roles: ['ADMIN'] },
  { label: 'Payment Verification', path: '/admin/payments', icon: <CreditCard size={20} />, roles: ['ADMIN'] },
  { label: 'Reviews Management', path: '/admin/reviews', icon: <Star size={20} />, roles: ['ADMIN'] },
  { label: 'System Statistics', path: '/admin/statistics', icon: <BarChart3 size={20} />, roles: ['ADMIN'] },
  { label: 'Profile', path: '/profile', icon: <User size={20} />, roles: ['ADMIN'] },
];

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredNavItems = navItems.filter(item => user && item.roles.includes(user.role));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col selection:bg-gold/30">
      {/* Navbar */}
      <header className="bg-paper/80 backdrop-blur-md sticky top-0 z-40 h-20 flex items-center px-6 md:px-12 justify-between border-b border-black/5">
        <div className="flex items-center gap-12">
          <Link 
            to="/" 
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 bg-ink rounded-full flex items-center justify-center text-white transition-transform duration-500 group-hover:rotate-[360deg]">
              <span className="font-serif text-xl font-bold">S</span>
            </div>
            <span className="font-serif text-2xl font-bold text-ink tracking-tight">StudentNest</span>
          </Link>

          {/* Student Top Navigation */}
          {user?.role === 'STUDENT' && (
            <nav className="hidden lg:flex items-center gap-10">
              <Link to="/dashboard/student" className={cn(
                "text-sm font-medium transition-all duration-300 hover:text-ink",
                location.pathname === '/dashboard/student' ? "text-ink border-b-2 border-ink pb-1" : "text-ink/50"
              )}>Home</Link>
              <Link to="/student/find-accommodation" className={cn(
                "text-sm font-medium transition-all duration-300 hover:text-ink",
                location.pathname === '/student/find-accommodation' ? "text-ink border-b-2 border-ink pb-1" : "text-ink/50"
              )}>Stays</Link>
              <Link to="/student/find-restaurants" className={cn(
                "text-sm font-medium transition-all duration-300 hover:text-ink",
                location.pathname === '/student/find-restaurants' ? "text-ink border-b-2 border-ink pb-1" : "text-ink/50"
              )}>Meals</Link>
              <Link to="/student/requests" className={cn(
                "text-sm font-medium transition-all duration-300 hover:text-ink",
                location.pathname === '/student/requests' ? "text-ink border-b-2 border-ink pb-1" : "text-ink/50"
              )}>Requests</Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-bold text-ink">{user?.name}</span>
            <span className="text-[10px] uppercase tracking-widest text-ink/40 font-bold">{user?.role.replace('_', ' ')}</span>
          </div>
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="w-12 h-12 rounded-full bg-ink text-white flex items-center justify-center font-serif text-xl font-bold shadow-xl shadow-ink/10 border border-white/10 hover:scale-105 transition-transform"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                user?.name.charAt(0)
              )}
            </button>
            <AnimatePresence>
              {isProfileDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-4 w-64 bg-white border border-black/5 rounded-[2rem] shadow-2xl z-50 p-2 overflow-hidden"
                >
                  <div className="p-6 border-b border-black/5 bg-paper/30">
                    <p className="text-sm font-bold text-ink truncate">{user?.name}</p>
                    <p className="text-xs text-ink/40 truncate mt-1">{user?.email}</p>
                  </div>
                  <div className="p-2 space-y-1">
                    <Link 
                      to="/profile" 
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="w-full text-left p-4 text-sm text-ink hover:bg-black/5 flex items-center gap-3 rounded-2xl transition-colors font-medium"
                    >
                      <User size={18} className="text-gold" />
                      My Profile
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left p-4 text-sm text-red-500 hover:bg-red-50 flex items-center gap-3 rounded-2xl transition-colors font-medium"
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button 
            className="lg:hidden p-2 text-ink hover:bg-black/5 rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* Sidebar Desktop (Non-Student) */}
        {user?.role !== 'STUDENT' && (
          <aside className="hidden lg:flex flex-col w-72 bg-muted border-r border-black/5 h-[calc(100vh-80px)] sticky top-20">
            <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
              {filteredNavItems.map((item) => (
                <Link
                  key={`nav-desktop-${item.path}`}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300",
                    location.pathname === item.path
                      ? "bg-ink text-white shadow-xl shadow-ink/20"
                      : "text-ink/50 hover:bg-black/5 hover:text-ink"
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
        )}

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Mobile Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 left-0 w-80 bg-paper z-50 transform transition-transform duration-500 ease-in-out lg:hidden p-8 flex flex-col",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-ink rounded-full flex items-center justify-center text-white">
              <span className="font-serif text-xl font-bold">S</span>
            </div>
            <span className="font-serif text-2xl font-bold text-ink tracking-tight">StudentNest</span>
          </div>
          <nav className="flex-1 space-y-2 overflow-y-auto">
            {filteredNavItems.map((item) => (
              <Link
                key={`nav-mobile-${item.path}`}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-medium transition-all duration-300",
                  location.pathname === item.path
                    ? "bg-ink text-white shadow-xl shadow-ink/20"
                    : "text-ink/50 hover:bg-black/5 hover:text-ink"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-medium text-red-500 hover:bg-red-50 transition-colors mt-8"
          >
            <LogOut size={24} />
            Sign Out
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full"
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Unique & Attractive Footer */}
      <footer className="bg-ink text-white pt-24 pb-12 px-6 md:px-12 overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
            {/* Brand Section */}
            <div className="space-y-8">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-ink transition-transform duration-500 group-hover:rotate-[360deg]">
                  <span className="font-serif text-2xl font-bold">S</span>
                </div>
                <span className="font-serif text-3xl font-bold text-white tracking-tight">StudentNest</span>
              </Link>
              <p className="text-white/40 text-sm leading-relaxed max-w-xs">
                The ultimate student living companion. Connecting thousands of students to verified homes and healthy meals across the country.
              </p>
              <div className="flex items-center gap-4">
                {['Twitter', 'Instagram', 'LinkedIn'].map((social) => (
                  <a 
                    key={social} 
                    href="#" 
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:border-gold hover:text-gold transition-all duration-300"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="w-1.5 h-1.5 bg-current rounded-full" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-8">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">Explore</h4>
              <nav className="flex flex-col gap-4">
                <Link to="/student/find-accommodation" className="text-sm text-white/40 hover:text-white transition-colors">Find Accommodation</Link>
                <Link to="/student/find-restaurants" className="text-sm text-white/40 hover:text-white transition-colors">Campus Meals</Link>
                <Link to="/student/requests" className="text-sm text-white/40 hover:text-white transition-colors">Community Requests</Link>
                <Link to="/dashboard/student" className="text-sm text-white/40 hover:text-white transition-colors">Student Dashboard</Link>
              </nav>
            </div>

            {/* Support */}
            <div className="space-y-8">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">Support</h4>
              <nav className="flex flex-col gap-4">
                <Link to="/help" className="text-sm text-white/40 hover:text-white transition-colors">Help Center</Link>
                <Link to="/safety" className="text-sm text-white/40 hover:text-white transition-colors">Safety Guidelines</Link>
                <Link to="/terms" className="text-sm text-white/40 hover:text-white transition-colors">Terms of Service</Link>
                <Link to="/privacy" className="text-sm text-white/40 hover:text-white transition-colors">Privacy Policy</Link>
              </nav>
            </div>

            {/* Newsletter */}
            <div className="space-y-8">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">Newsletter</h4>
              <div className="space-y-4">
                <p className="text-sm text-white/40">Stay updated with the latest campus news and offers.</p>
                <div className="relative">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-gold transition-colors"
                  />
                  <button className="absolute right-2 top-2 bottom-2 px-6 bg-gold text-ink rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-colors">
                    Join
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
              © 2026 StudentNest. Built with passion for students.
            </p>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">System Operational</span>
              </div>
              <div className="w-px h-4 bg-white/10 hidden md:block" />
              <button className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-gold transition-colors">
                Back to top ↑
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>

  );
};
