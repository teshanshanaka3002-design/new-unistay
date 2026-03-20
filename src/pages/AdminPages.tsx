import React, { useState } from 'react';
import { Card, Button, Input, Modal } from '../components/UI';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  BarChart3, 
  CreditCard, 
  Star, 
  ShieldAlert, 
  MoreVertical, 
  Search, 
  Filter,
  Eye,
  Trash2,
  Ban,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

// --- Admin Dashboard ---
export const AdminDashboard: React.FC = () => {
  const stats = [
    { label: 'Total Users', value: '1,240', change: '+12%', icon: <Users className="text-blue-500" />, color: 'bg-blue-50', up: true },
    { label: 'Total Orders', value: '8,450', change: '+18%', icon: <CreditCard className="text-emerald-500" />, color: 'bg-emerald-50', up: true },
    { label: 'Total Revenue', value: '$45,200', change: '+24%', icon: <BarChart3 className="text-purple-500" />, color: 'bg-purple-50', up: true },
    { label: 'Pending Approvals', value: '14', change: '-2%', icon: <ShieldAlert className="text-amber-500" />, color: 'bg-amber-50', up: false },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Administration Dashboard</h1>
          <p className="text-slate-500">Monitor system health, manage users, and verify operations.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">System Logs</Button>
          <Button size="sm">Global Settings</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="p-6 border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.up ? 'text-emerald-600' : 'text-red-600'}`}>
                {stat.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Pending Owner Approvals" description="Review and approve new boarding and restaurant owners">
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                    {i === 0 ? 'BO' : 'RO'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{i === 0 ? 'Grand Boarding' : 'Spicy Kitchen'}</p>
                    <p className="text-xs text-slate-500">Requested by: {i === 0 ? 'Alice Smith' : 'Bob Johnson'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="h-8 px-3 text-xs font-bold text-emerald-600 hover:bg-emerald-50 hover:border-emerald-100">Approve</Button>
                  <Button size="sm" variant="outline" className="h-8 px-3 text-xs font-bold text-red-600 hover:bg-red-50 hover:border-red-100">Reject</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Recent Payment Verifications" description="Verify student payment proofs for bookings">
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">$250.00 Payment</p>
                    <p className="text-xs text-slate-500">Student: John Doe • #BK-992{i}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0 rounded-lg">
                    <Eye size={16} className="text-slate-400" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0 rounded-lg">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// --- Users Management ---
export const UsersManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Users Management</h1>
          <p className="text-slate-500">Manage all registered users and their account status.</p>
        </div>
        <div className="flex w-full md:w-auto gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="h-10 w-10">
            <Filter size={18} />
          </Button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">User</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Role</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Joined Date</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                        {['JD', 'AS', 'BJ', 'SW', 'MK'][i]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{['John Doe', 'Alice Smith', 'Bob Johnson', 'Sarah Wilson', 'Mike King'][i]}</p>
                        <p className="text-xs text-slate-500">{['john', 'alice', 'bob', 'sarah', 'mike'][i]}@uni.edu</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      i % 3 === 0 ? 'bg-blue-50 text-blue-600' : i % 3 === 1 ? 'bg-purple-50 text-purple-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {['STUDENT', 'BOARDING_OWNER', 'RESTAURANT_OWNER', 'STUDENT', 'BOARDING_OWNER'][i].replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-500">Jan {10 + i}, 2026</td>
                  <td className="py-4 px-6">
                    <span className={`flex items-center gap-1.5 text-xs font-medium ${i === 4 ? 'text-red-600' : 'text-emerald-600'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${i === 4 ? 'bg-red-600' : 'bg-emerald-600'}`} />
                      {i === 4 ? 'Suspended' : 'Active'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0 rounded-lg">
                        <Eye size={14} className="text-slate-400" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0 rounded-lg">
                        <Ban size={14} className="text-slate-400" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0 rounded-lg text-red-500 hover:bg-red-50">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium">Showing 5 of 1,240 users</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8 px-3 text-xs">Previous</Button>
            <Button variant="outline" size="sm" className="h-8 px-3 text-xs">Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
