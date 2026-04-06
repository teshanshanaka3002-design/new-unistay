import React, { useState, useEffect } from 'react';
import { ValidatedInput, SelectField, TextAreaField } from './FormElements';
import { Button } from '../UI';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { reportService } from '../../services/api';
import { validateFullName, validatePhone } from '../../lib/validation';
import { compressImage } from '../../lib/inputControl';

interface IssueFormData {
  fullName: string;
  studentIdNumber: string;
  university: string;
  contactNumber: string;
  title: string;
  issueType: string;
  description: string;
}

interface FormErrors {
  [key: string]: string;
}

export const IssueReportForm: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<IssueFormData>({
    fullName: user?.name || '',
    studentIdNumber: user?.studentId || '',
    university: user?.university || '',
    contactNumber: user?.phoneNumber || '',
    title: '',
    issueType: '',
    description: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Sync with user data if it loads late
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        studentIdNumber: prev.studentIdNumber || user.studentId || '',
        university: prev.university || user.university || '',
        contactNumber: prev.contactNumber || user.phoneNumber || '',
      }));
    }
  }, [user]);

  const validate = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'fullName':
        error = validateFullName(value);
        break;
      case 'studentIdNumber':
        if (!value) error = 'Student ID is required';
        break;
      case 'university':
        if (!value) error = 'University is required';
        break;
      case 'contactNumber':
        error = validatePhone(value);
        break;
      case 'title':
        if (!value) error = 'Issue title is required';
        else if (value.length < 5) error = 'Must be at least 5 characters';
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
    setErrors(prev => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validate(name, formData[name as keyof IssueFormData]) }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);
    const newImages = [...images];

    // Process each file
    const processFile = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const compressed = await compressImage(reader.result as string);
            resolve(compressed);
          } catch (err) {
            reject(err);
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    for (let i = 0; i < files.length; i++) {
      if (newImages.length >= 5) break;
      try {
        const result = await processFile(files[i]);
        newImages.push(result);
      } catch (err) {
        console.error('Image processing failed', err);
      }
    }

    setImages(newImages);
    setIsUploading(false);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
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
      return;
    }

    setIsSubmitting(true);
    try {
      await reportService.submitReport({
        ...formData,
        images
      });
      setIsSuccess(true);
      setFormData({
        fullName: user?.name || '',
        studentIdNumber: user?.studentId || '',
        university: user?.university || '',
        contactNumber: user?.phoneNumber || '',
        title: '',
        issueType: '',
        description: '',
      });
      setImages([]);
      setTouched({});
      setErrors({});
    } catch (err) {
      console.error('Submission failed', err);
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
        <div className="space-y-4">
          <h3 className="text-4xl font-serif text-ink">Request Successfully Logged</h3>
          <p className="text-ink/50 max-w-md mx-auto text-sm leading-relaxed">
            Your issue has been securely transmitted to the administration panel. You can track the progress and view replies in the **"My Reports"** tab.
          </p>
        </div>
        <div className="pt-8">
            <Button onClick={() => setIsSuccess(false)} variant="secondary" className="rounded-full px-12">Submit Another Report</Button>
        </div>
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
          label="Student ID Number"
          name="studentIdNumber"
          placeholder="e.g. STU-12345"
          value={formData.studentIdNumber}
          onChange={handleChange}
          onBlur={() => handleBlur('studentIdNumber')}
          error={errors.studentIdNumber}
          success={touched.studentIdNumber && !errors.studentIdNumber}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ValidatedInput 
          label="University"
          name="university"
          placeholder="e.g. SLIIT"
          value={formData.university}
          onChange={handleChange}
          onBlur={() => handleBlur('university')}
          error={errors.university}
          success={touched.university && !errors.university}
          required
        />
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
            <ValidatedInput 
                label="Issue Title"
                name="title"
                placeholder="Brief summary of the problem"
                value={formData.title}
                onChange={handleChange}
                onBlur={() => handleBlur('title')}
                error={errors.title}
                success={touched.title && !errors.title}
                required
            />
        </div>
        <SelectField 
            label="Issue Priority / Type"
            name="issueType"
            value={formData.issueType}
            onChange={handleChange}
            onBlur={() => handleBlur('issueType')}
            error={errors.issueType}
            success={touched.issueType && !errors.issueType}
            required
            options={[
                { value: 'Maintenance', label: 'Maintenance (Technical)' },
                { value: 'Payment', label: 'Financial / Payment' },
                { value: 'Security', label: 'Security & Safety' },
                { value: 'Health', label: 'Health & Hygiene' },
                { value: 'Other', label: 'General / Other' },
            ]}
        />
      </div>

      <TextAreaField 
        label="Detailed Description"
        name="description"
        placeholder="Please describe the issue in detail so we can help you faster..."
        value={formData.description}
        onChange={handleChange}
        onBlur={() => handleBlur('description')}
        error={errors.description}
        success={touched.description && !errors.description}
        required
        maxChars={500}
      />

      <div className="space-y-6">
        <div className="flex justify-between items-center px-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Visual Evidence (Optional)</label>
            <span className="text-[9px] font-black uppercase tracking-widest text-ink/20">{images.length} / 5 Images</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <AnimatePresence>
                {images.map((img, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative aspect-square rounded-3xl overflow-hidden border border-black/5 bg-paper group"
                    >
                        <img src={img} className="w-full h-full object-cover" />
                        <button 
                            type="button"
                            onClick={() => removeImage(i)}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                        >
                            <X size={12} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>

            {images.length < 5 && (
                <div className="relative aspect-square rounded-3xl border-2 border-dashed border-ink/10 bg-paper/50 flex flex-col items-center justify-center group hover:border-gold/30 hover:bg-white transition-all cursor-pointer overflow-hidden">
                    {isUploading ? (
                        <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <>
                            <Upload size={24} className="text-ink/10 mb-2 group-hover:scale-110 transition-transform" />
                            <p className="text-[8px] font-black uppercase tracking-widest text-ink/30">Add Photo</p>
                            <input 
                                type="file" 
                                className="absolute inset-0 opacity-0 cursor-pointer" 
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                            />
                        </>
                    )}
                </div>
            )}
        </div>
        
        <div className="flex items-center gap-3 p-4 bg-paper/50 rounded-2xl border border-black/5">
            <AlertCircle size={14} className="text-ink/20" />
            <p className="text-[9px] font-bold uppercase tracking-widest text-ink/40">Include clear images of the issue for faster resolution.</p>
        </div>
      </div>

      <div className="pt-6">
        <Button 
          type="submit" 
          className="w-full h-20 text-sm uppercase tracking-widest font-bold shadow-2xl shadow-ink/10 rounded-[2rem]"
          isLoading={isSubmitting}
          disabled={!isFormValid() || isUploading}
        >
          {isSubmitting ? 'Transmitting Data...' : 'Submit Official Report'}
        </Button>
      </div>
    </form>
  );
};
