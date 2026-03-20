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
  Home, 
  Users, 
  CreditCard, 
  Star,
  Image as ImageIcon,
  Upload
} from 'lucide-react';

// --- Boarding Owner Dashboard ---
export const BoardingOwnerDashboard: React.FC = () => {
  const stats = [
    { label: 'Total Rooms', value: '12', icon: <Home className="text-blue-500" />, color: 'bg-blue-50' },
    { label: 'Occupied', value: '8', icon: <Users className="text-emerald-500" />, color: 'bg-emerald-50' },
    { label: 'Pending Requests', value: '4', icon: <CheckCircle2 className="text-amber-500" />, color: 'bg-amber-50' },
    { label: 'Monthly Revenue', value: '$2,400', icon: <CreditCard className="text-purple-500" />, color: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Boarding Management Dashboard</h1>
          <p className="text-slate-500">Manage your properties and student bookings efficiently.</p>
        </div>
        <Button size="sm">
          <Plus size={18} className="mr-2" />
          Add New Room
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
        <Card className="lg:col-span-2" title="Recent Booking Requests" description="New student applications for your rooms">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Student</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Room Type</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[1, 2, 3].map((_, i) => (
                  <tr key={i} className="group hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">JD</div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">John Doe</p>
                          <p className="text-xs text-slate-500">john@uni.edu</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-600 font-medium">Single Premium</td>
                    <td className="py-4 px-4 text-sm text-slate-500">Mar 18, 2026</td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0 rounded-lg">
                          <CheckCircle2 size={16} className="text-emerald-500" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0 rounded-lg">
                          <XCircle size={16} className="text-red-500" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0 rounded-lg">
                          <Eye size={16} className="text-slate-400" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Latest Reviews" description="What students are saying">
          <div className="space-y-6">
            {[1, 2].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} fill={s <= 4 ? "currentColor" : "none"} />)}
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">2 days ago</span>
                </div>
                <p className="text-sm text-slate-600 italic">"The room is very clean and the owner is very helpful. Highly recommended!"</p>
                <p className="text-xs font-bold text-slate-900">— Sarah Wilson</p>
              </div>
            ))}
            <Button variant="ghost" className="w-full text-xs font-bold uppercase tracking-widest text-blue-600">View All Reviews</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

// --- Add Room ---
export const AddRoom: React.FC = () => {
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
        <h1 className="text-2xl font-bold text-slate-900">Add New Room</h1>
        <p className="text-slate-500">List a new accommodation option for students.</p>
      </div>

      <Card className="p-8 border-slate-100 shadow-xl shadow-slate-200/50">
        <form className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Room Title" placeholder="e.g. Premium Single Suite" required />
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Room Type</label>
              <select className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-all">
                <option>Single Room</option>
                <option>Double Sharing</option>
                <option>Triple Sharing</option>
                <option>Apartment</option>
              </select>
            </div>
            <Input label="Monthly Rent ($)" type="number" placeholder="250" required />
            <Input label="Security Deposit ($)" type="number" placeholder="500" required />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Description</label>
            <textarea 
              className="flex min-h-[120px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-all"
              placeholder="Describe the room, amenities, and nearby facilities..."
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-semibold text-slate-900">Room Images</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="relative aspect-square rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center overflow-hidden group hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer">
                {previewImage ? (
                  <>
                    <img src={previewImage} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="secondary" size="sm" type="button" onClick={() => setPreviewImage(null)}>Change</Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload size={24} className="text-slate-300 mb-2" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Upload</p>
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
                  </>
                )}
              </div>
              {[1, 2, 3].map(i => (
                <div key={i} className="aspect-square rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50/50 flex items-center justify-center text-slate-200">
                  <ImageIcon size={24} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
            <Button variant="outline" type="button">Cancel</Button>
            <Button type="submit" className="px-8">Publish Listing</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

// --- Manage Rooms ---
export const ManageRooms: React.FC = () => {
  const rooms = [
    { id: 1, title: 'Premium Single Suite', type: 'Single', price: 250, status: 'Available', image: 'https://picsum.photos/seed/room1/400/300' },
    { id: 2, title: 'Standard Double Room', type: 'Double', price: 180, status: 'Occupied', image: 'https://picsum.photos/seed/room2/400/300' },
    { id: 3, title: 'Cozy Shared Space', type: 'Triple', price: 120, status: 'Available', image: 'https://picsum.photos/seed/room3/400/300' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Rooms</h1>
          <p className="text-slate-500">Edit, delete, or change availability of your rooms.</p>
        </div>
        <Button size="sm">
          <Plus size={18} className="mr-2" />
          Add New Room
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <Card key={room.id} className="p-0 overflow-hidden border-slate-100 group">
            <div className="relative aspect-video overflow-hidden">
              <img src={room.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
              <div className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                room.status === 'Available' ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'
              }`}>
                {room.status}
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900">{room.title}</h3>
                <p className="text-xs text-slate-500">{room.type} • ${room.price}/mo</p>
              </div>
              <div className="flex items-center gap-2 pt-4 border-t border-slate-50">
                <Button variant="outline" size="sm" className="flex-1 h-9">
                  <Edit size={14} className="mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="h-9 w-9 p-0 text-red-500 hover:bg-red-50 hover:border-red-100">
                  <Trash2 size={14} />
                </Button>
                <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                  <MoreVertical size={14} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
