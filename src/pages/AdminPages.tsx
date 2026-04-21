import React, { useState, useEffect } from 'react';
import { 
  Users, Building2, Utensils, ShoppingBag, Star, TrendingUp, 
  ShieldAlert, UserX, AlertTriangle, Image as ImageIcon, Plus, 
  Trash2, ExternalLink, LayoutDashboard, Settings, LogOut, Search,
  ChevronRight, MessageCircle, MoreHorizontal, Reply, StarOff, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { adminService, reviewService } from '../services/api';
import { Card, Button, Input, Modal, Badge } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Helper for CSS classes
const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

// --- Dashboard Overview ---
export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await adminService.getStats();
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Users', value: stats?.users || 0, icon: Users, color: 'bg-blue-500' },
    { label: 'Total Listings', value: stats?.listings || 0, icon: Building2, color: 'bg-emerald-500' },
    { label: 'Orders Processed', value: stats?.orders || 0, icon: ShoppingBag, color: 'bg-amber-500' },
    { label: 'Avg. Rating', value: `${stats?.avgRating || 0} / 5.0`, icon: Star, color: 'bg-gold' },
  ];

  return (
    <div className="p-6 md:p-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center text-ink p-12 rounded-[3.5rem] bg-white border border-black/5 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-5xl font-serif">System Overview</h1>
          <p className="text-ink/40 font-medium mt-4 max-w-lg">Real-time analytics and platform performance metrics.</p>
        </div>
        <LayoutDashboard size={300} className="absolute -right-24 -bottom-24 text-ink/5 -rotate-12" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-8 border-black/5 hover:shadow-2xl transition-all duration-500 group rounded-[2.5rem] bg-white/50 backdrop-blur-xl">
              <div className="flex justify-between items-start">
                <div className={`p-4 rounded-3xl ${stat.color} text-white shadow-xl group-hover:scale-110 transition-transform`}>
                  <stat.icon size={24} />
                </div>
                <TrendingUp size={20} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="mt-8 space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-ink/30">{stat.label}</p>
                <p className="text-3xl font-serif text-ink">{loading ? '...' : stat.value}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mt-12">
        <Card className="p-10 border-black/5 rounded-[3rem] space-y-8 bg-paper/30">
          <h3 className="text-2xl font-serif text-ink">System Health</h3>
          <div className="space-y-6">
            {[
              { label: 'API Server', status: 'Operational', color: 'text-emerald-500' },
              { label: 'Database Status', status: 'Stable', color: 'text-emerald-500' },
              { label: 'Real-time Sync', status: 'Active', color: 'text-emerald-500' }
            ].map(sys => (
              <div key={sys.label} className="flex justify-between items-center p-4 rounded-2xl bg-white/50 border border-black/5">
                <span className="font-bold text-sm text-ink/60 uppercase tracking-widest">{sys.label}</span>
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${sys.color}`}>{sys.status}</span>
              </div>
            ))}
          </div>
        </Card>
        
        <Card className="p-10 border-black/5 rounded-[3rem] bg-ink text-white flex flex-col justify-center space-y-6 overflow-hidden relative">
          <div className="relative z-10 space-y-4">
            <h3 className="text-3xl font-serif">Administrative Security</h3>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              All administrative actions are logged and encrypted. Ensure you maintain high standard security protocols.
            </p>
            <Button className="bg-gold text-ink rounded-full px-8 hover:bg-white transition-all shadow-xl shadow-gold/20">Security Audit</Button>
          </div>
          <ShieldAlert className="absolute -right-12 -bottom-12 w-64 h-64 text-white/5 rotate-12" />
        </Card>
      </div>
    </div>
  );
};

// --- User Management ---
export const AdminUserManagement: React.FC = () => {
  const [owners, setOwners] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'OWNERS' | 'STUDENTS'>('OWNERS');
  const [loading, setLoading] = useState(true);
  const [selectedOwnerListings, setSelectedOwnerListings] = useState<any>(null);
  const [isListingsModalOpen, setIsListingsModalOpen] = useState(false);
  const [loadingListings, setLoadingListings] = useState(false);
  const [isWarnModalOpen, setIsWarnModalOpen] = useState(false);
  const [warnNote, setWarnNote] = useState('');
  const [targetUserId, setTargetUserId] = useState('');

  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<any>(null);

  useEffect(() => {
    if (activeTab === 'OWNERS') {
      fetchOwners();
    } else {
      fetchStudents();
    }
  }, [activeTab]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await adminService.getStudents();
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const fetchOwners = async () => {
    try {
      setLoading(true);
      const res = await adminService.getOwners();
      setOwners(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleWarnAction = async () => {
    try {
      await adminService.warnUser(targetUserId, warnNote);
      alert('Official warning issued with your note.');
      setIsWarnModalOpen(false);
      setWarnNote('');
      fetchOwners();
    } catch (err) {
      alert('Failed to issue warning.');
    }
  };

  const handleWarnClick = (id: string) => {
    setTargetUserId(id);
    setIsWarnModalOpen(true);
  };

  const handleBan = async (id: string) => {
    if (!window.confirm('WARNING: Banning this user will PERMANENTLY DELETE their account and all associated listings. Continue?')) return;
    try {
      await adminService.banUser(id);
      alert('User and all listings have been permanently removed.');
      fetchOwners();
    } catch (err) {
      alert('Failed to ban user.');
    }
  };

  const handleStudentRemove = async () => {
    if (!studentToDelete) return;
    try {
      setLoading(true);
      await adminService.deleteStudent(studentToDelete._id);
      alert('Student permanently removed.');
      setIsConfirmDeleteModalOpen(false);
      setStudentToDelete(null);
      fetchStudents();
    } catch (err) {
      alert('Failed to remove student.');
      setLoading(false);
    }
  };


  const handleViewListings = async (owner: any) => {
    try {
      setIsListingsModalOpen(true);
      setLoadingListings(true);
      const res = await adminService.getOwnerListings(owner._id || owner.id);
      setSelectedOwnerListings({ ...res.data, ownerName: owner.name });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingListings(false);
    }
  };

  return (
    <div className="p-6 md:p-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center text-white p-12 rounded-[3.5rem] bg-gradient-to-br from-ink to-ink/90 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-5xl font-serif">User Management</h1>
          <p className="text-white/50 font-medium mt-4 max-w-lg">Monitor, warn, and manage all registered owners and students across the platform.</p>
        </div>
        <Users size={300} className="absolute -right-24 -bottom-24 text-white/5 -rotate-12" />
      </div>

      <div className="flex gap-4 p-2 bg-paper/50 rounded-full border border-black/5 w-fit">
          {[
              { id: 'OWNERS', label: 'Owners', icon: Building2 },
              { id: 'STUDENTS', label: 'Students', icon: Users }
          ].map((tab: any) => (
              <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                      "flex items-center gap-3 px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                      activeTab === tab.id
                          ? "bg-ink text-gold shadow-xl"
                          : "text-ink/40 hover:text-ink hover:bg-white"
                  )}
              >
                  <tab.icon size={16} />
                  {tab.label}
              </button>
          ))}
      </div>

      {activeTab === 'OWNERS' ? (
      <Card className="rounded-[3rem] border-black/5 overflow-hidden shadow-2xl bg-white/50 backdrop-blur-xl transition-all">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-paper/50">
                <th className="py-8 px-10 text-[10px] font-black uppercase tracking-[0.2em] text-ink/30">Member Details</th>
                <th className="py-8 px-10 text-[10px] font-black uppercase tracking-[0.2em] text-ink/30">Account Role</th>
                <th className="py-8 px-10 text-[10px] font-black uppercase tracking-[0.2em] text-ink/30">Warnings</th>
                <th className="py-8 px-10 text-[10px] font-black uppercase tracking-[0.2em] text-right text-ink/30">Management Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {loading ? (
                 <tr>
                    <td colSpan={4} className="py-24 text-center">
                       <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                       <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/30">Retrieving owners...</p>
                    </td>
                 </tr>
              ) : owners.length > 0 ? owners.map((owner) => (
                <tr key={owner._id} className="group hover:bg-paper/30 transition-all duration-300">
                  <td className="py-8 px-10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-ink text-gold flex items-center justify-center font-serif text-lg">
                        {owner.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-ink">{owner.name}</p>
                        <p className="text-[10px] text-ink/40 font-bold uppercase tracking-widest">{owner.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-8 px-10">
                    <Badge variant="outline" className="rounded-full px-4 py-1.5 border-black/5 text-[10px] font-bold uppercase tracking-widest text-ink/50">
                      {owner.role?.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="py-8 px-10">
                    <div className="flex items-center gap-2">
                       <AlertTriangle size={14} className={owner.warning > 0 ? "text-amber-500" : "text-ink/10"} />
                       <span className={`text-sm font-bold ${owner.warning > 0 ? "text-amber-600" : "text-ink/20"}`}>{owner.warning || 0}</span>
                    </div>
                  </td>
                  <td className="py-8 px-10">
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" size="sm" className="rounded-xl h-11 px-6 gap-2 border-black/5 hover:bg-paper" onClick={() => handleViewListings(owner)}>
                        <Building2 size={16} /> Listings
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-xl h-11 px-6 gap-2 text-amber-500 border-amber-100 hover:bg-amber-50" onClick={() => handleWarnClick(owner._id)}>
                        <AlertTriangle size={16} /> Warn
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-xl h-11 px-6 gap-2 text-rose-500 border-rose-100 hover:bg-rose-50" onClick={() => handleBan(owner._id)}>
                        <UserX size={16} /> Ban User
                      </Button>
                    </div>
                  </td>
                </tr>
              )) : (
                 <tr>
                    <td colSpan={4} className="py-24 text-center">
                       <Users size={48} className="text-ink/10 mx-auto mb-4" />
                       <p className="text-sm text-ink/40 font-medium italic">No owners registered yet.</p>
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      ) : (
      <Card className="rounded-[3rem] border-black/5 overflow-hidden shadow-2xl bg-white/50 backdrop-blur-xl transition-all">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-paper/50">
                <th className="py-8 px-10 text-[10px] font-black uppercase tracking-[0.2em] text-ink/30">Student Details</th>
                <th className="py-8 px-10 text-[10px] font-black uppercase tracking-[0.2em] text-ink/30">Registration Date</th>
                <th className="py-8 px-10 text-[10px] font-black uppercase tracking-[0.2em] text-right text-ink/30">Management Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {loading ? (
                 <tr>
                    <td colSpan={3} className="py-24 text-center">
                       <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                       <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/30">Retrieving students...</p>
                    </td>
                 </tr>
              ) : students.length > 0 ? students.map((student) => (
                <tr key={student._id} className="group hover:bg-paper/30 transition-all duration-300">
                  <td className="py-8 px-10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-ink text-gold flex items-center justify-center font-serif text-lg uppercase">
                        {student.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-ink">{student.name}</p>
                        <p className="text-[10px] text-ink/40 font-bold uppercase tracking-widest">{student.email} {student.contactNumber ? `· ${student.contactNumber}` : ''}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-8 px-10">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-ink/50">
                      {new Date(student.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="py-8 px-10">
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" size="sm" className="rounded-xl h-11 px-6 gap-2 text-rose-500 border-rose-100 hover:bg-rose-50" onClick={() => { setStudentToDelete(student); setIsConfirmDeleteModalOpen(true); }}>
                        <Trash2 size={16} /> Remove
                      </Button>
                    </div>
                  </td>
                </tr>
              )) : (
                 <tr>
                    <td colSpan={3} className="py-24 text-center">
                       <Users size={48} className="text-ink/10 mx-auto mb-4" />
                       <p className="text-sm text-ink/40 font-medium italic">No students registered yet.</p>
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      )}

      <Modal isOpen={isListingsModalOpen} onClose={() => setIsListingsModalOpen(false)} title={`Properties by ${selectedOwnerListings?.ownerName}`} maxWidth="3xl">
        {loadingListings ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/30">Synchronizing database...</p>
          </div>
        ) : (
          <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {selectedOwnerListings?.accommodations.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-ink/30">Boarding Houses</h4>
                <div className="grid grid-cols-1 gap-4">
                  {selectedOwnerListings.accommodations.map((acc: any) => (
                    <div key={acc._id} className="p-6 rounded-3xl bg-paper/50 border border-black/5 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-ink">{acc.name}</p>
                        <p className="text-[10px] text-ink/40 font-bold uppercase tracking-widest">{acc.university} · {acc.location}</p>
                      </div>
                      <Badge className="bg-emerald-500 text-white border-none text-[8px] tracking-tighter">Active</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {selectedOwnerListings?.canteens.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-ink/30">Restaurants / Cafes</h4>
                <div className="grid grid-cols-1 gap-4">
                  {selectedOwnerListings.canteens.map((can: any) => (
                    <div key={can._id} className="p-6 rounded-3xl bg-paper/50 border border-black/5 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-ink">{can.name}</p>
                        <p className="text-[10px] text-ink/40 font-bold uppercase tracking-widest">{can.university} · {can.location}</p>
                      </div>
                      <Badge className="bg-amber-500 text-white border-none text-[8px] tracking-tighter">Verified</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {selectedOwnerListings?.accommodations.length === 0 && selectedOwnerListings?.canteens.length === 0 && (
              <div className="py-12 text-center">
                <Building2 size={48} className="text-ink/10 mx-auto mb-4" />
                <p className="text-sm text-ink/40 font-medium">No active listings found for this owner.</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal isOpen={isWarnModalOpen} onClose={() => setIsWarnModalOpen(false)} title="Issue Official Warning" maxWidth="md">
        <div className="space-y-6">
          <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex gap-4">
            <AlertTriangle className="text-amber-500 shrink-0" size={24} />
            <p className="text-sm text-amber-800 leading-relaxed font-medium">
              Warnings are visible to the user on their dashboard. Please provide a clear note explaining the reason for this warning.
            </p>
          </div>
          
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-ink/40 ml-4">Warning Note / Reason</label>
            <textarea 
              value={warnNote}
              onChange={(e) => setWarnNote(e.target.value)}
              placeholder="e.g. Inaccurate property images, Unresponsive to student requests..."
              className="w-full p-6 bg-paper rounded-[2rem] border border-black/5 text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-black/5">
            <Button variant="outline" onClick={() => setIsWarnModalOpen(false)}>Cancel Action</Button>
            <Button 
              className="rounded-full px-8 bg-amber-500 text-white shadow-xl shadow-amber-500/20 hover:bg-amber-600 transition-all"
              onClick={handleWarnAction}
              disabled={!warnNote.trim()}
            >
              Issue Warning
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isConfirmDeleteModalOpen} onClose={() => setIsConfirmDeleteModalOpen(false)} title="Remove Student" maxWidth="md">
         <div className="space-y-6">
           <div className="p-6 bg-rose-50 rounded-3xl border border-rose-100 flex gap-4">
             <AlertTriangle className="text-rose-500 shrink-0" size={24} />
             <p className="text-sm text-rose-800 leading-relaxed font-medium">
               Are you sure you want to remove this user? This action will permanently delete the student from the database.
             </p>
           </div>
           
           <div className="flex justify-end gap-3 pt-4 border-t border-black/5">
             <Button variant="outline" onClick={() => setIsConfirmDeleteModalOpen(false)}>Cancel</Button>
             <Button 
               className="rounded-full px-8 bg-rose-500 text-white shadow-xl shadow-rose-500/20 hover:bg-rose-600 transition-all"
               onClick={handleStudentRemove}
               isLoading={loading}
             >
               Remove
             </Button>
           </div>
         </div>
      </Modal>
    </div>
  );
};

// --- Content Management (Hero Studio) ---
export const AdminContentManagement: React.FC = () => {
  const [slides, setSlides] = useState<any[]>([]);
  const [isAddSlideOpen, setIsAddSlideOpen] = useState(false);
  const [newSlide, setNewSlide] = useState({ image: '', title: '', subtitle: '', desc: '' });

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    try {
      const res = await adminService.getHeroContent();
      setSlides(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminService.createHeroContent(newSlide);
      setIsAddSlideOpen(false);
      setNewSlide({ image: '', title: '', subtitle: '', desc: '' });
      fetchHero();
    } catch (err) {
      alert('Failed to add slide.');
    }
  };

  const handleDeleteSlide = async (id: string) => {
    if (!window.confirm('Remove this slide?')) return;
    try {
      await adminService.deleteHeroContent(id);
      fetchHero();
    } catch (err) {
      alert('Failed to delete.');
    }
  };

  return (
    <div className="p-6 md:p-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-serif text-ink">Hero Studio</h1>
          <p className="text-ink/40 font-medium mt-2">Manage the visual identity of the student dashboard.</p>
        </div>
        <Button className="rounded-full gap-2 px-8 h-14 bg-gold text-ink" onClick={() => setIsAddSlideOpen(true)}>
          <Plus size={20} /> New Hero Slide
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {slides.map((slide) => (
          <motion.div
            key={slide._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="overflow-hidden border-black/5 rounded-[2.5rem] shadow-xl group">
              <div className="aspect-[16/9] relative">
                <img src={slide.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-black/40 p-10 flex flex-col justify-end text-white">
                  <h4 className="text-4xl font-serif leading-tight">
                    {slide.title} <br />
                    <span className="text-gold italic">{slide.subtitle}</span>
                  </h4>
                  <p className="text-xs text-white/70 mt-4 line-clamp-2 max-w-sm">{slide.desc}</p>
                </div>
                <button 
                  onClick={() => handleDeleteSlide(slide._id)}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-xl"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </Card>
          </motion.div>
        ))}
        {slides.length === 0 && (
          <div className="col-span-full py-32 text-center bg-paper/50 rounded-[3rem] border border-black/5">
            <ImageIcon size={48} className="text-ink/10 mx-auto mb-4" />
            <p className="text-ink/40 text-sm font-medium italic">No custom slides active. System is using default assets.</p>
          </div>
        )}
      </div>

      <Modal isOpen={isAddSlideOpen} onClose={() => setIsAddSlideOpen(false)} title="Add Hero Slide" maxWidth="xl">
        <form onSubmit={handleAddSlide} className="space-y-6">
          <Input label="Image URL" value={newSlide.image} onChange={e => setNewSlide({ ...newSlide, image: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
             <Input label="Main Title" value={newSlide.title} onChange={e => setNewSlide({ ...newSlide, title: e.target.value })} required />
             <Input label="Subtitle (Italic)" value={newSlide.subtitle} onChange={e => setNewSlide({ ...newSlide, subtitle: e.target.value })} required />
          </div>
          <textarea 
            placeholder="Slide Description"
            value={newSlide.desc}
            onChange={e => setNewSlide({ ...newSlide, desc: e.target.value })}
            className="w-full p-6 bg-paper rounded-[1.5rem] border border-black/5 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-gold transition-all"
            required
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-black/5">
            <Button variant="outline" type="button" onClick={() => setIsAddSlideOpen(false)}>Cancel</Button>
            <Button type="submit" className="rounded-full px-8 bg-gold text-ink shadow-lg shadow-gold/20 hover:scale-105 transition-all">Publish Slide</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// --- Student Requests & Issues Manager ---
export const AdminReportsManager: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAdminReports();
      setReports(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (statusOverride?: string) => {
    if (!replyMessage && !statusOverride) return;

    try {
      setIsSubmitting(true);
      await adminService.replyToReport(selectedReport._id, {
        message: replyMessage,
        status: statusOverride || selectedReport.status
      });
      alert('Response recorded successfully.');
      setReplyMessage('');
      setSelectedReport(null);
      fetchReports();
    } catch (err) {
      alert('Failed to send reply.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'Resolved' ? 'bg-emerald-500' : 'bg-amber-500';
  };

  return (
    <div className="p-6 md:p-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center text-white p-12 rounded-[3.5rem] bg-gradient-to-br from-ink to-black shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-5xl font-serif">Student Issues</h1>
          <p className="text-white/50 font-medium mt-4 max-w-lg">Review, respond, and resolve all student concerns and system reports in real-time.</p>
        </div>
        <AlertTriangle size={300} className="absolute -right-24 -bottom-24 text-white/5 -rotate-12" />
      </div>

      <Card className="rounded-[3rem] border-black/5 overflow-hidden shadow-2xl bg-white/50 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-paper/50">
                <th className="py-8 px-10 text-[10px] font-black uppercase tracking-[0.2em] text-ink/30">Student Details</th>
                <th className="py-8 px-10 text-[10px] font-black uppercase tracking-[0.2em] text-ink/30">Issue Subject</th>
                <th className="py-8 px-10 text-[10px] font-black uppercase tracking-[0.2em] text-ink/30">Status</th>
                <th className="py-8 px-10 text-[10px] font-black uppercase tracking-[0.2em] text-right text-ink/30">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-24 text-center">
                    <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/30">Loading reports...</p>
                  </td>
                </tr>
              ) : reports.length > 0 ? reports.map((report) => (
                <tr key={report._id} className="group hover:bg-paper/30 transition-all duration-300">
                  <td className="py-8 px-10">
                    <div className="space-y-1">
                      <p className="font-bold text-ink">{report.fullName}</p>
                      <p className="text-[10px] text-ink/40 font-bold uppercase tracking-widest">{report.studentIdNumber} · {report.university}</p>
                    </div>
                  </td>
                  <td className="py-8 px-10">
                    <div className="space-y-1">
                      <p className="font-medium text-ink/70">{report.title}</p>
                      <p className="text-[10px] text-ink/30 font-bold uppercase tracking-widest">
                        {new Date(report.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </td>
                  <td className="py-8 px-10">
                    <Badge className={`${getStatusColor(report.status)} text-white border-0 text-[8px] font-black uppercase`}>
                      {report.status}
                    </Badge>
                  </td>
                  <td className="py-8 px-10 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl h-11 px-6 border-black/5 hover:bg-paper gap-2"
                      onClick={() => setSelectedReport(report)}
                    >
                      View & Respond <ChevronRight size={14} />
                    </Button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="py-24 text-center">
                    <ShoppingBag size={48} className="text-ink/10 mx-auto mb-4" />
                    <p className="text-sm text-ink/40 font-medium italic">No issues reported yet. System status clear.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Response Modal */}
      <Modal
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        title="Manage Student Issue"
        maxWidth="4xl"
      >
        {selectedReport && (
          <div className="space-y-10 p-2">
            <div className="grid md:grid-cols-2 gap-10">
              {/* Left: Info */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-ink/30">Detailed Issue Information</h4>
                  <div className="p-8 rounded-[2.5rem] bg-paper/50 border border-black/5 space-y-6">
                    <div>
                      <p className="text-2xl font-serif text-ink">{selectedReport.title}</p>
                      <p className="text-xs font-bold text-ink/40 mt-1 uppercase tracking-widest">{selectedReport.issueType || 'General Issue'}</p>
                    </div>
                    <p className="text-sm text-ink/70 leading-relaxed italic border-l-4 border-gold pl-6 py-2">
                      "{selectedReport.description}"
                    </p>
                    <div className="pt-4 space-y-2 border-t border-black/5">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ink/20">Contact Channel</p>
                      <p className="text-sm font-bold text-ink/60">{selectedReport.contactNumber}</p>
                    </div>
                  </div>
                </div>

                {selectedReport.images?.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-ink/30">Uploaded Evidence</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {selectedReport.images.map((img: string, i: number) => (
                        <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-black/5 bg-paper">
                          <img src={img} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Response */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-ink/30">Send Administrative Response</h4>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your official response to the student here..."
                    className="w-full p-8 bg-paper rounded-[2.5rem] border border-black/5 text-sm min-h-[250px] focus:outline-none focus:ring-2 focus:ring-gold transition-all"
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <Button
                    className="w-full h-16 rounded-full bg-ink text-white font-bold uppercase tracking-widest text-xs shadow-xl shadow-ink/20"
                    onClick={() => handleReply()}
                    isLoading={isSubmitting}
                    disabled={!replyMessage.trim()}
                  >
                    Send Message & Keep Pending
                  </Button>
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      className="flex-1 h-16 rounded-full border-emerald-100 text-emerald-600 hover:bg-emerald-50 font-bold uppercase tracking-widest text-xs"
                      onClick={() => handleReply('Resolved')}
                      disabled={isSubmitting}
                    >
                      Mark as Resolved
                    </Button>
                    <Button
                      variant="outline"
                      className="h-16 rounded-full px-8"
                      onClick={() => setSelectedReport(null)}
                    >
                      Discard
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* History Log */}
            {selectedReport.replies?.length > 0 && (
              <div className="pt-10 border-t border-black/5 space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-ink/30 text-center">Previous Communications</h4>
                <div className="space-y-4">
                  {selectedReport.replies.map((reply: any, i: number) => (
                    <div key={i} className="p-6 rounded-3xl bg-emerald-50/30 border border-emerald-100/50 flex justify-between items-center gap-6">
                      <div className="flex-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Official Response from {reply.adminName}</p>
                        <p className="text-sm text-ink/60 italic">"{reply.message}"</p>
                      </div>
                      <p className="text-[9px] font-bold text-ink/20 whitespace-nowrap">{new Date(reply.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

// --- Reviews and Ratings Manager ---
export const AdminReviewsManager: React.FC = () => {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'WEBSITE' | 'STAY' | 'MEAL'>('WEBSITE');
    const [selectedReview, setSelectedReview] = useState<any>(null);
    const [replyText, setReplyText] = useState('');
    const [isReplying, setIsReplying] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const res = await reviewService.getAllReviews();
            setReviews(res.data);
        } catch (err) {
            console.error('Failed to fetch reviews', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) return;
        try {
            await reviewService.deleteReview(id);
            fetchReviews();
            if (selectedReview?._id === id) setSelectedReview(null);
        } catch (err) {
            alert('Failed to delete review');
        }
    };

    const handleReply = async () => {
        if (!replyText.trim()) return;
        try {
            setIsReplying(true);
            await reviewService.replyToReview(selectedReview._id, replyText);
            setReplyText('');
            setSelectedReview(null);
            fetchReviews();
            alert('Reply sent successfully');
        } catch (err) {
            alert('Failed to send reply');
        } finally {
            setIsReplying(false);
        }
    };

    const filteredAndSortedReviews = (list: any[]) => {
        return [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const filteredReviewsList = filteredAndSortedReviews(reviews.filter(r => r.type === activeTab));

    const getCategoryLabel = (type: string) => {
        switch (type) {
            case 'STAY': return 'Accommodation';
            case 'MEAL': return 'Restaurant/Canteen';
            case 'WEBSITE': return 'Platform Feedback';
            default: return type;
        }
    }

    return (
        <div className="p-6 md:p-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center text-white p-12 rounded-[3.5rem] bg-gradient-to-br from-gold to-amber-600 shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-5xl font-serif">Reviews Manager</h1>
                    <p className="text-white/80 font-medium mt-4 max-w-lg">Monitor platform reputation and engage with student feedback across all services.</p>
                </div>
                <Star size={300} className="absolute -right-24 -bottom-24 text-white/10 -rotate-12" />
            </div>

            {/* Category Tabs */}
            <div className="flex gap-4 p-2 bg-paper/50 rounded-full border border-black/5 w-fit">
                {[
                    { id: 'WEBSITE', label: 'Website', icon: Globe },
                    { id: 'STAY', label: 'Stays', icon: Building2 },
                    { id: 'MEAL', label: 'Meals', icon: Utensils }
                ].map((tab: any) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                            "flex items-center gap-3 px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                            activeTab === tab.id
                                ? "bg-ink text-gold shadow-xl"
                                : "text-ink/40 hover:text-ink hover:bg-white"
                        )}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    Array(6).fill(0).map((_, i) => (
                        <div key={i} className="h-64 rounded-[2.5rem] bg-paper/50 animate-pulse border border-black/5" />
                    ))
                ) : filteredReviewsList.length > 0 ? filteredReviewsList.map((review, idx) => (
                    <motion.div
                        key={review._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                    >
                        <Card className="p-8 rounded-[2.5rem] border-black/5 bg-white hover:shadow-2xl transition-all group flex flex-col justify-between h-full">
                            <div className="space-y-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-ink text-gold flex items-center justify-center font-serif text-sm">
                                            {review.userName[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-ink text-xs uppercase tracking-widest">{review.userName}</p>
                                            <p className="text-[9px] text-ink/30 font-bold uppercase tracking-tight">{new Date(review.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1 text-gold">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={10} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-black/5"} />
                                        ))}
                                    </div>
                                </div>

                                <div className="relative">
                                    <p className="text-ink/70 text-sm leading-relaxed italic line-clamp-3">
                                        "{review.comment}"
                                    </p>
                                </div>

                                {review.adminReply && (
                                    <div className="p-4 rounded-2xl bg-gold/5 border border-gold/10 space-y-2">
                                        <p className="text-[8px] font-black uppercase tracking-widest text-gold flex items-center gap-2">
                                            <Reply size={10} /> Reply from {review.adminName}
                                        </p>
                                        <p className="text-[11px] text-ink/60 leading-relaxed italic line-clamp-2">"{review.adminReply}"</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2 pt-6 mt-auto">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 rounded-xl text-[9px] font-bold uppercase tracking-widest border-black/5 hover:bg-paper"
                                    onClick={() => {
                                        setSelectedReview(review);
                                        setIsReplying(false);
                                        setReplyText('');
                                    }}
                                >
                                    Details
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-11 rounded-xl border-rose-100 text-rose-500 hover:bg-rose-50"
                                    onClick={() => handleDelete(review._id)}
                                >
                                    <Trash2 size={14} />
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                )) : (
                    <div className="col-span-full py-24 text-center space-y-4">
                        <MessageCircle size={48} className="text-ink/10 mx-auto" />
                        <p className="text-sm text-ink/40 font-medium italic">No reviews found for this category.</p>
                    </div>
                )}
            </div>

            {/* Review Detail & Reply Modal */}
            <Modal
                isOpen={!!selectedReview}
                onClose={() => setSelectedReview(null)}
                title={`${getCategoryLabel(selectedReview?.type)} Review`}
                maxWidth="lg"
            >
                {selectedReview && (
                    <div className="space-y-10 p-2">
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-ink text-gold flex items-center justify-center font-serif text-xl shadow-lg">
                                        {selectedReview.userName[0]}
                                    </div>
                                    <div>
                                        <p className="text-lg font-serif text-ink">{selectedReview.userName}</p>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-ink/30 italic">Verified Student</p>
                                    </div>
                                </div>
                                <Badge className="bg-gold text-ink border-none text-[10px] font-black px-4">{selectedReview.rating} / 5.0</Badge>
                            </div>

                            <div className="p-8 rounded-[2.5rem] bg-paper/50 border border-black/5 relative">
                                <p className="text-lg text-ink/60 leading-relaxed italic">"{selectedReview.comment}"</p>
                                <p className="text-[9px] font-bold uppercase tracking-widest text-ink/20 mt-6 text-right">Submitted at {new Date(selectedReview.createdAt).toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-ink/30 ml-4">Administrative Response</h4>

                            {selectedReview.adminReply && !isReplying ? (
                                <div className="space-y-4">
                                    <div className="p-8 rounded-[2rem] bg-gold/5 border border-gold/20 italic">
                                        <p className="text-sm text-ink/70">"{selectedReview.adminReply}"</p>
                                        <div className="flex justify-between items-end mt-4">
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-gold font-sans">Replied by {selectedReview.adminName}</p>
                                            <p className="text-[9px] font-medium text-ink/20 font-sans">{new Date(selectedReview.replyDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        className="text-[9px] font-bold uppercase tracking-widest text-ink/30 hover:text-ink"
                                        onClick={() => {
                                            setReplyText(selectedReview.adminReply);
                                            setIsReplying(true);
                                        }}
                                    >
                                        Edit Reply
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="Write your response to the student..."
                                        className="w-full p-6 bg-paper rounded-[2rem] border border-black/5 text-sm min-h-[150px] focus:outline-none focus:ring-2 focus:ring-gold transition-all"
                                    />
                                    <div className="flex justify-end gap-3 transition-all animate-in fade-in slide-in-from-top-2">
                                        {selectedReview.adminReply && (
                                            <Button variant="outline" onClick={() => setIsReplying(false)}>Cancel Edit</Button>
                                        )}
                                        <Button
                                            className="bg-ink text-gold rounded-full px-8 shadow-xl shadow-ink/20"
                                            onClick={handleReply}
                                            isLoading={isReplying}
                                            disabled={!replyText.trim()}
                                        >
                                            {selectedReview.adminReply ? 'Update Reply' : 'Publish Reply'}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};
