import React, { useState } from 'react';
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
  Truck
} from 'lucide-react';

// --- Restaurant Owner Dashboard ---
export const RestaurantOwnerDashboard: React.FC = () => {
  const stats = [
    { label: 'Total Menu Items', value: '24', icon: <Utensils className="text-blue-500" />, color: 'bg-blue-50' },
    { label: 'Active Orders', value: '6', icon: <ShoppingBag className="text-amber-500" />, color: 'bg-amber-50' },
    { label: 'Completed Today', value: '18', icon: <CheckCircle2 className="text-emerald-500" />, color: 'bg-emerald-50' },
    { label: 'Daily Revenue', value: '$340.50', icon: <CreditCard className="text-purple-500" />, color: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Restaurant Management Dashboard</h1>
          <p className="text-slate-500">Manage your menu, track orders, and boost your sales.</p>
        </div>
        <Button size="sm">
          <Plus size={18} className="mr-2" />
          Add Menu Item
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="p-6 border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2" title="Active Orders" description="Monitor and update order status in real-time">
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors flex flex-col md:flex-row justify-between gap-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                    <ShoppingBag size={24} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-slate-900">Order #ORD-882{i}</p>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {i === 0 ? 'Pending' : i === 1 ? 'Preparing' : 'Ready'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">2x Spicy Chicken Burger, 1x Coke Large</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Ordered by: John Doe • 15 mins ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select className="h-9 rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                    <option>Pending</option>
                    <option>Preparing</option>
                    <option>Ready</option>
                    <option>Delivered</option>
                  </select>
                  <Button size="sm" variant="outline" className="h-9 w-9 p-0 rounded-lg">
                    <Eye size={16} className="text-slate-400" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Popular Items" description="Your best-selling menu items">
          <div className="space-y-6">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <img src={`https://picsum.photos/seed/food${i}/100/100`} className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">Spicy Chicken Burger</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-slate-500">42 orders this week</p>
                    <p className="text-xs font-bold text-emerald-600">+$357.00</p>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full text-xs font-bold uppercase tracking-widest text-blue-600">View Full Menu</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

// --- Add Menu Item ---
export const AddMenuItem: React.FC = () => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Add New Menu Item</h1>
        <p className="text-slate-500">Add a delicious dish to your restaurant menu.</p>
      </div>

      <Card className="p-8 border-slate-100 shadow-xl shadow-slate-200/50">
        <form className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Item Name" placeholder="e.g. Spicy Chicken Burger" required />
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Category</label>
              <select className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-all">
                <option>Burgers</option>
                <option>Pizza</option>
                <option>Pasta</option>
                <option>Rice & Curry</option>
                <option>Beverages</option>
                <option>Desserts</option>
              </select>
            </div>
            <Input label="Price ($)" type="number" step="0.01" placeholder="8.50" required />
            <Input label="Estimated Prep Time (mins)" type="number" placeholder="15" required />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Description / Ingredients</label>
            <textarea 
              className="flex min-h-[120px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-all"
              placeholder="Describe the dish, its taste, and key ingredients..."
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-semibold text-slate-900">Item Image</label>
            <div className="relative aspect-video max-w-md rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center overflow-hidden group hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer">
              {previewImage ? (
                <>
                  <img src={previewImage} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary" size="sm" type="button" onClick={() => setPreviewImage(null)}>Change Image</Button>
                  </div>
                </>
              ) : (
                <>
                  <Upload size={32} className="text-slate-300 mb-2" />
                  <p className="text-sm font-medium text-slate-500">Click to upload item photo</p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
                </>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
            <Button variant="outline" type="button">Cancel</Button>
            <Button type="submit" className="px-8">Add to Menu</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
