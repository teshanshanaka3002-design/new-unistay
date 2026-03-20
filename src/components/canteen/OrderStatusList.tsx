import React from 'react';
import { Clock, CheckCircle2, ShoppingBag, ArrowRight, Info } from 'lucide-react';
import { Card, Button, Badge } from '../UI';
import { Order, OrderStatus } from '../../types/canteen';
import { motion, AnimatePresence } from 'motion/react';

interface OrderStatusListProps {
  orders: Order[];
  onRefresh: () => void;
}

export const OrderStatusList: React.FC<OrderStatusListProps> = ({ orders, onRefresh }) => {
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Preparing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Ready': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Collected': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'Pending': return <Clock size={16} />;
      case 'Preparing': return <div className="w-3 h-3 rounded-full bg-blue-600 animate-pulse" />;
      case 'Ready': return <CheckCircle2 size={16} />;
      case 'Collected': return <ShoppingBag size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Your Recent Orders</h2>
        <Button variant="ghost" size="sm" onClick={onRefresh} className="text-blue-600 font-bold">
          Refresh Status
        </Button>
      </div>

      {orders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((order) => (
            <Card key={order.id} className="p-6 space-y-6 border-slate-100 hover:shadow-lg transition-all group">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{order.canteenName}</h3>
                  <p className="text-xs text-slate-500 font-medium">Order ID: {order.id}</p>
                </div>
                <Badge className={cn("flex items-center gap-2 font-bold uppercase tracking-wider px-3 py-1", getStatusColor(order.status))}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </Badge>
              </div>

              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">{item.name} <span className="text-xs text-slate-400 font-bold ml-1">x{item.quantity}</span></span>
                    <span className="font-bold text-slate-900">Rs. {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                  <Clock size={16} className="text-blue-600" />
                  Pickup: <span className="text-slate-900 font-bold">{order.pickupTime}</span>
                </div>
                <p className="text-lg font-bold text-blue-600">Rs. {order.totalPrice}</p>
              </div>

              {order.status === 'Ready' && (
                <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-700 text-xs leading-relaxed border border-emerald-100 flex items-start gap-3">
                  <Info size={16} className="flex-shrink-0 mt-0.5" />
                  <p>Your order is ready for pickup! Please head to the counter at <span className="font-bold">{order.canteenName}</span> and pay Rs. {order.totalPrice} in cash.</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 space-y-6 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-md text-slate-300">
            <ShoppingBag size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900">No active orders</h3>
            <p className="text-sm text-slate-500 max-w-xs mx-auto">You haven't placed any orders yet. Browse the canteens to find something delicious!</p>
          </div>
        </div>
      )}
    </div>
  );
};

import { cn } from '../../lib/utils';
