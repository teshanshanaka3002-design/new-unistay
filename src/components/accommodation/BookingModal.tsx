import React, { useState, useEffect } from 'react';
import { 
  Star, MapPin, ShieldCheck, Check, 
  Upload, Calendar, Info, X, CreditCard
} from 'lucide-react';
import { Card, Button, Input, Modal, Badge } from '../UI';
import { Accommodation, BookingRequest } from '../../types/accommodation';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  accommodation: Accommodation;
  onSubmit: (request: BookingRequest) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, accommodation, onSubmit }) => {
  const [roomType, setRoomType] = useState(accommodation.roomTypes[0]);
  const [duration, setDuration] = useState(6);
  const [paymentProof, setPaymentProof] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPrice = accommodation.price * duration;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPaymentProof(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!paymentProof) return;
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onSubmit({
      accommodationId: accommodation.id,
      roomType,
      duration,
      totalPrice,
      paymentProof
    });
    
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Secure Your Accommodation"
      footer={
        <div className="flex gap-3 w-full">
          <Button variant="ghost" className="flex-1 h-12 rounded-xl" onClick={onClose}>Cancel</Button>
          <Button 
            disabled={!paymentProof || isSubmitting} 
            className="flex-1 h-12 rounded-xl shadow-xl shadow-blue-600/20" 
            onClick={handleSubmit}
          >
            {isSubmitting ? 'Processing...' : 'Confirm Booking'}
          </Button>
        </div>
      }
    >
      <div className="space-y-8 py-4">
        {/* Summary Card */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-blue-50 border border-blue-100">
          <img src={accommodation.image} className="w-20 h-20 rounded-xl object-cover" referrerPolicy="no-referrer" />
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900">{accommodation.name}</h3>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <MapPin size={12} /> {accommodation.city}
            </p>
            <p className="text-sm font-bold text-blue-600">Rs. {accommodation.price.toLocaleString()}/mo</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Room Type</label>
            <select 
              value={roomType}
              onChange={e => setRoomType(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            >
              {accommodation.roomTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Duration (Months)</label>
            <Input 
              type="number" 
              min="6" 
              max="24"
              value={duration}
              onChange={e => setDuration(Number(e.target.value))}
              className="h-12 rounded-xl font-medium"
            />
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Monthly Rent (x{duration})</span>
            <span className="font-bold text-slate-900">Rs. {(accommodation.price * duration).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Security Deposit (1 Month)</span>
            <span className="font-bold text-slate-900">Rs. {accommodation.price.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Service Fee</span>
            <span className="font-bold text-slate-900">Rs. 1,500</span>
          </div>
          <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
            <span className="font-bold text-slate-900">Total Due</span>
            <span className="text-2xl font-bold text-blue-600">Rs. {(totalPrice + accommodation.price + 1500).toLocaleString()}</span>
          </div>
        </div>

        {/* Payment Proof Upload */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Upload Payment Proof</label>
            <Badge className="bg-amber-100 text-amber-700 border-none font-bold">Required</Badge>
          </div>
          
          <div className="relative aspect-video rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center overflow-hidden group transition-all hover:border-blue-300 hover:bg-blue-50/30">
            {paymentProof ? (
              <>
                <img src={paymentProof} className="w-full h-full object-contain" />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button variant="secondary" size="sm" onClick={() => setPaymentProof(null)}>Change Image</Button>
                </div>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-blue-600 mb-3">
                  <Upload size={24} />
                </div>
                <p className="text-sm font-bold text-slate-900">Click to upload receipt</p>
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
          <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 text-amber-700 text-[10px] leading-relaxed">
            <Info size={14} className="flex-shrink-0 mt-0.5" />
            <p>Please transfer the total amount to Bank of Ceylon (Acc: 12345678) and upload the receipt here to confirm your booking.</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};
