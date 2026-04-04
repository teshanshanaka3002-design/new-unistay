import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { accommodationService, bookingService } from '../services/api';
import { Card, Button, Input, Modal } from '../components/UI';
import { 
  Plus, 
  Settings, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  MoreVertical, 
  Trash2, 
  Edit, 
  Home, 
  Users, 
  CreditCard, 
  Star,
  Image as ImageIcon,
  Upload,
  MessageSquare,
  Search,
  Filter,
  MapPin,
  DollarSign,
  Info,
  Check,
  Phone,
  Mail,
  User,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sanitizePhoneNumber } from '../lib/inputControl';

// --- Dashboard Overview ---
export const DashboardOverview: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [totalListings, setTotalListings] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!user) return;
      try {
        const accs = await accommodationService.getByOwner(user.id);
        const bks = await bookingService.getByOwner(user.id);
        
        setTotalListings(accs.data.length || 0);
        setTotalBookings(bks.data.length || 0);
        setPendingRequests(bks.data.filter((b: any) => b.status === 'Pending').length || 0);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDashboardStats();
  }, [user]);

  const stats = [
    { label: 'Total Listings', value: totalListings.toString(), icon: <Home className="text-white" size={24} />, color: 'bg-gradient-to-br from-blue-500 to-blue-700', shadow: 'shadow-blue-500/30' },
    { label: 'Total Bookings', value: totalBookings.toString(), icon: <Users className="text-white" size={24} />, color: 'bg-gradient-to-br from-emerald-500 to-emerald-700', shadow: 'shadow-emerald-500/30' },
    { label: 'Pending Requests', value: pendingRequests.toString(), icon: <CheckCircle2 className="text-white" size={24} />, color: 'bg-gradient-to-br from-amber-500 to-orange-600', shadow: 'shadow-orange-500/30' },
    { label: 'Average Rating', value: '4.8', icon: <Star className="text-white" size={24} />, color: 'bg-gradient-to-br from-purple-500 to-indigo-600', shadow: 'shadow-indigo-500/30' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 p-6 md:p-12">
      {/* Welcome Hero Area */}
      <div className="relative overflow-hidden rounded-[3rem] bg-ink text-white p-10 md:p-14 shadow-2xl">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h1 className="text-5xl font-serif leading-tight">Welcome back,<br /><span className="text-gold">{user?.name?.split(' ')[0] || 'Partner'}</span></h1>
            <p className="text-white/60 text-lg font-light max-w-md">Manage your properties, review incoming student applications, and optimize your listings all from your command center.</p>
          </div>
          <div className="flex gap-4 md:justify-end">
             <Button 
                className="h-14 px-8 rounded-full bg-gold text-ink hover:bg-gold/90 font-bold uppercase tracking-widest text-xs shadow-xl shadow-gold/20 flex items-center gap-2"
                onClick={() => navigate('/owner/add-listing')}
              >
                <Plus size={18} />
                New Listing
              </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <Card key={`stat-${stat.label}`} className="p-8 border-none bg-white hover:shadow-2xl hover:shadow-ink/5 transition-all duration-500 group rounded-[2.5rem] relative overflow-hidden">
            <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-10 transition-transform duration-700 group-hover:scale-150 ${stat.color}`} />
            
            <div className="flex flex-col gap-6 relative z-10">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:-translate-y-1 ${stat.color} ${stat.shadow}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-4xl font-serif text-ink mb-1">{stat.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-8 border-none bg-white rounded-[2.5rem] shadow-xl shadow-black/5" title="Performance Overview" description="Monthly booking trends and occupancy rates">
          <div className="h-72 w-full bg-paper/50 rounded-[2rem] border border-black/5 flex flex-col items-center justify-center relative overflow-hidden group">
            {/* Mock Chart UI */}
            <div className="absolute bottom-0 left-0 w-full h-full flex items-end justify-between px-8 pt-10 pb-4 opacity-40">
              {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                <div key={i} className="w-[10%] bg-gradient-to-t from-gold to-gold/20 rounded-t-lg transition-all duration-1000 group-hover:from-gold group-hover:to-gold/50" style={{ height: `${h}%` }} />
              ))}
            </div>
            
            <div className="text-center space-y-4 relative z-10 bg-white/80 p-6 rounded-3xl backdrop-blur-sm border border-black/5 shadow-xl">
              <BarChart3 className="mx-auto text-gold" size={32} />
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink">Interactive Analytics Coming Soon</p>
            </div>
          </div>
        </Card>

        <Card className="p-8 border-none bg-white rounded-[2.5rem] shadow-xl shadow-black/5" title="Quick Actions" description="Fast track management tasks">
          <div className="space-y-4 pt-4">
            <button 
              className="w-full flex items-center gap-5 p-5 rounded-[1.5rem] bg-paper/50 hover:bg-gold/10 border border-transparent hover:border-gold/20 transition-all text-left group"
              onClick={() => navigate('/owner/add-listing')}
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <Plus size={20} className="text-gold" />
              </div>
              <div>
                <p className="font-bold text-ink text-sm">Add New Listing</p>
                <p className="text-[10px] text-ink/40 uppercase tracking-widest mt-1">Publish a property</p>
              </div>
            </button>
            <button 
              className="w-full flex items-center gap-5 p-5 rounded-[1.5rem] bg-paper/50 hover:bg-emerald-50 border border-transparent hover:border-emerald-200 transition-all text-left group"
              onClick={() => navigate('/owner/bookings')}
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <Users size={20} className="text-emerald-500" />
              </div>
              <div>
                <p className="font-bold text-ink text-sm">Review Bookings</p>
                <p className="text-[10px] text-ink/40 uppercase tracking-widest mt-1">Manage applications</p>
              </div>
            </button>
            <button 
              className="w-full flex items-center gap-5 p-5 rounded-[1.5rem] bg-paper/50 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-all text-left group"
              onClick={() => navigate('/owner/student-requests')}
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <MessageSquare size={20} className="text-blue-500" />
              </div>
              <div>
                <p className="font-bold text-ink text-sm">Student Requests</p>
                <p className="text-[10px] text-ink/40 uppercase tracking-widest mt-1">View pending leads</p>
              </div>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

// --- Add New Listing Page ---
export const AddListingForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    price: '',
    roomType: '',
    description: '',
    facilities: [] as string[],
    mapEmbedUrl: '',
    deposit: '',
    utilitiesIncluded: [] as string[]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  const { user } = useAuth();
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Boarding Name is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) < 5000) {
      newErrors.price = 'Valid price is required (minimum $5,000)';
    }
    if (!formData.roomType) newErrors.roomType = 'Room Type is required';
    if (formData.description.length < 10) newErrors.description = 'Description must be at least 10 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!user) {
      alert("You must be logged in as an owner to post a listing.");
      return;
    }

    setIsSubmitting(true);
    try {
      await accommodationService.create({
        ...formData,
        price: Number(formData.price),
        ownerId: user.id,
        ownerName: user.name,
        ownerPhone: user.phone || '0000000000',
        city: formData.location,
        university: 'Any',
        propertyType: 'Boarding House',
        image: previewImages[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
        images: previewImages.length > 0 ? previewImages : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800']
      });
      
      setShowSuccessBanner(true);
      setFormData({
        name: '',
        location: '',
        price: '',
        roomType: '',
        description: '',
        facilities: [] as string[],
        mapEmbedUrl: '',
        deposit: '',
        utilitiesIncluded: [] as string[]
      });
      setPreviewImages([]);
      
      setTimeout(() => {
        setShowSuccessBanner(false);
      }, 5000);
    } catch (err) {
      console.error('Failed to create listing', err);
      alert('Failed to publish listing.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFacility = (facility: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // Convert to an array explicitly typed as File[] to prevent 'unknown' ts errors
    const filesArray = Array.from(files).slice(0, 5 - previewImages.length) as File[];
    
    filesArray.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages(prev => {
          if (prev.length < 5) return [...prev, reader.result as string];
          return prev;
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const toggleUtility = (utility: string) => {
    setFormData(prev => ({
      ...prev,
      utilitiesIncluded: prev.utilitiesIncluded.includes(utility)
        ? prev.utilitiesIncluded.filter(u => u !== utility)
        : [...prev.utilitiesIncluded, utility]
    }));
  };

  const facilitiesList = ['WiFi', 'AC', 'Parking', 'Meals', 'Laundry'];
  const utilitiesList = ['Water', 'Electricity', 'Gas', 'Internet', 'Garbage'];

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <h1 className="text-4xl font-serif text-ink">Add New Listing</h1>
        <p className="text-ink/40 font-medium">Create a compelling listing to attract the best students.</p>
      </div>

      {/* Success Banner */}
      {showSuccessBanner && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-emerald-800">Listing Published Successfully!</h3>
            <p className="text-emerald-600">Your accommodation listing has been published and is now visible to students.</p>
          </div>
          <button
            onClick={() => setShowSuccessBanner(false)}
            className="text-emerald-400 hover:text-emerald-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </motion.div>
      )}

      <div className="space-y-8">
        <form onSubmit={handleSubmit} className="space-y-12">
          
          {/* Group 1: General Info */}
          <Card className="p-8 md:p-12 border-none bg-white rounded-[2.5rem] shadow-xl shadow-black/5 space-y-12">
            <div>
              <h2 className="text-2xl font-serif text-ink mb-2">1. Basic Information</h2>
              <p className="text-ink/60 text-sm font-light">Set the core details for your property listing.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Input 
                  label="Listing Name" 
                  placeholder="e.g. RoyalStudentSuites" 
                  value={formData.name}
                  onChange={e => {
                    const cleanedValue = e.target.value.replace(/[^a-zA-Z0-9 ]/g, '');
                    setFormData({ ...formData, name: cleanedValue });
                  }}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-4">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40 ml-4">Room Configuration</label>
                <select 
                  value={formData.roomType}
                  onChange={e => setFormData({ ...formData, roomType: e.target.value })}
                  className={`flex h-14 w-full rounded-[1.5rem] border border-black/5 bg-paper px-6 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold transition-all duration-300 ${errors.roomType ? 'border-red-500' : ''}`}
                >
                  <option value="">Select Configuration</option>
                  <option value="Single Room">Single Room</option>
                  <option value="Double Room">Double Room</option>
                  <option value="Shared Space">Shared Space</option>
                  <option value="Entire House">Entire House / Apartment</option>
                </select>
                {errors.roomType && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-4">{errors.roomType}</p>}
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40 ml-4">Marketing Overview</label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className={`flex min-h-[120px] w-full rounded-[2rem] border border-black/5 bg-paper px-6 py-4 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold transition-all duration-300 ${errors.description ? 'border-red-500' : ''}`}
                  placeholder="Tell students about the environment, rules, and what makes your place special..."
                />
                {errors.description && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-4">{errors.description}</p>}
              </div>
            </div>
          </Card>

          {/* Group 2: Pricing & Utilities */}
          <Card className="p-8 md:p-12 border-none bg-white rounded-[2.5rem] shadow-xl shadow-black/5 space-y-12">
            <div>
              <h2 className="text-2xl font-serif text-ink mb-2">2. Pricing & Amenities</h2>
              <p className="text-ink/60 text-sm font-light">Provide accurate details to ensure transparent expectations.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Input 
                  label="Monthly Rent (LKR)" 
                  type="number" 
                  placeholder="25000" 
                  value={formData.price}
                  onChange={e => {
                    let numericValue = e.target.value.replace(/[^0-9]/g, '');
                    setFormData({ ...formData, price: numericValue });
                  }}
                  className={errors.price ? 'border-red-500' : ''}
                />
                {errors.price && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-4">{errors.price}</p>}
              </div>
              <div className="space-y-2">
                <Input 
                  label="Advance/Deposit Required" 
                  placeholder="e.g. 2 Months Deposit" 
                  value={formData.deposit}
                  onChange={e => setFormData({ ...formData, deposit: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-6 pt-4 border-t border-black/5">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40 ml-4">Included Utilities (Free of charge)</label>
              <div className="flex flex-wrap gap-3">
                {utilitiesList.map(item => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleUtility(item)}
                    className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border ${
                      formData.utilitiesIncluded.includes(item)
                        ? 'bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-500/20'
                        : 'bg-paper text-ink/60 border-transparent hover:border-black/10'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6 pt-4 border-t border-black/5">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40 ml-4">Property Facilities</label>
              <div className="flex flex-wrap gap-3">
                {facilitiesList.map(facility => (
                  <button
                    key={facility}
                    type="button"
                    onClick={() => toggleFacility(facility)}
                    className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border ${
                      formData.facilities.includes(facility)
                        ? 'bg-ink text-white border-ink shadow-md shadow-ink/20'
                        : 'bg-paper text-ink/60 border-transparent hover:border-black/10'
                    }`}
                  >
                    {facility}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Group 3: Location */}
          <Card className="p-8 md:p-12 border-none bg-white rounded-[2.5rem] shadow-xl shadow-black/5 space-y-12">
            <div>
              <h2 className="text-2xl font-serif text-ink mb-2">3. Location details</h2>
              <p className="text-ink/60 text-sm font-light">Where is this property mapped out for students?</p>
            </div>
            <div className="grid grid-cols-1 gap-8">
              <div className="space-y-2">
                <Input 
                  label="Area / City" 
                  placeholder="e.g. Malabe, Colombo" 
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className={errors.location ? 'border-red-500' : ''}
                />
                {errors.location && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-4">{errors.location}</p>}
              </div>

              <div className="space-y-4 bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100">
                <Input 
                  label="Exact Google Maps URL" 
                  placeholder="Paste URL (e.g. https://maps.app.goo.gl/xxxx or <iframe src=...>)" 
                  value={formData.mapEmbedUrl}
                  onChange={e => {
                    let val = e.target.value;
                    // Attempt to parse out src if they pasted an iframe
                    const srcMatch = val.match(/src="([^"]+)"/);
                    if (srcMatch && srcMatch[1]) {
                      val = srcMatch[1];
                    }
                    setFormData({ ...formData, mapEmbedUrl: val });
                  }}
                />
                <div className="flex gap-4 items-start text-blue-600/60 p-2">
                  <Info size={20} className="flex-shrink-0 mt-0.5" />
                  <p className="text-xs">Optional: Go to Google Maps, find your location, click "Share" &rarr; "Embed a map", and paste the link here to show an exact pin on your listing page.</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Group 4: Media */}
          <Card className="p-8 md:p-12 border-none bg-white rounded-[2.5rem] shadow-xl shadow-black/5 space-y-12">
             <div>
              <h2 className="text-2xl font-serif text-ink mb-2">4. Photos</h2>
              <p className="text-ink/60 text-sm font-light">Upload at least one high quality photo of your property.</p>
            </div>
            <div className="space-y-8">
              <div className="flex justify-between items-center ml-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40">Upload Images</label>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40">{previewImages.length} / 5</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {previewImages.map((img, index) => (
                  <div key={index} className="relative aspect-square rounded-[2rem] border-2 border-transparent bg-paper flex flex-col items-center justify-center overflow-hidden group shadow-md hover:shadow-lg transition-all">
                    <img src={img} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <Button variant="destructive" size="sm" type="button" onClick={() => removeImage(index)} className="rounded-full w-12 h-12 p-0 text-white bg-red-500/90 hover:bg-red-600"><XCircle size={20}/></Button>
                    </div>
                  </div>
                ))}
                
                {previewImages.length < 5 && (
                  <div className="relative aspect-square rounded-[2rem] border-2 border-dashed border-black/10 bg-paper flex flex-col items-center justify-center overflow-hidden group hover:border-gold hover:bg-gold/5 transition-all cursor-pointer">
                    <Upload size={32} className="text-ink/20 mb-3 group-hover:text-gold transition-colors" />
                    <p className="text-[10px] font-bold text-ink/40 uppercase tracking-[0.1em] text-center px-4 group-hover:text-gold transition-colors">Add Photo</p>
                    <input type="file" multiple accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
                  </div>
                )}
                
                {[...Array(Math.max(0, 4 - previewImages.length))].map((_, i) => (
                  <div key={`placeholder-${i}`} className="aspect-square rounded-[2rem] border-2 border-dashed border-black/5 bg-paper/30 flex items-center justify-center text-ink/5">
                    <ImageIcon size={32} />
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-6 pt-6">
            <Button variant="outline" type="button" className="px-10 h-14 rounded-full font-bold">Cancel Overview</Button>
            <Button 
              type="submit" 
              className="px-12 h-14 rounded-full bg-gold hover:bg-gold/90 text-ink font-bold shadow-xl shadow-gold/20 flex items-center gap-2" 
              isLoading={isSubmitting}
            >
              <CheckCircle2 size={20} /> Publish Boarding
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- My Listings Page ---
export const ListingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<any>(null);

  useEffect(() => {
    const fetchListings = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const res = await accommodationService.getByOwner(user.id);
        setListings(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [user]);

  const handleDelete = async () => {
    if (selectedListing) {
      const targetId = selectedListing._id || selectedListing.id;
      try {
        await accommodationService.delete(targetId);
        setListings(prev => prev.filter(l => (l._id || l.id) !== targetId));
        setIsDeleteModalOpen(false);
        setSelectedListing(null);
      } catch (err) {
        console.error("Delete failed", err);
        alert("Failed to delete.");
      }
    }
  };

  const handleEdit = (listing: any) => {
    setSelectedListing(listing);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetId = selectedListing._id || selectedListing.id;
    try {
      const res = await accommodationService.update(targetId, selectedListing);
      setListings(prev => prev.map(l => (l._id || l.id) === targetId ? res.data : l));
      setIsEditModalOpen(false);
      setSelectedListing(null);
      alert('Listing updated successfully!');
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update.");
    }
  };

  return (
    <div className="p-6 md:p-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-serif text-ink">My Listings</h1>
          <p className="text-ink/40 font-medium mt-2">Manage and monitor your property portfolio.</p>
        </div>
        <Button 
          className="rounded-full px-8"
          onClick={() => navigate('/owner/add-listing')}
        >
          <Plus size={20} className="mr-2" />
          Add New Listing
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {listings.map((listing) => (
          <Card key={listing.id} className="p-0 overflow-hidden border-black/5 group hover:shadow-2xl hover:shadow-ink/10 transition-all duration-700 rounded-[2.5rem]">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img src={listing.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" referrerPolicy="no-referrer" />
              <div className={`absolute top-6 right-6 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl bg-emerald-500 text-white`}>
                Available
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-serif text-ink">{listing.name}</h3>
                <div className="flex items-center gap-2 text-ink/40">
                  <MapPin size={14} className="text-gold" />
                  <span className="text-xs font-medium">{listing.city || listing.location}</span>
                </div>
                <div className="flex items-center gap-2 text-ink/40">
                  <DollarSign size={14} className="text-gold" />
                  <span className="text-sm font-bold text-ink">Rs.{listing.price}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">/ month</span>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-6 border-t border-black/5">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEdit(listing)}
                  className="flex-1 rounded-xl h-12 border-black/5 hover:bg-ink hover:text-white transition-all duration-500"
                >
                  <Edit size={16} className="mr-2" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setSelectedListing(listing);
                    setIsDeleteModalOpen(true);
                  }}
                  className="w-12 h-12 p-0 rounded-xl border-black/5 text-red-500 hover:bg-red-50 hover:border-red-100 transition-all duration-500"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Listing"
      >
        {selectedListing && (
          <form onSubmit={handleSaveEdit} className="space-y-6">
            <Input 
              label="Boarding Name" 
              value={selectedListing.name}
              onChange={e => setSelectedListing({ ...selectedListing, name: e.target.value })}
            />
            <Input 
              label="Location" 
              value={selectedListing.location}
              onChange={e => setSelectedListing({ ...selectedListing, location: e.target.value })}
            />
            <Input 
              label="Price" 
              type="number"
              value={selectedListing.price}
              onChange={e => setSelectedListing({ ...selectedListing, price: Number(e.target.value) })}
            />
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40 ml-4">Status</label>
              <select 
                value={selectedListing.status}
                onChange={e => setSelectedListing({ ...selectedListing, status: e.target.value })}
                className="flex h-14 w-full rounded-[1.5rem] border border-black/5 bg-paper px-6 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold transition-all duration-300"
              >
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
              </select>
            </div>
            <div className="flex justify-end gap-4 pt-4">
              <Button variant="outline" type="button" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Listing"
      >
        <div className="space-y-6">
          <p className="text-ink/60">Are you sure you want to delete <span className="font-bold text-ink">{selectedListing?.name}</span>? This action cannot be undone.</p>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete Listing</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// --- Bookings Page ---
export const BookingsPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const res = await bookingService.getByOwner(user.id);
        setBookings(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  const handleStatus = async (id: string, status: string) => {
    try {
      await bookingService.updateStatus(id, status);
      setBookings(prev => prev.map(b => (b._id || b.id) === id ? { ...b, status } : b));
    } catch (err) {
      console.error(err);
      alert("Failed to update status.");
    }
  };

  const handleViewBooking = (booking: any) => {
    setSelectedBooking(booking);
    setIsViewModalOpen(true);
  };

  return (
    <div className="p-6 md:p-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <h1 className="text-4xl font-serif text-ink">Bookings</h1>
        <p className="text-ink/40 font-medium">Manage student applications and resident status.</p>
      </div>

      <Card className="p-0 overflow-hidden border-black/5 rounded-[2.5rem]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-paper/50">
                <th className="py-8 px-8 text-[10px] font-bold text-ink/30 uppercase tracking-[0.2em]">Student</th>
                <th className="py-8 px-8 text-[10px] font-bold text-ink/30 uppercase tracking-[0.2em]">University</th>
                <th className="py-8 px-8 text-[10px] font-bold text-ink/30 uppercase tracking-[0.2em]">Contact</th>
                <th className="py-8 px-8 text-[10px] font-bold text-ink/30 uppercase tracking-[0.2em]">Status</th>
                <th className="py-8 px-8 text-[10px] font-bold text-ink/30 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {bookings.map((booking, idx) => (
                <tr key={booking._id || booking.id || idx} className="group hover:bg-paper transition-colors duration-500">
                  <td className="py-8 px-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-ink text-white flex items-center justify-center font-serif text-lg font-bold">
                        {(booking.fullName || "G").charAt(0)}
                      </div>
                      <p className="text-sm font-bold text-ink">{booking.fullName}</p>
                    </div>
                  </td>
                  <td className="py-8 px-8 text-sm text-ink/60 font-medium">{booking.university}</td>
                  <td className="py-8 px-8 text-sm text-ink/60 font-medium">{booking.contactNo || booking.nationalId}</td>
                  <td className="py-8 px-8">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      booking.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 
                      booking.status === 'Rejected' ? 'bg-red-100 text-red-700' : 
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-8 px-8 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {booking.status === 'Pending' && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => handleStatus(booking._id || booking.id, 'Approved')}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-6"
                          >
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleStatus(booking._id || booking.id, 'Rejected')}
                            className="text-red-500 border-red-100 hover:bg-red-50 rounded-xl px-6"
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="outline" className="w-10 h-10 p-0 rounded-xl border-black/5" onClick={() => handleViewBooking(booking)}>
                        <Eye size={16} className="text-ink/20" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal 
        isOpen={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)}
        title="Student Booking Information"
        maxWidth="2xl"
      >
        {selectedBooking && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6 bg-paper/50 p-6 rounded-[2rem] border border-black/5">
              <div>
                <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">Full Name</p>
                <p className="text-lg font-bold text-ink">{selectedBooking.fullName}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">Student ID</p>
                <p className="text-lg font-bold text-ink">{selectedBooking.studentId}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">National ID (NIC)</p>
                <p className="text-sm font-semibold text-ink/70">{selectedBooking.nationalId}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">Contact / Phone</p>
                <p className="text-sm font-semibold text-ink/70">{selectedBooking.contactNo || 'Not Provided'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">University</p>
                <p className="text-sm font-semibold text-ink/70">{selectedBooking.university}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">Room Type</p>
                <p className="text-sm font-semibold text-ink/70">{selectedBooking.roomType}</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">Payment Proof & slip</p>
              <div className="bg-paper/30 p-4 rounded-3xl border border-black/5 flex justify-center">
                {selectedBooking.paymentProof ? (
                  <img src={selectedBooking.paymentProof} alt="Payment Proof" className="max-h-64 object-contain rounded-xl" />
                ) : (
                  <p className="text-ink/40 italic text-sm py-8">No payment proof uploaded.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-black/5">
              <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// --- Student Requests Page ---
export const RequestsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const res = await bookingService.getByOwner(user.id);
        const pending = res.data.filter((b: any) => b.status === 'Pending');
        setRequests(pending);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingRequests();
  }, [user]);

  return (
    <div className="p-6 md:p-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <h1 className="text-4xl font-serif text-ink">Student Requests</h1>
        <p className="text-ink/40 font-medium">Students looking for accommodation in your area recently.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {requests.map((req) => (
          <Card key={req._id || req.id} className="p-10 border-black/5 hover:shadow-2xl hover:shadow-ink/5 transition-all duration-700 rounded-[2.5rem] space-y-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-[1.5rem] bg-paper flex items-center justify-center text-ink font-serif text-2xl font-bold border border-black/5">
                {(req.fullName || "G").charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-ink">{req.fullName}</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gold text-ellipsis overflow-hidden whitespace-nowrap w-32">Booking Pending</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink/40 font-medium">University</span>
                <span className="font-bold text-ink">{req.university}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink/40 font-medium">Message</span>
                <span className="font-bold text-ink text-right max-w-32 truncate">{req.notes || 'None'}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Button 
                   className="w-full bg-emerald-500 hover:bg-emerald-600 rounded-full" 
                   onClick={() => navigate('/owner/bookings')}
                >
                  Review in Bookings
                </Button>
              </div>
            </div>

            <Button className="w-full rounded-2xl h-14 bg-ink hover:bg-gold hover:text-ink transition-all duration-500">
              Contact Student
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

// --- Reviews & Ratings Page ---
export const ReviewsPage: React.FC = () => {
  const reviews = [
    { id: 1, student: 'Sarah Wilson', rating: 5, comment: 'Amazing place! Very quiet and perfect for studying. The owner is very kind.', date: 'Mar 15, 2026' },
    { id: 2, student: 'James Miller', rating: 4, comment: 'Good facilities and close to the university. WiFi could be a bit faster though.', date: 'Mar 10, 2026' },
    { id: 3, student: 'Anna Garcia', rating: 5, comment: 'Cleanest boarding I have ever stayed in. Highly recommend the single suites.', date: 'Mar 05, 2026' },
  ];

  return (
    <div className="p-6 md:p-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-serif text-ink">Reviews & Ratings</h1>
          <p className="text-ink/40 font-medium">Hear what your residents have to say about their stay.</p>
        </div>
        <Card className="p-8 bg-ink text-white border-none rounded-[2rem] flex items-center gap-8 shadow-2xl shadow-ink/20">
          <div className="text-center">
            <p className="text-5xl font-serif text-gold">4.8</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mt-2">Average Rating</p>
          </div>
          <div className="h-12 w-px bg-white/10" />
          <div className="flex gap-1 text-gold">
            {[1, 2, 3, 4, 5].map(s => <Star key={s} size={20} fill="currentColor" />)}
          </div>
        </Card>
      </div>

      <div className="space-y-8">
        {reviews.map((review) => (
          <Card key={review.id} className="p-10 border-black/5 hover:shadow-2xl hover:shadow-ink/5 transition-all duration-700 rounded-[2.5rem]">
            <div className="flex flex-col md:flex-row justify-between gap-8">
              <div className="space-y-6 flex-1">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-paper flex items-center justify-center text-ink font-serif text-lg font-bold border border-black/5">
                    {review.student.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-ink">{review.student}</h4>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-ink/30">{review.date}</p>
                  </div>
                </div>
                <p className="text-lg text-ink/70 font-serif leading-relaxed italic">"{review.comment}"</p>
              </div>
              <div className="flex items-center gap-1 text-gold h-fit">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} size={16} fill={s <= review.rating ? "currentColor" : "none"} className={s <= review.rating ? "" : "text-ink/10"} />
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// --- Owner Profile Page ---
export const OwnerProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Robert Fox',
    email: 'robert.fox@boarding.com',
    phone: '0771234567',
    boardingName: 'Royal Student Suites'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email || !formData.email.includes('@')) newErrors.email = 'Valid email is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone must be exactly 10 digits';
    if (!formData.boardingName) newErrors.boardingName = 'Boarding Name is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      setIsEditing(false);
      alert('Profile updated successfully!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div className="space-y-4">
          <h1 className="text-4xl font-serif text-ink">Owner Profile</h1>
          <p className="text-ink/40 font-medium">Manage your personal information and business details.</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="outline" className="rounded-full px-8">
            <Edit size={18} className="mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-8">
          <Card className="p-10 text-center space-y-6 rounded-[3rem] border-black/5 shadow-2xl shadow-ink/5">
            <div className="relative w-32 h-32 mx-auto">
              <div className="w-full h-full rounded-full bg-ink text-white flex items-center justify-center font-serif text-4xl font-bold shadow-2xl shadow-ink/20">
                {formData.name.charAt(0)}
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-gold text-ink rounded-full flex items-center justify-center border-4 border-white hover:scale-110 transition-transform">
                  <Upload size={16} />
                </button>
              )}
            </div>
            <div>
              <h3 className="text-2xl font-serif text-ink">{formData.name}</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gold mt-1">Verified Boarding Owner</p>
            </div>
            <div className="pt-6 border-t border-black/5 space-y-4">
              <div className="flex items-center gap-4 text-ink/40">
                <Mail size={16} className="text-gold" />
                <span className="text-xs font-medium">{formData.email}</span>
              </div>
              <div className="flex items-center gap-4 text-ink/40">
                <Phone size={16} className="text-gold" />
                <span className="text-xs font-medium">{formData.phone}</span>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-paper/50 border-dashed border-black/10 rounded-[2rem] space-y-4">
            <div className="flex items-center gap-3 text-ink/40">
              <Info size={16} />
              <p className="text-[10px] font-bold uppercase tracking-widest">Account Status</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-ink">Identity Verified</span>
              <CheckCircle2 size={18} className="text-emerald-500" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-ink">Business Registered</span>
              <CheckCircle2 size={18} className="text-emerald-500" />
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="p-12 border-black/5 shadow-2xl shadow-ink/5 rounded-[3rem]">
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Input 
                    label="Full Name" 
                    value={formData.name}
                    disabled={!isEditing}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-4">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Input 
                    label="Email Address" 
                    value={formData.email}
                    disabled={!isEditing}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-4">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Input 
                    label="Phone Number" 
                    type="text"
                    value={formData.phone}
                    disabled={!isEditing}
                    onChange={e => setFormData({ ...formData, phone: sanitizePhoneNumber(e.target.value) })}
                    maxLength={10}
                    className={errors.phone ? 'border-red-500' : formData.phone ? 'border-green-500' : ''}
                  />
                  {errors.phone && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-4">{errors.phone}</p>}
                </div>
                <div className="space-y-2">
                  <Input 
                    label="Primary Boarding Name" 
                    value={formData.boardingName}
                    disabled={!isEditing}
                    onChange={e => {
                      // Only allow letters and numbers, no special characters or spaces
                      const cleanedValue = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
                      setFormData({ ...formData, boardingName: cleanedValue });
                    }}
                    className={errors.boardingName ? 'border-red-500' : ''}
                  />
                  {errors.boardingName && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-4">{errors.boardingName}</p>}
                  {isEditing && <p className="text-[10px] text-ink/40 ml-4">Only letters and numbers allowed (no spaces or special characters)</p>}
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-6 pt-10 border-t border-black/5">
                  <Button variant="outline" onClick={() => setIsEditing(false)} className="px-12 rounded-full">Cancel</Button>
                  <Button onClick={handleSave} className="px-12 rounded-full">Save Changes</Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
