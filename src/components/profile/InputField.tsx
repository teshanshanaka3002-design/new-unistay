import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ValidationMessage, Label } from '../requests/FormElements';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  required?: boolean;
  icon?: React.ReactNode;
}

export const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  error, 
  success, 
  required, 
  icon,
  className, 
  ...props 
}) => {
  return (
    <div className="space-y-2 w-full">
      {label && <Label required={required}>{label}</Label>}
      <div className="relative group">
        {icon && (
          <div className={cn(
            "absolute left-6 top-1/2 -translate-y-1/2 transition-colors duration-300",
            error ? "text-red-500" : success ? "text-emerald-500" : "text-ink/20 group-focus-within:text-gold"
          )}>
            {icon}
          </div>
        )}
        <input
          className={cn(
            'flex h-14 w-full rounded-full border border-black/5 bg-white py-2 text-sm placeholder:text-ink/20 focus:outline-none focus:ring-4 focus:ring-gold/10 disabled:cursor-not-allowed disabled:opacity-50 transition-all',
            icon ? 'pl-16 pr-6' : 'px-6',
            error && 'border-red-500 focus:ring-red-500/20',
            success && !error && 'border-emerald-500 focus:ring-emerald-500/20',
            className
          )}
          {...props}
        />
      </div>
      <ValidationMessage message={error} />
    </div>
  );
};
