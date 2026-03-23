import React from 'react';
import { Clock, CheckCircle2, ShoppingBag, Info, RefreshCw } from 'lucide-react';
import { Order, OrderStatus } from '../../types/canteen';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface OrderStatusListProps {
  orders: Order[];
  onRefresh: () => void;
}

export const OrderStatusList: React.FC<OrderStatusListProps> = ({ orders, onRefresh }) => {
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Preparing': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Ready': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Collected': return 'bg-paper text-ink/30 border-black/5';
      default: return 'bg-paper text-ink/30 border-black/5';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'Pending': return <Clock size={14} />;
      case 'Preparing': return <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />;
      case 'Ready': return <CheckCircle2 size={14} />;
      case 'Collected': return <ShoppingBag size={14} />;
      default: return <Clock size={14} />;
    }
  };

  return (
    <div className="space-y-12 pb-32">
      <div className="flex items-center justify-between">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-ink/30">Active Orders</h2>
        <button 
          onClick={onRefresh} 
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-ink/40 hover:text-ink transition-colors"
        >
          <RefreshCw size={14} />
          Refresh Status
        </button>
      </div>

      {orders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {orders.map((order) => (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-10 rounded-[3rem] bg-white border border-black/5 shadow-xl hover:shadow-2xl transition-all duration-500 space-y-8 group"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h3 className="text-3xl font-serif text-ink group-hover:text-gold transition-colors">{order.canteenName}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-ink/20">Order ID: {order.id}</p>
                </div>
                <div className={cn("flex items-center gap-2 font-bold text-[9px] uppercase tracking-widest px-4 py-2 rounded-full border", getStatusColor(order.status))}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </div>
              </div>

              <div className="space-y-4 py-6 border-y border-black/5">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="text-ink/50 font-medium">{item.name} <span className="text-[10px] font-bold uppercase tracking-widest text-ink/20 ml-2">x{item.quantity}</span></span>
                    <span className="font-serif text-lg text-ink">LKR {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-ink/40 text-[10px] font-bold uppercase tracking-widest">
                  <Clock size={16} className="text-gold" />
                  Pickup: <span className="text-ink">{order.pickupTime}</span>
                </div>
                <p className="text-2xl font-serif text-gold">LKR {order.totalPrice}</p>
              </div>

              {order.status === 'Ready' && (
                <div className="p-6 rounded-3xl bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest leading-relaxed border border-emerald-100 flex items-start gap-4">
                  <Info size={16} className="flex-shrink-0 mt-0.5" />
                  <p>Order ready. Head to <span className="text-emerald-900">{order.canteenName}</span> counter. Pay LKR {order.totalPrice} in cash.</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 space-y-8 bg-white rounded-[4rem] border border-black/5 shadow-sm">
          <div className="w-24 h-24 rounded-full border border-dashed border-ink/20 flex items-center justify-center mx-auto text-ink/20">
            <ShoppingBag size={40} />
          </div>
          <div className="space-y-3">
            <h3 className="text-3xl font-serif text-ink">No active orders</h3>
            <p className="text-sm text-ink/40 max-w-xs mx-auto">Your culinary history is a blank canvas. Discover something extraordinary today.</p>
          </div>
        </div>
      )}
    </div>
  );
};
