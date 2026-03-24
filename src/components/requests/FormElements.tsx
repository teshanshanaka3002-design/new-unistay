import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { Input } from '../UI';
import { countWords } from '../../lib/inputControl';

interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  required?: boolean;
}

export const ValidatedInput: React.FC<ValidatedInputProps> = ({ 
  label, 
  error, 
  success, 
  required, 
  className, 
  ...props 
}) => {
  return (
    <div className="space-y-2 w-full">
      {label && <Label required={required}>{label}</Label>}
      <input
        className={cn(
          'flex h-12 w-full rounded-full border border-black/5 bg-white px-6 py-2 text-sm placeholder:text-ink/20 focus:outline-none focus:ring-4 focus:ring-gold/10 disabled:cursor-not-allowed disabled:opacity-50 transition-all',
          error && 'border-red-500 focus:ring-red-500/20',
          success && !error && 'border-emerald-500 focus:ring-emerald-500/20',
          className
        )}
        {...props}
      />
      <ValidationMessage message={error} />
      {success && !error && <ValidationMessage message="Looks good!" type="success" />}
    </div>
  );
};

interface ValidationMessageProps {
  message?: string;
  type?: 'error' | 'success';
}

export const ValidationMessage: React.FC<ValidationMessageProps> = ({ message, type = 'error' }) => {
  if (!message) return null;
  return (
    <p className={cn(
      "text-[10px] font-bold mt-1 ml-4 uppercase tracking-widest animate-in fade-in slide-in-from-top-1 duration-200",
      type === 'error' ? "text-red-500" : "text-emerald-500"
    )}>
      {message}
    </p>
  );
};

interface LabelProps {
  children: React.ReactNode;
  required?: boolean;
}

export const Label: React.FC<LabelProps> = ({ children, required }) => (
  <label className="text-[10px] font-bold uppercase tracking-widest text-ink/40 ml-4 flex items-center gap-1">
    {children}
    {required && <span className="text-red-500">*</span>}
  </label>
);

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  success?: boolean;
  required?: boolean;
  options: { value: string; label: string }[];
}

export const SelectField: React.FC<SelectFieldProps> = ({ 
  label, 
  error, 
  success, 
  required, 
  options, 
  className, 
  ...props 
}) => {
  return (
    <div className="space-y-2 w-full">
      {label && <Label required={required}>{label}</Label>}
      <div className="relative">
        <select
          className={cn(
            'flex h-12 w-full rounded-full border border-black/5 bg-white px-6 py-2 text-sm appearance-none focus:outline-none focus:ring-4 focus:ring-gold/10 disabled:cursor-not-allowed disabled:opacity-50 transition-all cursor-pointer',
            error && 'border-red-500 focus:ring-red-500/20',
            success && !error && 'border-emerald-500 focus:ring-emerald-500/20',
            className
          )}
          {...props}
        >
          <option value="" disabled>{props.placeholder || 'Select an option'}</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-ink/20">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </div>
      </div>
      <ValidationMessage message={error} />
      {success && !error && <ValidationMessage message="Looks good!" type="success" />}
    </div>
  );
};

interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  success?: boolean;
  required?: boolean;
  maxChars?: number;
  maxWords?: number;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({ 
  label, 
  error, 
  success, 
  required, 
  maxChars, 
  maxWords,
  className, 
  value, 
  onChange,
  ...props 
}) => {
  const charCount = String(value || '').length;
  const wordCount = countWords(String(value || ''));
  const exceedsWordLimit = Boolean(maxWords && wordCount >= maxWords);

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (maxWords && countWords(e.target.value) > maxWords) {
      return;
    }
    onChange?.(e);
  };
  
  return (
    <div className="space-y-2 w-full">
      <div className="flex justify-between items-end pr-4">
        {label && <Label required={required}>{label}</Label>}
        {maxChars && (
          <span className={cn(
            "text-[9px] font-bold uppercase tracking-widest",
            charCount > maxChars ? "text-red-500" : "text-ink/20"
          )}>
            {charCount} / {maxChars}
          </span>
        )}
        {maxWords && (
          <span className={cn(
            "text-[9px] font-bold uppercase tracking-widest",
            exceedsWordLimit ? "text-red-500" : "text-ink/20"
          )}>
            {wordCount} / {maxWords} words
          </span>
        )}
      </div>
      <textarea
        className={cn(
          'flex min-h-[120px] w-full rounded-[2rem] border border-black/5 bg-white px-6 py-4 text-sm placeholder:text-ink/20 focus:outline-none focus:ring-4 focus:ring-gold/10 disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-none',
          error && 'border-red-500 focus:ring-red-500/20',
          success && !error && 'border-emerald-500 focus:ring-emerald-500/20',
          maxWords && exceedsWordLimit && 'border-red-500 focus:ring-red-500/20',
          maxWords && !exceedsWordLimit && !error && 'border-emerald-500 focus:ring-emerald-500/20',
          className
        )}
        value={value}
        onChange={handleTextAreaChange}
        {...props}
      />
      <ValidationMessage message={error} />
      {success && !error && <ValidationMessage message="Perfect description!" type="success" />}
    </div>
  );
};

interface CheckboxGroupProps {
  label: string;
  options: { value: string; label: string }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  error?: string;
  required?: boolean;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ 
  label, 
  options, 
  selectedValues, 
  onChange, 
  error, 
  required 
}) => {
  const toggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  return (
    <div className="space-y-4">
      <Label required={required}>{label}</Label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 px-2">
        {options.map(opt => {
          const isSelected = selectedValues.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggleOption(opt.value)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-2xl border transition-all text-left",
                isSelected 
                  ? "bg-gold/5 border-gold text-gold shadow-sm" 
                  : "bg-white border-black/5 text-ink/60 hover:border-black/10"
              )}
            >
              <div className={cn(
                "w-5 h-5 rounded-md border flex items-center justify-center transition-all",
                isSelected ? "bg-gold border-gold text-white" : "bg-paper border-black/10"
              )}>
                {isSelected && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">{opt.label}</span>
            </button>
          );
        })}
      </div>
      <ValidationMessage message={error} />
    </div>
  );
};

interface RadioGroupProps {
  label: string;
  options: { value: string; label: string }[];
  selectedValue: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ 
  label, 
  options, 
  selectedValue, 
  onChange, 
  error, 
  required 
}) => {
  return (
    <div className="space-y-4">
      <Label required={required}>{label}</Label>
      <div className="flex flex-wrap gap-3 px-2">
        {options.map(opt => {
          const isSelected = selectedValue === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={cn(
                "flex items-center gap-3 px-6 py-3 rounded-full border transition-all",
                isSelected 
                  ? "bg-ink border-ink text-white shadow-lg shadow-ink/10" 
                  : "bg-white border-black/5 text-ink/60 hover:border-black/10"
              )}
            >
              <div className={cn(
                "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all",
                isSelected ? "border-gold bg-gold" : "border-black/10 bg-paper"
              )}>
                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">{opt.label}</span>
            </button>
          );
        })}
      </div>
      <ValidationMessage message={error} />
    </div>
  );
};
