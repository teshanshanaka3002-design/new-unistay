import React, { useState, useEffect } from 'react';
import { ValidatedInput, SelectField, TextAreaField, CheckboxGroup, RadioGroup } from './FormElements';
import { Button } from '../UI';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

import { validateFullName, validateAge, validateDate, getMinDate } from '../../lib/validation';
import { NOTE_MAX_WORDS, countWords, enforceWordLimit } from '../../lib/inputControl';

interface AccommodationFormData {
  fullName: string;
  age: string;
  moveInDate: string;
  university: string;
  preferredLocation: string;
  distance: string;
  minBudget: string;
  maxBudget: string;
  roomType: string;
  facilities: string[];
  notes: string;
}

interface FormErrors {
  [key: string]: string;
}

export const AccommodationRequestForm: React.FC = () => {
  const [formData, setFormData] = useState<AccommodationFormData>({
    fullName: '',
    age: '',
    moveInDate: '',
    university: '',
    preferredLocation: '',
    distance: '',
    minBudget: '',
    maxBudget: '',
    roomType: '',
    facilities: [],
    notes: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = (name: string, value: any) => {
    let error = '';
    switch (name) {
      case 'fullName':
        error = validateFullName(value);
        break;
      case 'age':
        error = validateAge(value);
        break;
      case 'moveInDate':
        error = validateDate(value);
        break;
      case 'university':
        if (!value) error = 'Please select your university';
        break;
      case 'preferredLocation':
        if (!value) error = 'Preferred location is required';
        break;
      case 'distance':
        if (!value) error = 'Distance is required';
        else if (isNaN(Number(value)) || Number(value) < 0) error = 'Must be a positive number';
        break;
      case 'minBudget':
      case 'maxBudget':
        if (!value) error = 'Budget is required';
        else if (isNaN(Number(value)) || Number(value) < 0) error = 'Must be a positive number';
        break;
      case 'preferences':
        if (!formData.roomType && formData.facilities.length === 0) {
          error = 'Please select at least one room type or facility preference';
        }
        break;
    }
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (name === 'notes') {
        return { ...prev, [name]: enforceWordLimit(prev.notes, value, NOTE_MAX_WORDS) };
      }
      return { ...prev, [name]: value };
    });
    // Real-time validation
    setErrors(prev => ({ ...prev, [name]: validate(name, value) }));
  };
  const noteWordCount = countWords(formData.notes);

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validate(name, formData[name as keyof AccommodationFormData]) }));
  };

  const handleFacilitiesChange = (values: string[]) => {
    setFormData(prev => ({ ...prev, facilities: values }));
    setErrors(prev => ({ ...prev, preferences: validate('preferences', null) }));
  };

  const handleRoomTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, roomType: value }));
    setErrors(prev => ({ ...prev, preferences: validate('preferences', null) }));
  };

  const isFormValid = () => {
    const newErrors: FormErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validate(key, formData[key as keyof AccommodationFormData]);
      if (error) newErrors[key] = error;
    });
    
    // Special check for preferences
    const prefError = validate('preferences', null);
    if (prefError) newErrors.preferences = prefError;

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      // Mark all as touched to show errors
      const allTouched: { [key: string]: boolean } = {};
      Object.keys(formData).forEach(key => allTouched[key] = true);
      setTouched(allTouched);
      
      const newErrors: FormErrors = {};
      Object.keys(formData).forEach(key => {
        const error = validate(key, formData[key as keyof AccommodationFormData]);
        if (error) newErrors[key] = error;
      });
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSuccess(true);
    
    // Reset form after success
    setTimeout(() => {
      setIsSuccess(false);
      setFormData({
        fullName: '',
        age: '',
        moveInDate: '',
        university: '',
        preferredLocation: '',
        distance: '',
        minBudget: '',
        maxBudget: '',
        roomType: '',
        facilities: [],
        notes: '',
      });
      setTouched({});
      setErrors({});
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
          <h3 className="text-3xl font-serif text-ink">Request Posted!</h3>
          <p className="text-ink/50 max-w-md mx-auto">Your accommodation request has been posted successfully. Boarding owners will be able to see your requirements.</p>
        </div>
        <Button onClick={() => setIsSuccess(false)} variant="secondary">Post Another Request</Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
          label="Age"
          name="age"
          type="number"
          placeholder="e.g. 20"
          value={formData.age}
          onChange={handleChange}
          onBlur={() => handleBlur('age')}
          error={errors.age}
          success={touched.age && !errors.age}
          required
        />
        <ValidatedInput 
          label="Move-in Date"
          name="moveInDate"
          type="date"
          min={getMinDate()}
          value={formData.moveInDate}
          onChange={handleChange}
          onBlur={() => handleBlur('moveInDate')}
          error={errors.moveInDate}
          success={touched.moveInDate && !errors.moveInDate}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <SelectField 
          label="University"
          name="university"
          value={formData.university}
          onChange={handleChange}
          onBlur={() => handleBlur('university')}
          error={errors.university}
          success={touched.university && !errors.university}
          required
          options={[
            { value: 'SLIIT', label: 'SLIIT' },
            { value: 'NSBM', label: 'NSBM' },
            { value: 'IIT', label: 'IIT' },
            { value: 'UOM', label: 'University of Moratuwa' },
            { value: 'UOK', label: 'University of Kelaniya' },
            { value: 'NIBM', label: 'NIBM' },
          ]}
        />
        <ValidatedInput 
          label="Preferred Location"
          name="preferredLocation"
          placeholder="e.g. Malabe, Kaduwela"
          value={formData.preferredLocation}
          onChange={handleChange}
          onBlur={() => handleBlur('preferredLocation')}
          error={errors.preferredLocation}
          success={touched.preferredLocation && !errors.preferredLocation}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ValidatedInput 
          label="Distance to University (km)"
          name="distance"
          type="number"
          step="0.1"
          placeholder="e.g. 1.5"
          value={formData.distance}
          onChange={handleChange}
          onBlur={() => handleBlur('distance')}
          error={errors.distance}
          success={touched.distance && !errors.distance}
          required
        />
        <div className="space-y-4">
          <Label required>Budget Range (LKR)</Label>
          <div className="grid grid-cols-2 gap-4">
            <ValidatedInput 
              name="minBudget"
              type="number"
              placeholder="Min"
              value={formData.minBudget}
              onChange={handleChange}
              onBlur={() => handleBlur('minBudget')}
              error={errors.minBudget}
              success={touched.minBudget && !errors.minBudget}
            />
            <ValidatedInput 
              name="maxBudget"
              type="number"
              placeholder="Max"
              value={formData.maxBudget}
              onChange={handleChange}
              onBlur={() => handleBlur('maxBudget')}
              error={errors.maxBudget}
              success={touched.maxBudget && !errors.maxBudget}
            />
          </div>
        </div>
      </div>

      <div className="space-y-10 p-8 rounded-[2.5rem] bg-paper/30 border border-black/5">
        <RadioGroup 
          label="Room Type Preference"
          options={[
            { value: 'Single', label: 'Single' },
            { value: 'Double', label: 'Double' },
            { value: 'Shared', label: 'Shared' },
          ]}
          selectedValue={formData.roomType}
          onChange={handleRoomTypeChange}
          error={touched.roomType ? errors.preferences : ''}
        />

        <CheckboxGroup 
          label="Required Facilities"
          options={[
            { value: 'WiFi', label: 'WiFi' },
            { value: 'AC', label: 'AC' },
            { value: 'Parking', label: 'Parking' },
            { value: 'Meals', label: 'Meals' },
            { value: 'Laundry', label: 'Laundry' },
          ]}
          selectedValues={formData.facilities}
          onChange={handleFacilitiesChange}
          error={touched.facilities ? errors.preferences : ''}
        />
      </div>

      <TextAreaField 
        label="Additional Notes"
        name="notes"
        placeholder="Any other specific requirements..."
        value={formData.notes}
        onChange={handleChange}
        maxWords={NOTE_MAX_WORDS}
        error={noteWordCount >= NOTE_MAX_WORDS ? 'Word limit reached (300 words)' : ''}
        success={noteWordCount > 0 && noteWordCount < NOTE_MAX_WORDS}
      />

      <div className="pt-6">
        <Button 
          type="submit" 
          className="w-full h-16 text-sm uppercase tracking-widest font-bold shadow-xl shadow-ink/10"
          isLoading={isSubmitting}
          disabled={!isFormValid()}
        >
          Post Accommodation Request
        </Button>
      </div>
    </form>
  );
};

const Label: React.FC<{ children: React.ReactNode; required?: boolean }> = ({ children, required }) => (
  <label className="text-[10px] font-bold uppercase tracking-widest text-ink/40 ml-4 flex items-center gap-1">
    {children}
    {required && <span className="text-red-500">*</span>}
  </label>
);
