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

      // Mock user data based on email for testing or saved registration role
      let role: Role = 'STUDENT';
      const savedRole = localStorage.getItem(`mock_role_${formData.email}`);
      
      if (savedRole) {
        role = savedRole as Role;
      } else if (formData.email.includes('admin')) {
        role = 'ADMIN';
      } else if (formData.email.includes('boarding')) {
        role = 'BOARDING_OWNER';
      } else if (formData.email.includes('restaurant')) {
        role = 'RESTAURANT_OWNER';
      }

      login('mock-jwt-token', {
        id: '1',
        email: formData.email,
        name: formData.email.split('@')[0],
        role: role,
      });

      const dashboardPath = role === 'STUDENT' ? '/dashboard/student' : 
                          role === 'BOARDING_OWNER' ? '/owner-dashboard' :
                          role === 'RESTAURANT_OWNER' ? '/restaurant-dashboard' :
                          '/dashboard/admin';
      
      navigate(dashboardPath);
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col md:flex-row">
      {/* Left Side: Branding/Editorial */}
      <div className="hidden md:flex md:w-1/2 bg-ink p-20 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-8xl font-serif text-white leading-none tracking-tighter">
            UNI<br />stay
          </h1>
          <p className="text-gold mt-8 text-xl font-serif italic">
            The art of university living.
          </p>
        </div>
        
        <div className="relative z-10">
          <div className="h-px w-20 bg-gold mb-8" />
          <p className="text-white/40 text-sm uppercase tracking-[0.2em] font-bold">
            Premium Student Accommodations & Dining
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -bottom-20 -left-20 w-96 h-96 border border-white/5 rounded-full" />
        <div className="absolute top-40 -right-20 w-64 h-64 border border-gold/10 rounded-full" />
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-paper">
        <div className="w-full max-w-md space-y-12">
          <div className="space-y-4">
            <h2 className="text-5xl font-serif text-ink">Welcome Back</h2>
            <p className="text-ink/40 font-medium">Please enter your credentials to continue your journey.</p>
          </div>

          <div className="space-y-8">
            {/* Admin Access Info - Subtle */}
            <div className="p-6 rounded-[2rem] bg-white border border-black/5 text-[10px] uppercase tracking-widest font-bold text-gold space-y-2">
              <p className="text-gold">Quick Access (Testing):</p>
              <div className="flex justify-between">
                <span>Admin: admin@uni.edu</span>
                <span>Pass: AdminPassword123!</span>
              </div>
              <div className="flex justify-between mt-2 pt-2 border-t border-black/5">
                <span>Owner: boarding@uni.edu</span>
                <span>Pass: any</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-3 px-8">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                  {error}
                </div>
              )}
              
              <div className="space-y-6">
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
              </div>

              <div className="flex items-center justify-between px-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded-full border-black/10 text-gold focus:ring-gold" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40 group-hover:text-gold transition-colors">Remember me</span>
                </label>
                <Link to="/forgot-password" size="sm" className="text-[10px] font-bold uppercase tracking-widest text-gold hover:text-ink transition-colors">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full" isLoading={isLoading}>
                Sign In
              </Button>
            </form>

            <div className="text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink/40">
                Don't have an account?{' '}
                <Link to="/register" className="text-gold hover:text-ink transition-colors">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
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
      
      // Save the role to local storage so the mock login can use it
      localStorage.setItem(`mock_role_${formData.email}`, role);
      
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
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center p-8 py-20">
      <div className="w-full max-w-4xl space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-serif text-ink">Create an Account</h1>
          <p className="text-ink/40 font-medium">Join the UNIstay community today.</p>
        </div>

        <Card className="p-12">
          <form onSubmit={handleSubmit} className="space-y-12">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-3 px-8">
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                {error}
              </div>
            )}

            <div className="space-y-6">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40 ml-4">Select Your Role</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id as Role)}
                    className={`p-8 rounded-[2rem] border text-left transition-all duration-500 ${
                      role === r.id 
                        ? 'border-gold bg-paper shadow-lg shadow-gold/5' 
                        : 'border-black/5 bg-white hover:border-black/10'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 transition-colors duration-500 ${
                      role === r.id ? 'bg-ink text-white' : 'bg-paper text-ink/40'
                    }`}>
                      {r.icon}
                    </div>
                    <p className={`font-serif text-xl transition-colors ${role === r.id ? 'text-ink' : 'text-ink/60'}`}>{r.label}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-ink/30 mt-2 leading-relaxed">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Create Account
            </Button>
          </form>

          <div className="mt-12 pt-8 border-t border-black/5 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink/40">
              Already have an account?{' '}
              <Link to="/login" className="text-gold hover:text-ink transition-colors">
                Sign in instead
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
