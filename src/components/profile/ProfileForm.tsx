import React, { useState, useEffect } from 'react';
import { useAuth, User } from '../../context/AuthContext';
import { InputField } from './InputField';
import { SelectField } from '../requests/FormElements';
import { Button } from '../UI';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  GraduationCap, 
  IdCard, 
  CheckCircle2, 
  Loader2,
  Edit3,
  Save,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProfileFormProps {
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ isEditing, setIsEditing }) => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState<User>(user || { id: '', email: '', name: '', role: 'STUDENT' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const validate = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!value) error = 'Full name is required';
        else if (value.length < 3) error = 'Must be at least 3 characters';
        break;
      case 'email':
        if (!value) error = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Enter a valid email address';
        break;
      case 'phoneNumber':
        if (!value) error = 'Phone number is required';
        else if (!/^\d{10}$/.test(value)) error = 'Phone number must be 10 digits';
        break;
      case 'university':
        if (!value) error = 'University is required';
        break;
      case 'studentId':
        if (!value) error = 'Student ID is required';
        break;
      case 'nationalId':
        if (!value) error = 'National ID is required';
        else if (value.length < 10) error = 'National ID must be at least 10 characters';
        break;
    }
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validate(name, value) }));
    }
  };

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validate(name, (formData as any)[name] || '') }));
  };

  const isFormValid = () => {
    const requiredFields = ['name', 'email', 'phoneNumber', 'university', 'studentId', 'nationalId'];
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    requiredFields.forEach(field => {
      const error = validate(field, (formData as any)[field] || '');
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      const allTouched: { [key: string]: boolean } = {};
      ['name', 'email', 'phoneNumber', 'university', 'studentId', 'nationalId'].forEach(f => allTouched[f] = true);
      setTouched(allTouched);
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    updateUser(formData);
    setIsSubmitting(false);
    setIsEditing(false);
    setSuccessMessage('Profile updated successfully!');
    
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const universityOptions = [
    { value: 'SLIIT', label: 'SLIIT' },
    { value: 'NSBM', label: 'NSBM' },
    { value: 'IIT', label: 'IIT' },
    { value: 'UOM', label: 'University of Moratuwa' },
    { value: 'UOK', label: 'University of Kelaniya' },
    { value: 'NIBM', label: 'NIBM' },
  ];

  const DetailItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
    <div className="flex items-center gap-6 p-6 rounded-[2rem] bg-paper/30 border border-black/5 group hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all duration-500">
      <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-ink/20 group-hover:text-gold transition-colors shadow-sm">
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-ink/30">{label}</p>
        <p className="text-lg font-medium text-ink">{value || 'Not provided'}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-12">
      <AnimatePresence mode="wait">
        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl flex items-center gap-3 text-sm font-bold uppercase tracking-widest justify-center"
          >
            <CheckCircle2 size={18} />
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {!isEditing ? (
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DetailItem icon={<UserIcon size={24} />} label="Full Name" value={formData.name} />
            <DetailItem icon={<Mail size={24} />} label="Email Address" value={formData.email} />
            <DetailItem icon={<Phone size={24} />} label="Phone Number" value={formData.phoneNumber || ''} />
            <DetailItem icon={<GraduationCap size={24} />} label="University" value={formData.university || ''} />
            <DetailItem icon={<IdCard size={24} />} label="Student ID" value={formData.studentId || ''} />
            <DetailItem icon={<IdCard size={24} />} label="National ID" value={formData.nationalId || ''} />
          </div>
          <div className="flex justify-center">
            <Button 
              onClick={() => setIsEditing(true)}
              className="px-12 h-16 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-ink/10"
            >
              <Edit3 size={18} />
              Edit Profile
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InputField 
              label="Full Name"
              name="name"
              icon={<UserIcon size={20} />}
              value={formData.name}
              onChange={handleChange}
              onBlur={() => handleBlur('name')}
              error={touched.name ? errors.name : ''}
              success={touched.name && !errors.name}
              required
            />
            <InputField 
              label="Email Address"
              name="email"
              type="email"
              icon={<Mail size={20} />}
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur('email')}
              error={touched.email ? errors.email : ''}
              success={touched.email && !errors.email}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InputField 
              label="Phone Number"
              name="phoneNumber"
              icon={<Phone size={20} />}
              value={formData.phoneNumber || ''}
              onChange={handleChange}
              onBlur={() => handleBlur('phoneNumber')}
              error={touched.phoneNumber ? errors.phoneNumber : ''}
              success={touched.phoneNumber && !errors.phoneNumber}
              required
            />
            <SelectField 
              label="University"
              name="university"
              value={formData.university || ''}
              onChange={handleChange}
              onBlur={() => handleBlur('university')}
              error={touched.university ? errors.university : ''}
              success={touched.university && !errors.university}
              required
              options={universityOptions}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InputField 
              label="Student ID"
              name="studentId"
              icon={<IdCard size={20} />}
              value={formData.studentId || ''}
              onChange={handleChange}
              onBlur={() => handleBlur('studentId')}
              error={touched.studentId ? errors.studentId : ''}
              success={touched.studentId && !errors.studentId}
              required
            />
            <InputField 
              label="National ID"
              name="nationalId"
              icon={<IdCard size={20} />}
              value={formData.nationalId || ''}
              onChange={handleChange}
              onBlur={() => handleBlur('nationalId')}
              error={touched.nationalId ? errors.nationalId : ''}
              success={touched.nationalId && !errors.nationalId}
              required
            />
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-6">
            <Button 
              type="submit"
              isLoading={isSubmitting}
              disabled={!isFormValid() && Object.keys(touched).length > 0}
              className="w-full md:w-64 h-16 rounded-full text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-ink/10"
            >
              <Save size={18} />
              Save Changes
            </Button>
            <button 
              type="button"
              onClick={() => setIsEditing(false)}
              className="w-full md:w-64 h-16 rounded-full text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3 border border-black/5 hover:bg-black/5 transition-all text-ink/40 hover:text-ink"
            >
              <X size={18} />
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
