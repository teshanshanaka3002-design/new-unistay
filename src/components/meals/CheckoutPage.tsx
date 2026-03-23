import React, { useState } from 'react';
import { ArrowLeft, CreditCard, ShoppingBag, User, School, Hash, Phone, CheckCircle2 } from 'lucide-react';
import { OrderItem, Canteen } from '../../types/canteen';
import { Card, Badge } from '../UI';
import { motion } from 'motion/react';

import { validateFullName, validatePhone } from '../../lib/validation';

interface CheckoutPageProps {
  items: OrderItem[];
  canteen: Canteen;
  onBack: () => void;
  onPlaceOrder: (formData: any) => void;
  defaultUniversity?: string;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  items,
  canteen,
  onBack,
  onPlaceOrder,
  defaultUniversity = '',
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    university: defaultUniversity,
    year: '1st',
    idNumber: '',
    phone: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const validateField = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'fullName':
        error = validateFullName(value);
        break;
      case 'university':
        if (!value) error = 'University is required';
        break;
      case 'idNumber':
        if (!value) error = 'University ID is required';
        break;
      case 'phone':
        error = validatePhone(value);
        break;
    }
    return error;
  };

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, formData[name as keyof typeof formData]) }));
  };

  const isFormValid = () => {
    const fieldErrors = {
      fullName: validateField('fullName', formData.fullName),
      university: validateField('university', formData.university),
      idNumber: validateField('idNumber', formData.idNumber),
      phone: validateField('phone', formData.phone),
    };
    return Object.values(fieldErrors).every(error => !error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);

    // Validate all fields
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onPlaceOrder(formData);
    }
  };

  const getStatusClasses = (name: string) => {
    if (!touched[name]) return 'border-black/5';
    return errors[name] ? 'border-red-500 ring-red-500/10' : 'border-green-500 ring-green-500/10';
  };

  return (
    <div className="min-h-screen bg-paper/30 pb-20">
      <div className="bg-white border-b border-black/5 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-3 text-ink/40 hover:text-ink transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-paper flex items-center justify-center group-hover:bg-ink group-hover:text-white transition-all">
              <ArrowLeft size={20} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest">Back to Menu</span>
          </button>
          <h1 className="text-2xl font-serif text-ink">Checkout</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Order Form */}
          <div className="lg:col-span-7 space-y-12">
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-ink text-white flex items-center justify-center">
                  <User size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-serif text-ink">Student Details</h2>
                  <p className="text-[10px] text-ink/40 font-bold uppercase tracking-widest">Information for pickup</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-ink/40 uppercase tracking-widest ml-4">Full Name</label>
                  <input 
                    type="text"
                    value={formData.fullName}
                    onChange={e => handleChange('fullName', e.target.value)}
                    onBlur={() => handleBlur('fullName')}
                    placeholder="John Doe"
                    className={`w-full h-14 px-6 rounded-full bg-white border ${getStatusClasses('fullName')} text-ink font-bold text-xs uppercase tracking-wider focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all outline-none`}
                  />
                  {touched.fullName && errors.fullName && <p className="text-[10px] text-red-500 font-bold ml-4">{errors.fullName}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-ink/40 uppercase tracking-widest ml-4">University</label>
                  <select 
                    value={formData.university}
                    onChange={e => handleChange('university', e.target.value)}
                    onBlur={() => handleBlur('university')}
                    className={`w-full h-14 px-6 rounded-full bg-white border ${getStatusClasses('university')} text-ink font-bold text-xs uppercase tracking-wider focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all outline-none`}
                  >
                    <option value="">Select University</option>
                    <option value="SLIIT">SLIIT</option>
                    <option value="NSBM">NSBM</option>
                    <option value="IIT">IIT</option>
                    <option value="CINEC">CINEC</option>
                  </select>
                  {touched.university && errors.university && <p className="text-[10px] text-red-500 font-bold ml-4">{errors.university}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-ink/40 uppercase tracking-widest ml-4">Year of Study</label>
                  <select 
                    value={formData.year}
                    onChange={e => handleChange('year', e.target.value)}
                    className="w-full h-14 px-6 rounded-full bg-white border border-black/5 text-ink font-bold text-xs uppercase tracking-wider focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all outline-none"
                  >
                    <option value="1st">1st Year</option>
                    <option value="2nd">2nd Year</option>
                    <option value="3rd">3rd Year</option>
                    <option value="4th">4th Year</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-ink/40 uppercase tracking-widest ml-4">University ID</label>
                  <input 
                    type="text"
                    value={formData.idNumber}
                    onChange={e => handleChange('idNumber', e.target.value)}
                    onBlur={() => handleBlur('idNumber')}
                    placeholder="IT21000000"
                    className={`w-full h-14 px-6 rounded-full bg-white border ${getStatusClasses('idNumber')} text-ink font-bold text-xs uppercase tracking-wider focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all outline-none`}
                  />
                  {touched.idNumber && errors.idNumber && <p className="text-[10px] text-red-500 font-bold ml-4">{errors.idNumber}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-bold text-ink/40 uppercase tracking-widest ml-4">Phone Number</label>
                  <input 
                    type="tel"
                    value={formData.phone}
                    onChange={e => handleChange('phone', e.target.value)}
                    onBlur={() => handleBlur('phone')}
                    placeholder="0771234567"
                    className={`w-full h-14 px-6 rounded-full bg-white border ${getStatusClasses('phone')} text-ink font-bold text-xs uppercase tracking-wider focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all outline-none`}
                  />
                  {touched.phone && errors.phone && <p className="text-[10px] text-red-500 font-bold ml-4">{errors.phone}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-bold text-ink/40 uppercase tracking-widest ml-4">Special Notes (Optional)</label>
                  <textarea 
                    value={formData.notes}
                    onChange={e => handleChange('notes', e.target.value)}
                    placeholder="Any special requests or notes..."
                    className="w-full h-32 p-6 rounded-[2rem] bg-white border border-black/5 text-ink font-medium text-sm focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all outline-none resize-none"
                  />
                </div>
              </form>
            </section>

            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-paper text-ink flex items-center justify-center">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-serif text-ink">Payment Method</h2>
                  <p className="text-[10px] text-ink/40 font-bold uppercase tracking-widest">How you'll pay</p>
                </div>
              </div>

              <div className="p-6 rounded-[2rem] bg-ink text-white flex items-center justify-between shadow-xl shadow-ink/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <CheckCircle2 size={24} className="text-gold" />
                  </div>
                  <div>
                    <p className="font-bold text-sm uppercase tracking-wider">Cash on Pickup</p>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Pay at the cafe counter</p>
                  </div>
                </div>
                <Badge className="bg-gold text-ink border-none font-bold uppercase text-[10px] tracking-widest px-4 py-1.5 rounded-full">Selected</Badge>
              </div>
            </section>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 space-y-8">
              <Card className="p-8 border-black/5 bg-white shadow-2xl shadow-black/5 space-y-8 rounded-[2.5rem]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-paper flex items-center justify-center text-ink">
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif text-ink">Order Summary</h3>
                    <p className="text-[10px] text-ink/40 font-bold uppercase tracking-widest">From {canteen.name}</p>
                  </div>
                </div>

                <div className="space-y-6 max-h-[400px] overflow-y-auto scrollbar-hide">
                  {items.map((item) => (
                    <div key={item.menuItemId} className="flex justify-between items-center group">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-ink group-hover:text-gold transition-colors">{item.name}</p>
                        <p className="text-[10px] text-ink/40 font-bold uppercase tracking-widest">Qty: {item.quantity} × Rs. {item.price}</p>
                      </div>
                      <span className="text-sm font-bold text-ink">Rs. {item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t border-black/5 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-ink/40 text-sm font-medium">Subtotal</span>
                    <span className="text-ink font-bold text-sm">Rs. {total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-ink/40 text-sm font-medium">Service Fee</span>
                    <span className="text-ink font-bold text-sm">Rs. 0</span>
                  </div>
                  <div className="flex justify-between items-center pt-4">
                    <span className="text-ink font-serif text-xl">Total</span>
                    <span className="text-gold font-bold text-2xl">Rs. {total}</span>
                  </div>
                </div>

                <button 
                  onClick={handleSubmit}
                  disabled={!isFormValid()}
                  className="w-full flex items-center justify-center gap-4 bg-ink text-white py-5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gold transition-all shadow-2xl shadow-ink/20 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-ink"
                >
                  Place Order
                  <CheckCircle2 size={18} className="transition-transform group-hover:scale-110" />
                </button>
              </Card>

              <div className="p-6 rounded-[2rem] bg-paper/50 border border-black/5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gold shrink-0">
                  <CheckCircle2 size={20} />
                </div>
                <p className="text-[11px] text-ink/60 leading-relaxed font-medium">
                  By placing this order, you agree to collect it from <span className="font-bold text-ink">{canteen.name}</span> and pay <span className="font-bold text-ink">Rs. {total}</span> in cash at the counter.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
