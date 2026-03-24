import React, { useState, useEffect } from 'react';
import { 
  Star, MapPin, ShieldCheck, Check, 
  Upload, Calendar, Info, X, CreditCard,
  ChevronRight, AlertCircle, ArrowLeft
} from 'lucide-react';
import { Card, Button, Input, Modal, Badge } from '../UI';
import { Accommodation, BookingRequest } from '../../types/accommodation';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { NOTE_MAX_WORDS, countWords, enforceWordLimit, sanitizeNic } from '../../lib/inputControl';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  accommodation: Accommodation;
  onSubmit: (request: BookingRequest) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, accommodation, onSubmit }) => {
  const [roomType, setRoomType] = useState(accommodation.roomType);
  const [duration, setDuration] = useState(6);
  const [paymentProof, setPaymentProof] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<{ nationalId?: string; notes?: string }>({});

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    university: accommodation.university || '',
    gender: 'Male',
    age: '',
    studentId: '',
    nationalId: '',
    moveInDate: '',
    notes: ''
  });

  const totalPrice = accommodation.price * duration;
  const securityDeposit = accommodation.price;
  const serviceFee = 1500;
  const grandTotal = totalPrice + securityDeposit + serviceFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (name === 'nationalId') {
        return { ...prev, [name]: sanitizeNic(value) };
      }

      if (name === 'notes') {
        const limitedNotes = enforceWordLimit(prev.notes, value, NOTE_MAX_WORDS);
        return { ...prev, [name]: limitedNotes };
      }

      return { ...prev, [name]: value };
    });

    if (name === 'nationalId') {
      const nicValue = sanitizeNic(value);
      let nicError = '';
      if (!nicValue) nicError = 'National ID is required';
      else if (nicValue.length < 10) nicError = 'National ID must be at least 10 characters';
      setErrors(prev => ({ ...prev, nationalId: nicError }));
    }

    if (name === 'notes') {
      const tooManyWords = countWords(value) > NOTE_MAX_WORDS;
      setErrors(prev => ({ ...prev, notes: tooManyWords ? `Maximum ${NOTE_MAX_WORDS} words allowed` : '' }));
    }
  };

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
      ...formData,
      accommodationId: accommodation.id,
      roomType,
      duration,
      totalPrice: grandTotal,
      paymentProof
    });
    
    setIsSubmitting(false);
    onClose();
  };

  const isStep1Valid = Boolean(
    formData.fullName &&
    formData.university &&
    formData.age &&
    formData.studentId &&
    formData.nationalId &&
    formData.nationalId.length >= 10 &&
    formData.nationalId.length <= 12 &&
    !errors.nationalId &&
    !errors.notes
  );
  const noteWordCount = countWords(formData.notes);
  const isNoteLimitReached = noteWordCount >= NOTE_MAX_WORDS;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title=""
      maxWidth="3xl"
    >
      <div className="space-y-10">
        {/* Custom Header */}
        <div className="flex items-center justify-between border-b border-black/5 pb-8">
          <div className="flex items-center gap-6">
            <button 
              onClick={onClose}
              className="w-12 h-12 rounded-full border border-black/5 flex items-center justify-center text-ink/40 hover:text-ink hover:bg-paper transition-all group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div className="space-y-1">
              <h2 className="text-3xl font-serif text-ink">
                {step === 1 ? 'Student Information' : 'Payment & Confirmation'}
              </h2>
              <p className="text-[10px] text-ink/40 font-bold uppercase tracking-widest">
                Step {step} of 2
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-full hover:bg-black/5 flex items-center justify-center transition-colors text-ink/40 hover:text-ink"
          >
            <X size={24} />
          </button>
        </div>

        {step === 1 ? (
          <div className="space-y-8">
            {/* Student Info Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-ink/40 uppercase tracking-widest ml-4">Full Name</label>
                <Input 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="h-14 rounded-full bg-paper/50 border-none px-6"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-ink/40 uppercase tracking-widest ml-4">University</label>
                <div className="relative">
                  <select 
                    name="university"
                    value={formData.university}
                    onChange={handleInputChange}
                    className="w-full h-14 px-6 rounded-full border border-black/5 bg-paper/50 text-ink font-bold text-xs uppercase tracking-wider focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all outline-none appearance-none"
                  >
                    <option value="SLIIT">SLIIT</option>
                    <option value="NSBM">NSBM</option>
                    <option value="IIT">IIT</option>
                    <option value="UOM">University of Moratuwa</option>
                    <option value="UOC">University of Colombo</option>
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-ink/40">
                    <ChevronRight size={16} className="rotate-90" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-ink/40 uppercase tracking-widest ml-4">Gender</label>
                <div className="relative">
                  <select 
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full h-14 px-6 rounded-full border border-black/5 bg-paper/50 text-ink font-bold text-xs uppercase tracking-wider focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all outline-none appearance-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-ink/40">
                    <ChevronRight size={16} className="rotate-90" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-ink/40 uppercase tracking-widest ml-4">Age</label>
                <Input 
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="Enter your age"
                  className="h-14 rounded-full bg-paper/50 border-none px-6"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-ink/40 uppercase tracking-widest ml-4">Student ID</label>
                <Input 
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  placeholder="Enter Student ID"
                  className="h-14 rounded-full bg-paper/50 border-none px-6"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-ink/40 uppercase tracking-widest ml-4">National ID (NIC)</label>
                <Input 
                  type="text"
                  name="nationalId"
                  value={formData.nationalId}
                  onChange={handleInputChange}
                  placeholder="Enter NIC number"
                  maxLength={12}
                  className={cn(
                    "h-14 rounded-full bg-paper/50 px-6",
                    errors.nationalId ? "border-red-500 focus:ring-red-500/20" : formData.nationalId ? "border-emerald-500 focus:ring-emerald-500/20" : "border-black/5"
                  )}
                  required
                />
                {errors.nationalId && (
                  <p className="text-[10px] font-bold uppercase tracking-widest text-red-500 ml-4">
                    {errors.nationalId}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-ink/40 uppercase tracking-widest ml-4">Move-in Date (Optional)</label>
                <Input 
                  type="date"
                  name="moveInDate"
                  value={formData.moveInDate}
                  onChange={handleInputChange}
                  className="h-14 rounded-full bg-paper/50 border-none px-6"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-ink/40 uppercase tracking-widest ml-4">Room Type</label>
                <div className="relative">
                  <div className="w-full h-14 px-6 rounded-full border border-black/5 bg-paper/50 text-ink font-bold text-xs uppercase tracking-wider flex items-center">
                    {accommodation.roomType}
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-ink/40 uppercase tracking-widest ml-4">Special Notes (Optional)</label>
              <textarea 
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any special requests or notes..."
                className={cn(
                  "w-full h-32 p-6 rounded-[2rem] bg-paper/50 border text-ink font-medium text-sm focus:ring-2 transition-all outline-none resize-none",
                  isNoteLimitReached ? "border-red-500 focus:ring-red-500/20" : "border-emerald-500 focus:ring-emerald-500/20"
                )}
              />
              <div className="flex items-center justify-between px-4">
                <p className={cn("text-[10px] font-bold uppercase tracking-widest", isNoteLimitReached ? "text-red-500" : "text-emerald-600")}>
                  {noteWordCount} / {NOTE_MAX_WORDS} words
                </p>
                {isNoteLimitReached && (
                  <p className="text-[10px] font-bold uppercase tracking-widest text-red-500">
                    Word limit reached
                  </p>
                )}
              </div>
              {errors.notes && (
                <p className="text-[10px] font-bold uppercase tracking-widest text-red-500 ml-4">
                  {errors.notes}
                </p>
              )}
            </div>
            <div className="flex gap-4">
              <Button 
                variant="outline"
                onClick={onClose}
                className="flex-1 h-16 rounded-full text-ink font-bold uppercase tracking-widest text-[10px]"
              >
                Cancel
              </Button>
              <Button 
                disabled={!isStep1Valid}
                onClick={() => setStep(2)}
                className="flex-[2] h-16 rounded-full bg-ink text-gold font-bold uppercase tracking-widest text-[10px] shadow-xl shadow-ink/10"
              >
                Continue to Payment
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Summary Card */}
            <div className="flex items-center gap-6 p-6 rounded-[2rem] bg-paper/30 border border-black/5">
              <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                <img src={accommodation.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-2xl text-ink leading-tight">{accommodation.name}</h3>
                <div className="flex items-center gap-4">
                  <p className="text-[10px] text-ink/40 font-bold uppercase tracking-widest flex items-center gap-1">
                    <MapPin size={12} className="text-ink/20" /> {accommodation.city}
                  </p>
                  <p className="text-[10px] text-ink/60 font-bold uppercase tracking-widest">
                    Rs. {accommodation.price.toLocaleString()}/mo
                  </p>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="p-8 rounded-[2.5rem] bg-ink text-paper space-y-6 shadow-2xl shadow-ink/20">
              <h4 className="text-[10px] font-bold text-paper/40 uppercase tracking-widest border-b border-paper/10 pb-4">Payment Summary</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-paper/60 font-light">Monthly Rent (x{duration})</span>
                  <span className="font-bold">Rs. {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-paper/60 font-light">Security Deposit (1 Month)</span>
                  <span className="font-bold">Rs. {securityDeposit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-paper/60 font-light">Service Fee</span>
                  <span className="font-bold">Rs. {serviceFee.toLocaleString()}</span>
                </div>
              </div>
              <div className="pt-6 border-t border-paper/10 flex justify-between items-center">
                <span className="font-serif text-xl">Grand Total</span>
                <span className="text-3xl font-serif text-gold">Rs. {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Proof Upload */}
            <div className="space-y-5">
              <div className="flex items-center justify-between px-4">
                <label className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">Upload Payment Proof</label>
                <span className="text-[9px] text-ink/40 font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-black/5">Required</span>
              </div>
              
              <div className="relative aspect-video rounded-[2rem] border-2 border-dashed border-black/5 bg-paper/30 flex flex-col items-center justify-center overflow-hidden group transition-all hover:border-black/20 hover:bg-paper/50">
                {paymentProof ? (
                  <>
                    <img src={paymentProof} className="w-full h-full object-contain" />
                    <div className="absolute inset-0 bg-ink/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <Button variant="secondary" size="sm" className="rounded-full bg-paper text-ink font-bold uppercase text-[10px] tracking-widest" onClick={() => setPaymentProof(null)}>Change Image</Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center text-ink/40 mb-4 group-hover:scale-110 transition-transform">
                      <Upload size={28} />
                    </div>
                    <p className="text-sm font-bold text-ink uppercase tracking-wider">Click to upload receipt</p>
                    <p className="text-[10px] text-ink/30 mt-2 uppercase tracking-widest font-bold">PNG, JPG up to 5MB</p>
                    <input 
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </>
                )}
              </div>
              <div className="flex items-start gap-3 p-5 rounded-[1.5rem] bg-paper/50 border border-black/5 text-ink/60 text-[10px] leading-relaxed font-medium">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-ink/20" />
                <p>Please transfer the total amount to <span className="text-ink font-bold">Bank of Ceylon (Acc: 12345678)</span> and upload the digital receipt or a photo of the slip here to confirm your booking request.</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 pt-10 border-t border-black/5">
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  className="flex-1 h-16 rounded-full text-ink font-bold uppercase tracking-widest text-[10px]" 
                  onClick={() => setStep(1)}
                >
                  Back to Info
                </Button>
                <Button 
                  disabled={!paymentProof || isSubmitting} 
                  className="flex-[2] h-16 rounded-full bg-ink text-gold font-bold uppercase tracking-widest text-[10px] shadow-xl shadow-ink/10 disabled:opacity-50" 
                  onClick={handleSubmit}
                >
                  {isSubmitting ? 'Processing Request...' : 'Confirm & Pay'}
                </Button>
              </div>
              <Button 
                variant="ghost" 
                className="w-full h-12 rounded-full text-ink/40 hover:text-ink font-bold uppercase tracking-widest text-[9px]" 
                onClick={onClose}
              >
                Cancel Booking
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
