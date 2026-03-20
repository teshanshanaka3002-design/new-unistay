import React, { useState } from 'react';
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
  { label: 'Restaurants', path: '/student/find-restaurants', icon: <Utensils size={20} />, roles: ['STUDENT'] },
  { label: 'My bookings', path: '/student/my-bookings', icon: <BookOpen size={20} />, roles: ['STUDENT'] },
  { label: 'Requests', path: '/student/requests', icon: <MessageSquare size={20} />, roles: ['STUDENT'] },
  { label: 'Profile', path: '/student/profile', icon: <User size={20} />, roles: ['STUDENT'] },

  // Boarding Owner
  { label: 'Dashboard', path: '/dashboard/boarding-owner', icon: <LayoutDashboard size={20} />, roles: ['BOARDING_OWNER'] },
  { label: 'My Boarding Profile', path: '/boarding/profile', icon: <Home size={20} />, roles: ['BOARDING_OWNER'] },
  { label: 'Add Room', path: '/boarding/add-room', icon: <PlusCircle size={20} />, roles: ['BOARDING_OWNER'] },
  { label: 'Manage Rooms', path: '/boarding/manage-rooms', icon: <Settings size={20} />, roles: ['BOARDING_OWNER'] },
  { label: 'Booking Requests', path: '/boarding/requests', icon: <BookOpen size={20} />, roles: ['BOARDING_OWNER'] },
  { label: 'Payments', path: '/boarding/payments', icon: <CreditCard size={20} />, roles: ['BOARDING_OWNER'] },
  { label: 'Reviews', path: '/boarding/reviews', icon: <Star size={20} />, roles: ['BOARDING_OWNER'] },
  { label: 'Profile', path: '/boarding/user-profile', icon: <User size={20} />, roles: ['BOARDING_OWNER'] },

  // Restaurant Owner
  { label: 'Dashboard', path: '/dashboard/restaurant-owner', icon: <LayoutDashboard size={20} />, roles: ['RESTAURANT_OWNER'] },
  { label: 'Restaurant Profile', path: '/restaurant/profile', icon: <Utensils size={20} />, roles: ['RESTAURANT_OWNER'] },
  { label: 'Add Menu Item', path: '/restaurant/add-menu', icon: <PlusCircle size={20} />, roles: ['RESTAURANT_OWNER'] },
  { label: 'Manage Menu', path: '/restaurant/manage-menu', icon: <Settings size={20} />, roles: ['RESTAURANT_OWNER'] },
  { label: 'Orders', path: '/restaurant/orders', icon: <ShoppingBag size={20} />, roles: ['RESTAURANT_OWNER'] },
  { label: 'Payments', path: '/restaurant/payments', icon: <CreditCard size={20} />, roles: ['RESTAURANT_OWNER'] },
  { label: 'Reviews', path: '/restaurant/reviews', icon: <Star size={20} />, roles: ['RESTAURANT_OWNER'] },
  { label: 'Profile', path: '/restaurant/user-profile', icon: <User size={20} />, roles: ['RESTAURANT_OWNER'] },

  // Admin
  { label: 'Dashboard', path: '/dashboard/admin', icon: <LayoutDashboard size={20} />, roles: ['ADMIN'] },
  { label: 'Users Management', path: '/admin/users', icon: <Users size={20} />, roles: ['ADMIN'] },
  { label: 'Boarding Approvals', path: '/admin/boarding-approvals', icon: <CheckCircle size={20} />, roles: ['ADMIN'] },
  { label: 'Restaurant Approvals', path: '/admin/restaurant-approvals', icon: <CheckCircle size={20} />, roles: ['ADMIN'] },
  { label: 'Payment Verification', path: '/admin/payments', icon: <CreditCard size={20} />, roles: ['ADMIN'] },
  { label: 'Reviews Management', path: '/admin/reviews', icon: <Star size={20} />, roles: ['ADMIN'] },
  { label: 'System Statistics', path: '/admin/statistics', icon: <BarChart3 size={20} />, roles: ['ADMIN'] },
];

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const filteredNavItems = navItems.filter(item => user && item.roles.includes(user.role));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 h-16 flex items-center px-4 md:px-6 justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link 
            to={user?.role === 'STUDENT' ? '/dashboard/student' : user?.role === 'BOARDING_OWNER' ? '/dashboard/boarding-owner' : user?.role === 'RESTAURANT_OWNER' ? '/dashboard/restaurant-owner' : '/dashboard/admin'} 
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <GraduationCap size={24} />
            </div>
            <span className="font-bold text-xl text-slate-900 hidden sm:inline-block tracking-tight">UNIstay</span>
          </Link>

          {/* Student Top Navigation */}
          {user?.role === 'STUDENT' && (
            <nav className="hidden md:flex items-center gap-8 ml-8">
              <Link to="/student/find-accommodation" className={cn(
                "text-sm font-semibold transition-colors hover:text-blue-600",
                location.pathname === '/student/find-accommodation' ? "text-blue-600" : "text-slate-600"
              )}>Accommodation</Link>
              <Link to="/student/find-restaurants" className={cn(
                "text-sm font-semibold transition-colors hover:text-blue-600",
                location.pathname === '/student/find-restaurants' ? "text-blue-600" : "text-slate-600"
              )}>Restaurants</Link>
              <Link to="/student/my-bookings" className={cn(
                "text-sm font-semibold transition-colors hover:text-blue-600",
                location.pathname === '/student/my-bookings' ? "text-blue-600" : "text-slate-600"
              )}>My bookings</Link>
              <Link to="/student/requests" className={cn(
                "text-sm font-semibold transition-colors hover:text-blue-600",
                location.pathname === '/student/requests' ? "text-blue-600" : "text-slate-600"
              )}>Requests</Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end mr-2">
            <span className="text-sm font-semibold text-slate-900">{user?.name}</span>
            <span className="text-xs text-slate-500 capitalize">{user?.role.replace('_', ' ')}</span>
          </div>
          <div className="relative group">
            <button className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold border border-blue-200">
              {user?.name.charAt(0)}
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="p-3 border-b border-slate-100">
                <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full text-left p-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 rounded-b-lg"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* Sidebar Desktop */}
        {user?.role !== 'STUDENT' && (
          <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-[calc(100vh-64px)] sticky top-16">
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    location.pathname === item.path
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
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
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 left-0 w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="h-16 flex items-center px-6 border-b border-slate-100 gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <GraduationCap size={18} />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">UNIstay</span>
          </div>
          <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-64px)]">
            {filteredNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === item.path
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-4"
            >
              <LogOut size={20} />
              Logout
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full"
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">© 2026 UNIstay. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link to="/terms" className="hover:text-blue-600">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-blue-600">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-blue-600">Contact Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
