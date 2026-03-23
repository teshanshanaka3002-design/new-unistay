import React, { useState } from 'react';
import { ValidatedInput, SelectField, TextAreaField } from './FormElements';
import { Button } from '../UI';
import { motion } from 'motion/react';
import { CheckCircle2, Upload, X } from 'lucide-react';

import { validateFullName, validatePhone } from '../../lib/validation';

interface IssueFormData {
  fullName: string;
  userId: string;
  contactNumber: string;
  boardingName: string;
  issueType: string;
  description: string;
}

interface FormErrors {
  [key: string]: string;
}

export const IssueReportForm: React.FC = () => {
  const [formData, setFormData] = useState<IssueFormData>({
    fullName: '',
    userId: '',
    contactNumber: '',
    boardingName: '',
    issueType: '',
    description: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const validate = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'fullName':
        error = validateFullName(value);
        break;
      case 'userId':
        if (!value) error = 'User ID is required';
        break;
      case 'contactNumber':
        error = validatePhone(value);
        break;
      case 'description':
        if (!value) error = 'Issue description is required';
        else if (value.length < 10) error = 'Must be at least 10 characters';
        break;
      case 'issueType':
        if (!value) error = 'Please select an issue type';
        break;
    }
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Real-time validation
    setErrors(prev => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validate(name, formData[name as keyof IssueFormData]) }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const isFormValid = () => {
    const newErrors: FormErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validate(key, formData[key as keyof IssueFormData]);
      if (error) newErrors[key] = error;
    });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      const allTouched: { [key: string]: boolean } = {};
      Object.keys(formData).forEach(key => allTouched[key] = true);
      setTouched(allTouched);
      
      const newErrors: FormErrors = {};
      Object.keys(formData).forEach(key => {
        const error = validate(key, formData[key as keyof IssueFormData]);
        if (error) newErrors[key] = error;
      });
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSuccess(true);
    
    setTimeout(() => {
      setIsSuccess(false);
      setFormData({
        fullName: '',
        userId: '',
        contactNumber: '',
        boardingName: '',
        issueType: '',
        description: '',
      });
      setTouched({});
      setErrors({});
      setImagePreview(null);
    }, 5000);
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center space-y-6"
      >
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-xl shadow-emerald-100/50">
          <CheckCircle2 size={48} />
        </div>
        <div className="space-y-2">
          <h3 className="text-3xl font-serif text-ink">Issue Reported!</h3>
          <p className="text-ink/50 max-w-md mx-auto">Your issue has been reported to the boarding owner. They will be notified immediately.</p>
        </div>
        <Button onClick={() => setIsSuccess(false)} variant="secondary">Report Another Issue</Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ValidatedInput 
          label="Full Name"
          name="fullName"
          placeholder="e.g. John Doe"
          value={formData.fullName}
          onChange={handleChange}
          onBlur={() => handleBlur('fullName')}
          error={errors.fullName}
          success={touched.fullName && !errors.fullName}
          required
        />
        <ValidatedInput 
          label="User ID"
          name="userId"
          placeholder="e.g. STU-12345"
          value={formData.userId}
          onChange={handleChange}
          onBlur={() => handleBlur('userId')}
          error={errors.userId}
          success={touched.userId && !errors.userId}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ValidatedInput 
          label="Contact Number"
          name="contactNumber"
          placeholder="e.g. 0771234567"
          value={formData.contactNumber}
          onChange={handleChange}
          onBlur={() => handleBlur('contactNumber')}
          error={errors.contactNumber}
          success={touched.contactNumber && !errors.contactNumber}
          required
        />
        <ValidatedInput 
          label="Boarding Name"
          name="boardingName"
          placeholder="e.g. Royal Palms Residency"
          value={formData.boardingName}
          onChange={handleChange}
          onBlur={() => handleBlur('boardingName')}
          error={errors.boardingName}
          success={touched.boardingName && !errors.boardingName}
        />
      </div>

      <SelectField 
        label="Issue Type"
        name="issueType"
        value={formData.issueType}
        onChange={handleChange}
        onBlur={() => handleBlur('issueType')}
        error={errors.issueType}
        success={touched.issueType && !errors.issueType}
        required
        options={[
          { value: 'Maintenance', label: 'Maintenance (Water, Electricity, etc.)' },
          { value: 'Payment Issue', label: 'Payment Issue' },
          { value: 'Safety Issue', label: 'Safety Issue' },
          { value: 'Other', label: 'Other' },
        ]}
      />

      <TextAreaField 
        label="Issue Description"
        name="description"
        placeholder="Please describe the issue in detail..."
        value={formData.description}
        onChange={handleChange}
        onBlur={() => handleBlur('description')}
        error={errors.description}
        success={touched.description && !errors.description}
        required
        maxChars={500}
      />

      <div className="space-y-4">
        <label className="text-[10px] font-bold uppercase tracking-widest text-ink/40 ml-4">Upload Image (Optional)</label>
        <div className="relative aspect-video rounded-[2rem] border-2 border-dashed border-ink/10 bg-white flex flex-col items-center justify-center overflow-hidden group transition-all hover:border-gold/30">
          {imagePreview ? (
            <>
              <img src={imagePreview} className="w-full h-full object-contain" />
              <button 
                type="button"
                onClick={() => setImagePreview(null)}
                className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md rounded-full text-ink shadow-lg hover:bg-white transition-colors"
              >
                <X size={16} />
              </button>
            </>
          ) : (
            <>
              <Upload size={40} className="text-ink/10 mb-4 group-hover:scale-110 transition-transform" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Click to select or drag and drop</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-ink/20 mt-2">PNG, JPG up to 5MB</p>
              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                accept="image/*"
                onChange={handleImageChange}
              />
            </>
          )}
        </div>
      </div>

      <div className="pt-6">
        <Button 
          type="submit" 
          className="w-full h-16 text-sm uppercase tracking-widest font-bold shadow-xl shadow-ink/10"
          isLoading={isSubmitting}
          disabled={!isFormValid()}
        >
          Report Issue
        </Button>
      </div>
    </form>
  );
};
