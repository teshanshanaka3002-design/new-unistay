import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Utensils, 
  ShoppingBag, 
  CreditCard, 
  Star,
  Image as ImageIcon,
  Upload,
  Clock,
  Truck,
  MapPin,
  Info,
  DollarSign
} from 'lucide-react';

// --- Components ---
const OrdersList: React.FC<{ orders: any[], onStatusChange: (id: string, status: string) => void }> = ({ orders, onStatusChange }) => (
  <div className="space-y-4">
    {orders.map((order) => (
      <div key={order.id} className="p-4 rounded-xl border border-black/5 hover:bg-paper transition-colors flex flex-col md:flex-row justify-between gap-4">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-xl bg-ink/5 flex items-center justify-center text-ink/40">
            <ShoppingBag size={24} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="font-bold text-slate-900">Order #{order.id}</p>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                order.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                order.status === 'Preparing' ? 'bg-blue-100 text-blue-700' : 
                order.status === 'Ready' ? 'bg-emerald-100 text-emerald-700' : 
                'bg-slate-100 text-slate-500'
              }`}>
                {order.status}
              </span>
            </div>
            <p className="text-xs text-slate-600">{order.items}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Ordered by: {order.customer} • {order.time}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={order.status}
            onChange={(e) => onStatusChange(order.id, e.target.value)}
            className="h-9 rounded-lg border border-black/5 bg-white px-3 py-1 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-ink/10 transition-all"
          >
            <option value="Pending">Pending</option>
            <option value="Preparing">Preparing</option>
            <option value="Ready">Ready</option>
            <option value="Delivered">Delivered</option>
          </select>
          <Button size="sm" variant="outline" className="h-9 w-9 p-0 rounded-lg">
            <Eye size={16} className="text-ink/20" />
          </Button>
        </div>
      </div>
    ))}
  </div>
);

// --- Restaurant Owner Dashboard ---
export const RestaurantOwnerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const stats = [
    { id: 'menu-items', label: 'Total Menu Items', value: '24', icon: <Utensils className="text-blue-500" />, color: 'bg-blue-50' },
    { id: 'active-orders', label: 'Orders Today', value: '18', icon: <ShoppingBag className="text-amber-500" />, color: 'bg-amber-50' },
    { id: 'pending-orders', label: 'Pending Orders', value: '6', icon: <Clock className="text-purple-500" />, color: 'bg-purple-50' },
    { id: 'avg-rating', label: 'Average Rating', value: '4.3', icon: <Star className="text-emerald-500" />, color: 'bg-emerald-50' },
  ];

  const [orders, setOrders] = useState([
    { id: 'ORD-8820', items: '2x Spicy Chicken Burger, 1x Coke Large', status: 'Pending', customer: 'John Doe', time: '15 mins ago' },
    { id: 'ORD-8821', items: '1x Veggie Pizza Medium, 2x Garlic Bread', status: 'Preparing', customer: 'Sarah Wilson', time: '10 mins ago' },
    { id: 'ORD-8822', items: '3x Cheese Pasta, 3x Iced Tea', status: 'Ready', customer: 'Mike Johnson', time: '5 mins ago' },
  ]);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-serif text-ink">Restaurant Dashboard</h1>
          <p className="text-ink/40 font-medium mt-2">Manage your menu, track orders, and boost your sales.</p>
        </div>
        <Button className="rounded-full px-8" onClick={() => navigate('/restaurant/menu')}>
          <Plus size={20} className="mr-2" />
          Add Menu Item
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <Card key={stat.id} className="p-8 border-black/5 hover:shadow-2xl hover:shadow-ink/5 transition-all duration-500 group">
            <div className="flex items-center gap-6">
              <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40">{stat.label}</p>
                <p className="text-3xl font-bold text-ink mt-1">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2" title="Active Orders" description="Monitor and update order status in real-time">
          <OrdersList orders={orders} onStatusChange={handleStatusChange} />
        </Card>

        <Card title="Popular Items" description="Your best-selling menu items">
          <div className="space-y-6">
            {[
              { id: 'pop-1', name: 'Spicy Chicken Burger', orders: 42, revenue: 357.00 },
              { id: 'pop-2', name: 'Veggie Pizza', orders: 38, revenue: 456.00 },
              { id: 'pop-3', name: 'Cheese Pasta', orders: 31, revenue: 279.00 },
            ].map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <img src={`https://picsum.photos/seed/${item.id}/100/100`} className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">{item.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-slate-500">{item.orders} orders this week</p>
                    <p className="text-xs font-bold text-emerald-600">+${item.revenue.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full text-xs font-bold uppercase tracking-widest text-slate-500">View Full Menu</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};



// --- My Restaurant Page ---
export const MyRestaurantPage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Spicy Kitchen',
    location: 'Near North Gate',
    category: 'Fast Food',
    description: 'Best fast food near campus. We serve burgers, pizza, and more.'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name || formData.name.length < 3) newErrors.name = 'Name must be at least 3 characters';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.description || formData.description.length < 10) newErrors.description = 'Description must be at least 10 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      setIsEditing(false);
      alert('Restaurant details updated successfully!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div className="space-y-4">
          <h1 className="text-4xl font-serif text-ink">My Restaurant</h1>
          <p className="text-ink/40 font-medium">Manage your restaurant's public details.</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="outline" className="rounded-full px-8">
            <Edit size={18} className="mr-2" />
            Edit Details
          </Button>
        )}
      </div>

      <Card className="p-12 border-black/5 shadow-2xl shadow-ink/5 rounded-[3rem]">
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Input 
                label="Restaurant Name" 
                value={formData.name}
                disabled={!isEditing}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-4">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Input 
                label="Location" 
                value={formData.location}
                disabled={!isEditing}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className={errors.location ? 'border-red-500' : ''}
              />
              {errors.location && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-4">{errors.location}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Category</label>
              <select 
                disabled={!isEditing}
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-all disabled:bg-slate-50 disabled:text-slate-500"
              >
                <option>Fast Food</option>
                <option>Cafe</option>
                <option>Healthy</option>
                <option>Local Cuisine</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Description</label>
            <textarea 
              disabled={!isEditing}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className={`flex min-h-[120px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-all disabled:bg-slate-50 disabled:text-slate-500 ${errors.description ? 'border-red-500' : ''}`}
            />
            {errors.description && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-4">{errors.description}</p>}
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

// --- Manage Menu ---
export const ManageMenu: React.FC = () => {
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: 'Spicy Chicken Burger', category: 'Snacks', price: 8.50, status: 'Available', image: 'https://picsum.photos/seed/food1/400/300' },
    { id: 2, name: 'Veggie Pizza', category: 'Snacks', price: 12.00, status: 'Available', image: 'https://picsum.photos/seed/food2/400/300' },
    { id: 3, name: 'Chicken Fried Rice', category: 'Rice', price: 9.50, status: 'Not Available', image: 'https://picsum.photos/seed/food3/400/300' },
    { id: 4, name: 'Iced Coffee', category: 'Drinks', price: 3.50, status: 'Available', image: 'https://picsum.photos/seed/food4/400/300' },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const validate = (data: any) => {
    const newErrors: Record<string, string> = {};
    if (!data.name) newErrors.name = 'Food Name is required';
    if (!data.price || isNaN(Number(data.price))) newErrors.price = 'Valid price is required';
    if (!data.category) newErrors.category = 'Category is required';
    if (!data.description || data.description.length < 5) newErrors.description = 'Description must be at least 5 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(formData)) return;

    const newItem = {
      id: Date.now(),
      name: formData.name,
      category: formData.category,
      price: Number(formData.price),
      status: 'Available',
      image: previewImage || 'https://picsum.photos/seed/newfood/400/300'
    };

    setMenuItems([...menuItems, newItem]);
    setIsAddModalOpen(false);
    setFormData({ name: '', price: '', category: '', description: '' });
    setPreviewImage(null);
    alert('Item added successfully!');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(selectedItem)) return;

    setMenuItems(prev => prev.map(item => item.id === selectedItem.id ? selectedItem : item));
    setIsEditModalOpen(false);
    setSelectedItem(null);
    alert('Item updated successfully!');
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setMenuItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const toggleAvailability = (id: number) => {
    setMenuItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, status: item.status === 'Available' ? 'Not Available' : 'Available' };
      }
      return item;
    }));
  };

  const openEditModal = (item: any) => {
    setSelectedItem({ ...item, description: 'Delicious and freshly prepared.' }); // Mock description
    setIsEditModalOpen(true);
  };

  return (
    <div className="p-6 md:p-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-serif text-ink">Menu Management</h1>
          <p className="text-ink/40 font-medium mt-2">Edit, delete, or change availability of your dishes.</p>
        </div>
        <Button className="rounded-full px-8" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={20} className="mr-2" />
          Add New Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {menuItems.map((item) => (
          <Card key={item.id} className="p-0 overflow-hidden border-black/5 group hover:shadow-2xl hover:shadow-ink/10 transition-all duration-700 rounded-[2.5rem]">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" referrerPolicy="no-referrer" />
              <div className={`absolute top-6 right-6 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl cursor-pointer transition-colors ${
                item.status === 'Available' ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-ink/60 text-white backdrop-blur-md hover:bg-ink/80'
              }`} onClick={() => toggleAvailability(item.id)}>
                {item.status}
              </div>
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
                    <span className="text-lg font-bold">${item.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-6 border-t border-black/5">
                <Button variant="outline" size="sm" onClick={() => openEditModal(item)} className="flex-1 rounded-xl h-12 border-black/5 hover:bg-ink hover:text-white transition-all duration-500">
                  <Edit size={16} className="mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)} className="w-12 h-12 p-0 rounded-xl border-black/5 text-red-500 hover:bg-red-50 hover:border-red-100 transition-all duration-500">
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Item Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Menu Item">
        <form onSubmit={handleAddSubmit} className="space-y-6">
          <div className="space-y-2">
            <Input 
              label="Food Name" 
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-4">{errors.name}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Input 
                label="Price ($)" 
                type="number"
                step="0.01"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                className={errors.price ? 'border-red-500' : ''}
              />
              {errors.price && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-4">{errors.price}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40 ml-4">Category</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className={`flex h-14 w-full rounded-[1.5rem] border border-black/5 bg-paper px-6 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold transition-all duration-300 ${errors.category ? 'border-red-500' : ''}`}
              >
                <option value="">Select Category</option>
                <option value="Rice">Rice</option>
                <option value="Drinks">Drinks</option>
                <option value="Snacks">Snacks</option>
              </select>
              {errors.category && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-4">{errors.category}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40 ml-4">Description</label>
            <textarea 
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className={`flex min-h-[100px] w-full rounded-[2rem] border border-black/5 bg-paper px-6 py-4 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold transition-all duration-300 ${errors.description ? 'border-red-500' : ''}`}
            />
            {errors.description && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-4">{errors.description}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40 ml-4">Image (Optional)</label>
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
                  <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">Upload Photo</p>
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
                </>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)} className="rounded-full">Cancel</Button>
            <Button type="submit" className="rounded-full" disabled={Object.keys(errors).length > 0}>Add Item</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Item Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Menu Item">
        {selectedItem && (
          <form onSubmit={handleEditSubmit} className="space-y-6">
            <div className="space-y-2">
              <Input 
                label="Food Name" 
                value={selectedItem.name}
                onChange={e => setSelectedItem({ ...selectedItem, name: e.target.value })}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-4">{errors.name}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input 
                  label="Price ($)" 
                  type="number"
                  step="0.01"
                  value={selectedItem.price}
                  onChange={e => setSelectedItem({ ...selectedItem, price: e.target.value })}
                  className={errors.price ? 'border-red-500' : ''}
                />
                {errors.price && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-4">{errors.price}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40 ml-4">Category</label>
                <select 
                  value={selectedItem.category}
                  onChange={e => setSelectedItem({ ...selectedItem, category: e.target.value })}
                  className={`flex h-14 w-full rounded-[1.5rem] border border-black/5 bg-paper px-6 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold transition-all duration-300 ${errors.category ? 'border-red-500' : ''}`}
                >
                  <option value="Rice">Rice</option>
                  <option value="Drinks">Drinks</option>
                  <option value="Snacks">Snacks</option>
                </select>
                {errors.category && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-4">{errors.category}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40 ml-4">Description</label>
              <textarea 
                value={selectedItem.description}
                onChange={e => setSelectedItem({ ...selectedItem, description: e.target.value })}
                className={`flex min-h-[100px] w-full rounded-[2rem] border border-black/5 bg-paper px-6 py-4 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold transition-all duration-300 ${errors.description ? 'border-red-500' : ''}`}
              />
              {errors.description && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-4">{errors.description}</p>}
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button variant="outline" type="button" onClick={() => setIsEditModalOpen(false)} className="rounded-full">Cancel</Button>
              <Button type="submit" className="rounded-full" disabled={Object.keys(errors).length > 0}>Save Changes</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

// --- Restaurant Orders ---
export const RestaurantOrders: React.FC = () => {
  const [orders, setOrders] = useState([
    { id: 'ORD-8820', items: '2x Spicy Chicken Burger, 1x Coke Large', status: 'Pending', customer: 'John Doe', university: 'SLIIT', total: 20.50, time: '12:30 PM' },
    { id: 'ORD-8821', items: '1x Veggie Pizza Medium, 2x Garlic Bread', status: 'Preparing', customer: 'Sarah Wilson', university: 'NSBM', total: 18.00, time: '1:00 PM' },
    { id: 'ORD-8822', items: '3x Cheese Pasta, 3x Iced Tea', status: 'Ready', customer: 'Mike Johnson', university: 'SLIIT', total: 39.00, time: '1:15 PM' },
  ]);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  return (
    <div className="p-6 md:p-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <h1 className="text-4xl font-serif text-ink">Orders</h1>
        <p className="text-ink/40 font-medium">Manage student orders and update preparation status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {orders.map((order) => (
          <Card key={order.id} className="p-8 border-black/5 hover:shadow-2xl hover:shadow-ink/5 transition-all duration-700 rounded-[2.5rem] space-y-6">
            <div className="flex items-center justify-between border-b border-black/5 pb-4">
              <div>
                <h3 className="text-xl font-bold text-ink">#{order.id}</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-ink/40 mt-1">Pickup: {order.time}</p>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                order.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                order.status === 'Preparing' ? 'bg-blue-100 text-blue-700' : 
                'bg-emerald-100 text-emerald-700'
              }`}>
                {order.status}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-paper flex items-center justify-center text-ink font-serif font-bold border border-black/5">
                  {order.customer.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-ink">{order.customer}</p>
                  <p className="text-xs text-ink/60">{order.university}</p>
                </div>
              </div>

              <div className="bg-paper/50 p-4 rounded-2xl border border-black/5">
                <p className="text-sm text-ink/80 leading-relaxed">{order.items}</p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-black/5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Total</span>
                  <span className="text-lg font-bold text-ink">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              {order.status === 'Pending' && (
                <Button 
                  className="w-full rounded-xl h-12 bg-ink hover:bg-gold hover:text-ink transition-all duration-500"
                  onClick={() => handleStatusChange(order.id, 'Preparing')}
                >
                  Accept & Prepare
                </Button>
              )}
              {order.status === 'Preparing' && (
                <Button 
                  className="w-full rounded-xl h-12 bg-blue-500 hover:bg-blue-600 text-white transition-all duration-500"
                  onClick={() => handleStatusChange(order.id, 'Ready')}
                >
                  Mark as Ready
                </Button>
              )}
              {order.status === 'Ready' && (
                <Button 
                  variant="outline"
                  className="w-full rounded-xl h-12 border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-all duration-500"
                  onClick={() => handleStatusChange(order.id, 'Delivered')}
                >
                  Order Collected
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};



// --- Restaurant Reviews ---
export const RestaurantReviews: React.FC = () => {
  const reviews = [
    { id: 1, user: 'John Doe', rating: 5, comment: 'Amazing food! The spicy chicken burger is a must-try.', date: '2 days ago', verified: true },
    { id: 2, user: 'Sarah Wilson', rating: 4, comment: 'Good food, but prep time was a bit longer than expected.', date: '1 week ago', verified: true },
    { id: 3, user: 'Mike Johnson', rating: 5, comment: 'Best pizza around campus. Highly recommended!', date: '2 weeks ago', verified: true },
  ];

  return (
    <div className="p-6 md:p-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <h1 className="text-4xl font-serif text-ink">Reviews & Ratings</h1>
        <p className="text-ink/40 font-medium">See what students think about your food.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="p-8 border-black/5 shadow-2xl shadow-ink/5 rounded-[2.5rem] md:col-span-1 flex flex-col items-center justify-center text-center space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40">Average Rating</p>
          <p className="text-6xl font-serif text-ink">4.7</p>
          <div className="flex items-center gap-1 text-gold">
            {[1, 2, 3, 4, 5].map(s => <Star key={s} size={24} fill={s <= 4 ? "currentColor" : "none"} />)}
          </div>
          <p className="text-sm font-bold text-ink/60 mt-4">Based on 128 reviews</p>
        </Card>

        <div className="md:col-span-2 space-y-6">
          {reviews.map((review) => (
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
                        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} fill={s <= review.rating ? "currentColor" : "none"} />)}
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

// --- Restaurant Public Profile ---
export const RestaurantPublicProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Jane Doe',
    email: 'jane.doe@spicykitchen.com',
    phone: '0771234567',
    restaurantName: 'Spicy Kitchen'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name || formData.name.length < 3) newErrors.name = 'Name must be at least 3 characters';
    if (!formData.email || !formData.email.includes('@')) newErrors.email = 'Valid email is required';
    if (!formData.phone || formData.phone.length !== 10 || isNaN(Number(formData.phone))) newErrors.phone = 'Phone must be 10 digits';
    
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
          <p className="text-ink/40 font-medium">Manage your personal information and account details.</p>
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
                value={formData.phone}
                disabled={!isEditing}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-4">{errors.phone}</p>}
            </div>
            <div className="space-y-2">
              <Input 
                label="Restaurant Name" 
                value={formData.restaurantName}
                disabled
              />
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
