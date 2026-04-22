import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Input, Modal, Badge } from '../components/UI';
import { motion } from 'motion/react';
import { 
  Plus, Edit, Trash2, Utensils, ShoppingBag, Star, 
  Upload, Clock, MapPin, Eye, CheckCircle2, Building2,
  ChevronRight, DollarSign, Package, TrendingUp, AlertTriangle
} from 'lucide-react';
import { restaurantService } from '../services/api';
import { compressImage } from '../lib/inputControl';

// ─── Dashboard Overview ────────────────────────────────────────────
export const RestaurantOwnerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cafes, setCafes] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cafesRes, ordersRes] = await Promise.all([
        restaurantService.getCanteensByOwner(user!.id),
        restaurantService.getOrdersByOwner(user!.id),
      ]);
      setCafes(Array.isArray(cafesRes.data) ? cafesRes.data : []);
      setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderStatus = async (id: string, status: string) => {
    try {
      await restaurantService.updateOrderStatus(id, status);
      setOrders(prev => prev.map(o => (o._id || o.id) === id ? { ...o, status } : o));
    } catch (err) {
      console.error(err);
    }
  };

  const pendingOrders = orders.filter(o => o.status === 'Pending');
  const preparingOrders = orders.filter(o => o.status === 'Preparing');

  const stats = [
    { label: 'My Cafes', value: cafes.length, icon: <Building2 className="text-indigo-500" />, color: 'bg-indigo-50' },
    { label: 'Total Orders', value: orders.length, icon: <ShoppingBag className="text-amber-500" />, color: 'bg-amber-50' },
    { label: 'Pending', value: pendingOrders.length, icon: <Clock className="text-red-400" />, color: 'bg-red-50' },
    { label: 'Preparing', value: preparingOrders.length, icon: <Utensils className="text-emerald-500" />, color: 'bg-emerald-50' },
  ];

  return (
    <div className="p-6 md:p-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Administrative Warning Banner */}
      {user && user.warning > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-[2.5rem] bg-amber-50 border border-amber-200 shadow-xl shadow-amber-500/5 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="w-16 h-16 rounded-3xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 shrink-0">
            <AlertTriangle size={32} />
          </div>
          <div className="flex-1 space-y-2 text-center md:text-left">
            <h3 className="text-xl font-serif text-amber-900 flex items-center justify-center md:justify-start gap-3">
              Official System Warning
              <Badge className="bg-amber-100 text-amber-600 border-amber-200">Level {user.warning}</Badge>
            </h3>
            <p className="text-amber-800/70 font-medium">
              Admin Note: <span className="text-amber-900 italic">"{user.warningNote || "Please ensure your menu items and prices are up to date."}"</span>
            </p>
          </div>
          <Button variant="outline" className="rounded-xl border-amber-200 text-amber-700 hover:bg-amber-100 shadow-sm shrink-0">
            Acknowledge
          </Button>
        </motion.div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-serif text-ink">Restaurant Dashboard</h1>
          <p className="text-ink/40 font-medium mt-2">Manage your cafes, menus, and track student orders.</p>
        </div>
        <Button className="rounded-full px-8" onClick={() => navigate('/restaurant/my-restaurant')}>
          <Plus size={20} className="mr-2" />
          Add New Cafe
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-8 border-black/5 hover:shadow-2xl hover:shadow-ink/5 transition-all duration-500 group">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40">{stat.label}</p>
                <p className="text-3xl font-bold text-ink mt-1">{loading ? '…' : stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card className="p-0 overflow-hidden border-black/5 rounded-[2.5rem]">
        <div className="p-8 border-b border-black/5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif text-ink">Recent Orders</h2>
            <p className="text-sm text-ink/40 mt-1">Manage and update student order status</p>
          </div>
          <Button variant="outline" className="rounded-full px-6" onClick={() => navigate('/restaurant/orders')}>
            View All
          </Button>
        </div>
        <div className="divide-y divide-black/5">
          {loading ? (
            <p className="text-center py-12 text-ink/30 font-medium">Loading orders...</p>
          ) : orders.slice(0, 5).length === 0 ? (
            <p className="text-center py-12 text-ink/30 font-medium">No orders yet.</p>
          ) : orders.slice(0, 5).map((order) => (
            <div key={order._id || order.id} className="px-8 py-6 flex items-center justify-between group hover:bg-paper/50 transition-colors">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-paper flex items-center justify-center text-ink font-serif font-bold text-lg border border-black/5">
                  {(order.studentName || 'S').charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-ink">{order.studentName}</p>
                  <p className="text-[10px] text-ink/40 font-bold uppercase tracking-widest">{order.canteenName} · {order.items?.length} item(s) · Rs. {order.totalPrice}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                  order.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                  order.status === 'Preparing' ? 'bg-blue-100 text-blue-700' :
                  order.status === 'Ready' ? 'bg-emerald-100 text-emerald-700' :
                  'bg-paper text-ink/40'
                }`}>
                  {order.status}
                </span>
                {order.status === 'Pending' && (
                  <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-5" onClick={() => handleOrderStatus(order._id || order.id, 'Preparing')}>
                    Accept
                  </Button>
                )}
                {order.status === 'Preparing' && (
                  <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-5" onClick={() => handleOrderStatus(order._id || order.id, 'Ready')}>
                    Mark Ready
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};


// ─── My Cafes (Multi-branch) ───────────────────────────────────────
export const MyRestaurantPage: React.FC = () => {
  const { user } = useAuth();
  const [cafes, setCafes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCafe, setSelectedCafe] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '', location: '', university: '', description: '', contactNo: '', image: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) fetchCafes();
  }, [user]);

  const fetchCafes = async () => {
    try {
      setLoading(true);
      const res = await restaurantService.getCanteensByOwner(user!.id);
      setCafes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const validate = (data: any) => {
    const newErrors: Record<string, string> = {};
    if (!data.name || data.name.length < 3) newErrors.name = 'Name must be at least 3 characters';
    if (!data.location) newErrors.location = 'Location is required';
    if (!data.university) newErrors.university = 'University is required';
    if (!data.description || data.description.length < 10) newErrors.description = 'Description must be at least 10 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const result = reader.result as string;
        const compressed = await compressImage(result);
        setPreviewImage(compressed);
        setFormData(prev => ({ ...prev, image: compressed }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(formData)) return;
    try {
      await restaurantService.createCanteen({ ...formData, ownerId: user!.id });
      await fetchCafes();
      setIsAddModalOpen(false);
      setFormData({ name: '', location: '', university: '', description: '', contactNo: '', image: '' });
      setPreviewImage(null);
    } catch (err: any) {
      alert('Error creating cafe: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(selectedCafe)) return;
    try {
      await restaurantService.updateCanteen(selectedCafe._id || selectedCafe.id, selectedCafe);
      await fetchCafes();
      setIsEditModalOpen(false);
      setSelectedCafe(null);
    } catch (err: any) {
      alert('Error updating cafe: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this cafe and all its menus?')) return;
    try {
      await restaurantService.deleteCanteen(id);
      setCafes(prev => prev.filter(c => (c._id || c.id) !== id));
    } catch (err: any) {
      alert('Error deleting cafe: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="p-6 md:p-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-serif text-ink">My Cafes</h1>
          <p className="text-ink/40 font-medium mt-2">Register and manage your cafe branches.</p>
        </div>
        <Button className="rounded-full px-8" onClick={() => { setFormData({ name: '', location: '', university: '', description: '', contactNo: '', image: '' }); setPreviewImage(null); setErrors({}); setIsAddModalOpen(true); }}>
          <Plus size={20} className="mr-2" />
          Add New Cafe
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3].map(i => <div key={i} className="aspect-[4/3] bg-paper animate-pulse rounded-[2.5rem]" />)}
        </div>
      ) : cafes.length === 0 ? (
        <div className="text-center py-24 bg-paper/50 rounded-[3rem] border border-black/5">
          <Building2 size={48} className="text-ink/20 mx-auto mb-6" />
          <h2 className="text-2xl font-serif text-ink mb-2">No cafes registered yet</h2>
          <p className="text-ink/40 mb-8">Add your first cafe branch to get started.</p>
          <Button className="rounded-full px-10" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={18} className="mr-2" /> Register First Cafe
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cafes.map(cafe => (
            <motion.div
              key={cafe._id || cafe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group bg-white rounded-[2.5rem] border border-black/5 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={cafe.image}
                  alt={cafe.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-paper/90 text-ink backdrop-blur-sm">
                    {cafe.university}
                  </span>
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <h3 className="text-2xl font-serif text-ink">{cafe.name}</h3>
                  <div className="flex items-center gap-2 mt-2 text-ink/40 text-[10px] font-bold uppercase tracking-widest">
                    <MapPin size={12} className="text-gold" />
                    {cafe.location}
                  </div>
                  {cafe.contactNo && (
                    <p className="text-xs text-ink/50 mt-1 font-medium">{cafe.contactNo}</p>
                  )}
                </div>
                <p className="text-sm text-ink/60 line-clamp-2">{cafe.description}</p>
                <div className="flex gap-3 pt-4 border-t border-black/5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setSelectedCafe({ ...cafe }); setIsEditModalOpen(true); setErrors({}); }}
                    className="flex-1 rounded-xl h-11 border-black/5 hover:bg-ink hover:text-white transition-all"
                  >
                    <Edit size={15} className="mr-2" /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(cafe._id || cafe.id)}
                    className="w-11 h-11 p-0 rounded-xl border-black/5 text-red-400 hover:bg-red-50 hover:border-red-100 transition-all"
                  >
                    <Trash2 size={15} />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Cafe Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Cafe Branch" maxWidth="2xl">
        <form onSubmit={handleAdd} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Input label="Cafe Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className={errors.name ? 'border-red-500' : ''} />
              {errors.name && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest ml-4">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Input label="Location" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className={errors.location ? 'border-red-500' : ''} />
              {errors.location && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest ml-4">{errors.location}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40 ml-4">University</label>
              <select
                value={formData.university}
                onChange={e => setFormData({ ...formData, university: e.target.value })}
                className={`flex h-14 w-full rounded-[1.5rem] border ${errors.university ? 'border-red-500' : 'border-black/5'} bg-paper px-6 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold transition-all`}
              >
                <option value="">Select University</option>
                <option value="SLIIT">SLIIT</option>
                <option value="NSBM">NSBM</option>
                <option value="IIT">IIT</option>
                <option value="CINEC">CINEC</option>
                <option value="Other">Other</option>
              </select>
              {errors.university && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest ml-4">{errors.university}</p>}
            </div>
            <div className="space-y-2">
              <Input label="Contact No. (Optional)" value={formData.contactNo} onChange={e => setFormData({ ...formData, contactNo: e.target.value })} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40 ml-4">Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className={`flex min-h-[100px] w-full rounded-[2rem] border ${errors.description ? 'border-red-500' : 'border-black/5'} bg-paper px-6 py-4 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold transition-all resize-none`}
              placeholder="Describe your cafe..."
            />
            {errors.description && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest ml-4">{errors.description}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40 ml-4">Cafe Photo</label>
            <div className="relative h-40 rounded-[2rem] border-2 border-dashed border-black/5 bg-paper flex flex-col items-center justify-center overflow-hidden group hover:border-gold hover:bg-gold/5 transition-all cursor-pointer">
              {previewImage ? (
                <>
                  <img src={previewImage} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary" size="sm" type="button" onClick={() => { setPreviewImage(null); setFormData(prev => ({ ...prev, image: '' })); }}>Change</Button>
                  </div>
                </>
              ) : (
                <>
                  <Upload size={24} className="text-ink/20 mb-2" />
                  <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">Upload Cafe Photo</p>
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
                </>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)} className="rounded-full">Cancel</Button>
            <Button type="submit" className="rounded-full px-10">Create Cafe</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Cafe Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Cafe Branch" maxWidth="2xl">
        {selectedCafe && (
          <form onSubmit={handleEdit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Input label="Cafe Name" value={selectedCafe.name} onChange={e => setSelectedCafe({ ...selectedCafe, name: e.target.value })} className={errors.name ? 'border-red-500' : ''} />
                {errors.name && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest ml-4">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Input label="Location" value={selectedCafe.location} onChange={e => setSelectedCafe({ ...selectedCafe, location: e.target.value })} className={errors.location ? 'border-red-500' : ''} />
                {errors.location && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest ml-4">{errors.location}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40 ml-4">University</label>
                <select
                  value={selectedCafe.university}
                  onChange={e => setSelectedCafe({ ...selectedCafe, university: e.target.value })}
                  className="flex h-14 w-full rounded-[1.5rem] border border-black/5 bg-paper px-6 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold transition-all"
                >
                  <option value="SLIIT">SLIIT</option>
                  <option value="NSBM">NSBM</option>
                  <option value="IIT">IIT</option>
                  <option value="CINEC">CINEC</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Input label="Contact No." value={selectedCafe.contactNo || ''} onChange={e => setSelectedCafe({ ...selectedCafe, contactNo: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40 ml-4">Description</label>
              <textarea
                value={selectedCafe.description}
                onChange={e => setSelectedCafe({ ...selectedCafe, description: e.target.value })}
                className={`flex min-h-[100px] w-full rounded-[2rem] border ${errors.description ? 'border-red-500' : 'border-black/5'} bg-paper px-6 py-4 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold transition-all resize-none`}
              />
              {errors.description && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest ml-4">{errors.description}</p>}
            </div>
            <div className="flex justify-end gap-4 pt-4">
              <Button variant="outline" type="button" onClick={() => setIsEditModalOpen(false)} className="rounded-full">Cancel</Button>
              <Button type="submit" className="rounded-full px-10">Save Changes</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};


// ─── Manage Menu ────────────────────────────────────────────────────
export const ManageMenu: React.FC = () => {
  const { user } = useAuth();
  const [cafes, setCafes] = useState<any[]>([]);
  const [selectedCafeId, setSelectedCafeId] = useState<string>('');
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '', price: '', category: '', description: '', image: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) fetchCafes();
  }, [user]);

  useEffect(() => {
    if (selectedCafeId) fetchMenu(selectedCafeId);
    else setMenuItems([]);
  }, [selectedCafeId]);

  const fetchCafes = async () => {
    try {
      const res = await restaurantService.getCanteensByOwner(user!.id);
      const data = Array.isArray(res.data) ? res.data : [];
      setCafes(data);
      if (data.length > 0 && !selectedCafeId) setSelectedCafeId(data[0]._id || data[0].id);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMenu = async (canteenId: string) => {
    try {
      setLoadingMenu(true);
      const res = await restaurantService.getMenu(canteenId);
      setMenuItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMenu(false);
    }
  };

  const validate = (data: any) => {
    const newErrors: Record<string, string> = {};
    if (!data.name) newErrors.name = 'Name is required';
    if (!data.price || isNaN(Number(data.price))) newErrors.price = 'Valid price is required';
    if (!data.category) newErrors.category = 'Category is required';
    if (!data.description || data.description.length < 5) newErrors.description = 'Description must be at least 5 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const result = reader.result as string;
        const compressed = await compressImage(result);
        setPreviewImage(compressed);
        if (isEdit) setSelectedItem((prev: any) => ({ ...prev, image: compressed }));
        else setFormData(prev => ({ ...prev, image: compressed }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(formData) || !selectedCafeId) return;
    try {
      await restaurantService.createMenuItem(selectedCafeId, {
        ...formData,
        price: Number(formData.price),
        image: formData.image || 'https://picsum.photos/seed/food/400/300',
      });
      await fetchMenu(selectedCafeId);
      setIsAddModalOpen(false);
      setFormData({ name: '', price: '', category: '', description: '', image: '' });
      setPreviewImage(null);
    } catch (err: any) {
      alert('Error adding item: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(selectedItem)) return;
    try {
      await restaurantService.updateMenuItem(selectedItem._id || selectedItem.id, {
        ...selectedItem,
        price: Number(selectedItem.price),
      });
      await fetchMenu(selectedCafeId);
      setIsEditModalOpen(false);
      setSelectedItem(null);
      setPreviewImage(null);
    } catch (err: any) {
      alert('Error updating item: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this menu item?')) return;
    try {
      await restaurantService.deleteMenuItem(id);
      setMenuItems(prev => prev.filter(item => (item._id || item.id) !== id));
    } catch (err: any) {
      alert('Error deleting item: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleToggleStatus = async (item: any) => {
    const newStatus = item.status === 'Available' ? 'Not Available' : 'Available';
    try {
      await restaurantService.updateMenuItem(item._id || item.id, { status: newStatus });
      setMenuItems(prev => prev.map(i => (i._id || i.id) === (item._id || item.id) ? { ...i, status: newStatus } : i));
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (item: any) => {
    setSelectedItem({ ...item });
    setPreviewImage(item.image || null);
    setErrors({});
    setIsEditModalOpen(true);
  };

  const categories = ['Rice', 'Noodles', 'Short Eats', 'Drinks', 'Desserts', 'Snacks', 'Burgers', 'Other'];

  return (
    <div className="p-6 md:p-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-serif text-ink">Menu Management</h1>
          <p className="text-ink/40 font-medium mt-2">Add, edit, or update availability of your food items.</p>
        </div>
        <Button className="rounded-full px-8" onClick={() => { setFormData({ name: '', price: '', category: '', description: '', image: '' }); setPreviewImage(null); setErrors({}); setIsAddModalOpen(true); }} disabled={!selectedCafeId}>
          <Plus size={20} className="mr-2" />
          Add Food Item
        </Button>
      </div>

      {/* Cafe Selector */}
      {cafes.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {cafes.map(cafe => (
            <button
              key={cafe._id || cafe.id}
              onClick={() => setSelectedCafeId(cafe._id || cafe.id)}
              className={`px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                selectedCafeId === (cafe._id || cafe.id) ? 'bg-ink text-white' : 'bg-paper text-ink/60 hover:bg-ink/10'
              }`}
            >
              {cafe.name}
            </button>
          ))}
        </div>
      )}

      {cafes.length === 0 ? (
        <div className="text-center py-20 bg-paper/50 rounded-[3rem] border border-black/5">
          <Utensils size={40} className="text-ink/20 mx-auto mb-4" />
          <p className="text-ink/40 font-medium">You need to register a cafe first before adding menu items.</p>
        </div>
      ) : loadingMenu ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3].map(i => <div key={i} className="aspect-[4/3] bg-paper animate-pulse rounded-[2.5rem]" />)}
        </div>
      ) : menuItems.length === 0 ? (
        <div className="text-center py-20 bg-paper/50 rounded-[3rem] border border-black/5">
          <Package size={40} className="text-ink/20 mx-auto mb-4" />
          <p className="text-ink/40 font-medium">No items yet. Add your first menu item!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {menuItems.map(item => (
            <Card key={item._id || item.id} className="p-0 overflow-hidden border-black/5 group hover:shadow-2xl hover:shadow-ink/10 transition-all duration-700 rounded-[2.5rem]">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={item.image || 'https://picsum.photos/seed/food/400/300'}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <button
                  onClick={() => handleToggleStatus(item)}
                  className={`absolute top-6 right-6 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl cursor-pointer transition-colors ${
                    item.status === 'Available' ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-ink/60 text-white backdrop-blur-md hover:bg-ink/80'
                  }`}
                >
                  {item.status || 'Available'}
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif text-ink">{item.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-paper rounded-full text-[10px] font-bold uppercase tracking-widest text-ink/60 border border-black/5">
                      {item.category}
                    </span>
                    <div className="flex items-center gap-1 text-ink">
                      <DollarSign size={14} className="text-gold" />
                      <span className="text-lg font-bold">Rs. {Number(item.price).toLocaleString()}</span>
                    </div>
                  </div>
                  <p className="text-sm text-ink/50 line-clamp-2">{item.description}</p>
                </div>
                <div className="flex items-center gap-3 pt-6 border-t border-black/5">
                  <Button variant="outline" size="sm" onClick={() => openEditModal(item)} className="flex-1 rounded-xl h-12 border-black/5 hover:bg-ink hover:text-white transition-all duration-500">
                    <Edit size={16} className="mr-2" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(item._id || item.id)} className="w-12 h-12 p-0 rounded-xl border-black/5 text-red-500 hover:bg-red-50 hover:border-red-100 transition-all duration-500">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Menu Item Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Menu Item">
        <form onSubmit={handleAddSubmit} className="space-y-6">
          <div className="space-y-2">
            <Input label="Food Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className={errors.name ? 'border-red-500' : ''} />
            {errors.name && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-4">{errors.name}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Input label="Price (Rs.)" type="number" step="1" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className={errors.price ? 'border-red-500' : ''} />
              {errors.price && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-4">{errors.price}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40 ml-4">Category</label>
              <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className={`flex h-14 w-full rounded-[1.5rem] border ${errors.category ? 'border-red-500' : 'border-black/5'} bg-paper px-6 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold transition-all`}>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-4">{errors.category}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40 ml-4">Description</label>
            <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className={`flex min-h-[100px] w-full rounded-[2rem] border ${errors.description ? 'border-red-500' : 'border-black/5'} bg-paper px-6 py-4 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold transition-all resize-none`} />
            {errors.description && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-4">{errors.description}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40 ml-4">Food Photo (Optional)</label>
            <div className="relative h-32 rounded-[2rem] border-2 border-dashed border-black/5 bg-paper flex flex-col items-center justify-center overflow-hidden group hover:border-gold hover:bg-gold/5 transition-all cursor-pointer">
              {previewImage ? (
                <>
                  <img src={previewImage} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary" size="sm" type="button" onClick={() => setPreviewImage(null)}>Change</Button>
                  </div>
                </>
              ) : (
                <>
                  <Upload size={24} className="text-ink/20 mb-2" />
                  <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">Upload Food Photo</p>
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageChange(e)} />
                </>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)} className="rounded-full">Cancel</Button>
            <Button type="submit" className="rounded-full">Add Item</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Menu Item Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Menu Item">
        {selectedItem && (
          <form onSubmit={handleEditSubmit} className="space-y-6">
            <div className="space-y-2">
              <Input label="Food Name" value={selectedItem.name} onChange={e => setSelectedItem({ ...selectedItem, name: e.target.value })} className={errors.name ? 'border-red-500' : ''} />
              {errors.name && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-4">{errors.name}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input label="Price (Rs.)" type="number" step="1" value={selectedItem.price} onChange={e => setSelectedItem({ ...selectedItem, price: e.target.value })} className={errors.price ? 'border-red-500' : ''} />
                {errors.price && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-4">{errors.price}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40 ml-4">Category</label>
                <select value={selectedItem.category} onChange={e => setSelectedItem({ ...selectedItem, category: e.target.value })} className="flex h-14 w-full rounded-[1.5rem] border border-black/5 bg-paper px-6 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold transition-all">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40 ml-4">Description</label>
              <textarea value={selectedItem.description} onChange={e => setSelectedItem({ ...selectedItem, description: e.target.value })} className="flex min-h-[100px] w-full rounded-[2rem] border border-black/5 bg-paper px-6 py-4 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold transition-all resize-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40 ml-4">Update Photo (Optional)</label>
              <div className="relative h-32 rounded-[2rem] border-2 border-dashed border-black/5 bg-paper flex flex-col items-center justify-center overflow-hidden group hover:border-gold hover:bg-gold/5 transition-all cursor-pointer">
                {previewImage ? (
                  <>
                    <img src={previewImage} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="secondary" size="sm" type="button" onClick={() => { setPreviewImage(null); setSelectedItem((prev: any) => ({ ...prev, image: '' })); }}>Change</Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload size={24} className="text-ink/20 mb-2" />
                    <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">Upload New Photo</p>
                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageChange(e, true)} />
                  </>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-4 pt-4">
              <Button variant="outline" type="button" onClick={() => setIsEditModalOpen(false)} className="rounded-full">Cancel</Button>
              <Button type="submit" className="rounded-full">Save Changes</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};


// ─── Orders Page ────────────────────────────────────────────────────
export const RestaurantOrders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewOrder, setViewOrder] = useState<any>(null);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await restaurantService.getOrdersByOwner(user!.id);
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (id: string, status: string) => {
    try {
      await restaurantService.updateOrderStatus(id, status);
      setOrders(prev => prev.map(o => (o._id || o.id) === id ? { ...o, status } : o));
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewOrder = async (orderId: string) => {
    try {
      setIsViewModalOpen(true);
      setLoadingOrder(true);
      const res = await restaurantService.getOrderById(orderId);
      setViewOrder(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load order details.");
    } finally {
      setLoadingOrder(false);
    }
  };

  const statusFlow = ['Pending', 'Preparing', 'Ready', 'Collected'];

  return (
    <div className="p-6 md:p-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-4xl font-serif text-ink">Orders</h1>
        <p className="text-ink/40 font-medium mt-2">Real-time student meal orders across all your cafes.</p>
      </div>

      {loading ? (
        <p className="text-ink/40">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-24 bg-paper/50 rounded-[3rem] border border-black/5">
          <ShoppingBag size={48} className="text-ink/20 mx-auto mb-6" />
          <h2 className="text-2xl font-serif text-ink">No orders yet</h2>
          <p className="text-ink/40 mt-2">Orders will appear here once students place them.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {orders.map(order => (
            <Card key={order._id || order.id} className="p-8 border-black/5 hover:shadow-2xl hover:shadow-ink/5 transition-all duration-700 rounded-[2.5rem] space-y-6">
              <div className="flex items-center justify-between border-b border-black/5 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-ink">#{(order._id || order.id)?.slice(-6).toUpperCase()}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-ink/40 mt-1">{order.canteenName}</p>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                  order.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                  order.status === 'Preparing' ? 'bg-blue-100 text-blue-700' :
                  order.status === 'Ready' ? 'bg-emerald-100 text-emerald-700' :
                  'bg-paper text-ink/40'
                }`}>
                  {order.status}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-paper flex items-center justify-center text-ink font-serif font-bold border border-black/5">
                    {(order.studentName || 'S').charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-ink">{order.studentName}</p>
                    <p className="text-[10px] text-ink/40 font-bold uppercase tracking-widest">{order.studentUniversity} · {order.studentYear} Year</p>
                  </div>
                </div>
                <div className="text-xs text-ink/60 font-medium">
                  ID: {order.studentIdNumber} &nbsp;|&nbsp; {order.studentPhone}
                </div>

                <div className="bg-paper/50 p-4 rounded-2xl border border-black/5 space-y-1">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-ink/70">{item.quantity}× {item.name}</span>
                      <span className="font-bold text-ink">Rs. {item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-3 mt-2 border-t border-black/5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Total</span>
                    <span className="text-base font-bold text-ink">Rs. {order.totalPrice}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleViewOrder(order._id || order.id)}
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold hover:text-gold/80 transition-all flex items-center gap-2"
                >
                  <Eye size={12} /> View Details & ID Proof
                </button>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                {order.status === 'Pending' && (
                  <Button className="w-full rounded-xl h-12 bg-ink hover:bg-gold hover:text-ink transition-all" onClick={() => handleStatus(order._id || order.id, 'Preparing')}>
                    Accept & Prepare
                  </Button>
                )}
                {order.status === 'Preparing' && (
                  <Button className="w-full rounded-xl h-12 bg-blue-500 hover:bg-blue-600 text-white" onClick={() => handleStatus(order._id || order.id, 'Ready')}>
                    Mark as Ready
                  </Button>
                )}
                {order.status === 'Ready' && (
                  <Button variant="outline" className="w-full rounded-xl h-12 border-emerald-200 text-emerald-600 hover:bg-emerald-50" onClick={() => handleStatus(order._id || order.id, 'Collected')}>
                    Order Collected
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      <Modal 
        isOpen={isViewModalOpen} 
        onClose={() => {
          setIsViewModalOpen(false);
          setViewOrder(null);
        }}
        title="Order Details & Verification"
        maxWidth="2xl"
      >
        {loadingOrder ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Fetching secure details...</p>
          </div>
        ) : viewOrder ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-2 gap-6 bg-paper/50 p-6 rounded-[2rem] border border-black/5">
              <div>
                <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">Student Name</p>
                <p className="text-lg font-bold text-ink">{viewOrder.studentName}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">Student ID</p>
                <p className="text-lg font-bold text-ink">{viewOrder.studentIdNumber}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">University</p>
                <p className="text-sm font-semibold text-ink/70">{viewOrder.studentUniversity}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">Contact</p>
                <p className="text-sm font-semibold text-ink/70">{viewOrder.studentPhone}</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">Verification Document</p>
              <div className="bg-paper/30 p-4 rounded-3xl border border-black/5 flex justify-center">
                {viewOrder.identityProof ? (
                  <img src={viewOrder.identityProof} alt="Identity Proof" className="max-h-80 object-contain rounded-xl shadow-lg" />
                ) : (
                  <p className="text-ink/40 italic text-sm py-8">No identity proof provided with this order.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-black/5">
              <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};


// ─── Reviews (Static) ────────────────────────────────────────────
export const RestaurantReviews: React.FC = () => {
  const reviews = [
    { id: 1, user: 'Amara Silva', rating: 5, comment: 'Amazing food! The rice and curry is a must-try.', date: '2 days ago', verified: true },
    { id: 2, user: 'Kasun Perera', rating: 4, comment: 'Good food, but prep time was a bit longer than expected.', date: '1 week ago', verified: true },
    { id: 3, user: 'Nimali Fernando', rating: 5, comment: 'Best kottu around campus. Highly recommended!', date: '2 weeks ago', verified: true },
  ];

  return (
    <div className="p-6 md:p-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-4xl font-serif text-ink">Reviews & Ratings</h1>
        <p className="text-ink/40 font-medium mt-2">See what students think about your food.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="p-8 border-black/5 shadow-2xl shadow-ink/5 rounded-[2.5rem] md:col-span-1 flex flex-col items-center justify-center text-center space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40">Average Rating</p>
          <p className="text-6xl font-serif text-ink">4.7</p>
          <div className="flex items-center gap-1 text-gold">
            {[1,2,3,4,5].map(s => <Star key={s} size={24} fill={s <= 4 ? "currentColor" : "none"} />)}
          </div>
          <p className="text-sm font-bold text-ink/60 mt-4">Based on 128 reviews</p>
        </Card>
        <div className="md:col-span-2 space-y-6">
          {reviews.map(review => (
            <Card key={review.id} className="p-8 border-black/5 hover:shadow-xl hover:shadow-ink/5 transition-all duration-500 rounded-[2rem] space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-paper flex items-center justify-center text-ink font-serif font-bold border border-black/5">
                    {review.user.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-ink">{review.user}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1 text-gold">
                        {[1,2,3,4,5].map(s => <Star key={s} size={12} fill={s <= review.rating ? "currentColor" : "none"} />)}
                      </div>
                      {review.verified && (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[8px] font-bold uppercase tracking-widest">Verified Order</span>
                      )}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40">{review.date}</span>
              </div>
              <div className="bg-paper/50 p-4 rounded-2xl border border-black/5">
                <p className="text-sm text-ink/80 leading-relaxed italic">"{review.comment}"</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};


// ─── Owner Profile ────────────────────────────────────────────────
export const RestaurantPublicProfile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
  });

  const handleSave = () => {
    setIsEditing(false);
    alert('Profile updated!');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-serif text-ink">Owner Profile</h1>
          <p className="text-ink/40 font-medium mt-2">Manage your personal account information.</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="outline" className="rounded-full px-8">
            <Edit size={18} className="mr-2" />
            Edit Profile
          </Button>
        )}
      </div>
      <Card className="p-12 border-black/5 shadow-2xl shadow-ink/5 rounded-[3rem]">
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Input label="Full Name" value={formData.name} disabled={!isEditing} onChange={e => {
                // Allow only letters (a-z, A-Z) and spaces
                // This regex removes anything that ISN'T a letter or space
                const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                setFormData({ ...formData, name: value });
                }} 
              />
            </div>
            <div className="space-y-2">
              <Input label="Email" value={formData.email} disabled={!isEditing} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Input label="Phone Number" value={formData.phone} disabled={!isEditing} onChange={e => {
              // Strips non-numeric characters and limits to 10 digits
              const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 10) {
                  setFormData({ ...formData, phone: value });
                }
              }} 
              />
            </div>
            <div className="space-y-2">
              <Input label="Role" value="Restaurant Owner" disabled />
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
  );
};
