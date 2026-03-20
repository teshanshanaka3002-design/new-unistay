import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, Role } from '../context/AuthContext';
import { Button, Input, Card } from '../components/UI';
import { LogIn, UserPlus, ShieldCheck, GraduationCap, Building2, Utensils } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Special Admin Login
      if (formData.email === 'admin@uni.edu' && formData.password === 'AdminPassword123!') {
        login('mock-jwt-token', {
          id: 'admin-1',
          email: 'admin@uni.edu',
          name: 'System Admin',
          role: 'ADMIN',
        });
        navigate('/dashboard/admin');
        return;
      }

      // Mock user data based on email for testing
      let role: Role = 'STUDENT';
      if (formData.email.includes('admin')) role = 'ADMIN';
      else if (formData.email.includes('boarding')) role = 'BOARDING_OWNER';
      else if (formData.email.includes('restaurant')) role = 'RESTAURANT_OWNER';

      login('mock-jwt-token', {
        id: '1',
        email: formData.email,
        name: formData.email.split('@')[0],
        role: role,
      });

      const dashboardPath = role === 'STUDENT' ? '/dashboard/student' : 
                          role === 'BOARDING_OWNER' ? '/dashboard/boarding-owner' :
                          role === 'RESTAURANT_OWNER' ? '/dashboard/restaurant-owner' :
                          '/dashboard/admin';
      
      navigate(dashboardPath);
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200 mb-4">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome Back</h1>
          <p className="text-slate-500">Enter your credentials to access your dashboard</p>
        </div>

        <Card className="p-8 border-slate-200 shadow-xl shadow-slate-200/50">
          <div className="mb-6 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700">
            <p className="font-bold mb-1">Admin Access (Testing):</p>
            <p>Email: <span className="font-mono">admin@uni.edu</span></p>
            <p>Password: <span className="font-mono">AdminPassword123!</span></p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-center gap-2 animate-in fade-in duration-200">
                <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                {error}
              </div>
            )}
            
            <Input
              label="Email Address"
              type="email"
              placeholder="name@university.edu"
              required
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
            
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Remember me</span>
              </label>
              <Link to="/forgot-password" size="sm" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full h-11" isLoading={isLoading}>
              <LogIn size={18} className="mr-2" />
              Sign In
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<Role>('STUDENT');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      // Mock registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    { id: 'STUDENT', label: 'Student', icon: <GraduationCap size={20} />, desc: 'Find places to stay and order food' },
    { id: 'BOARDING_OWNER', label: 'Boarding Owner', icon: <Building2 size={20} />, desc: 'List your accommodation for students' },
    { id: 'RESTAURANT_OWNER', label: 'Restaurant Owner', icon: <Utensils size={20} />, desc: 'Sell food to the university community' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create an Account</h1>
          <p className="text-slate-500">Join the university management system today</p>
        </div>

        <Card className="p-8 border-slate-200 shadow-xl shadow-slate-200/50">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                {error}
              </div>
            )}

            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-900">Select Your Role</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id as Role)}
                    className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                      role === r.id 
                        ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600' 
                        : 'border-slate-100 bg-white hover:border-slate-200'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                      role === r.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {r.icon}
                    </div>
                    <p className="font-bold text-sm text-slate-900">{r.label}</p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                placeholder="John Doe"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="john@university.edu"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                required
                value={formData.confirmPassword}
                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>

            <Button type="submit" className="w-full h-12 text-base" isLoading={isLoading}>
              <UserPlus size={20} className="mr-2" />
              Create Account
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                Sign in instead
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
