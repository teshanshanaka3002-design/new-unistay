import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  children, 
  disabled,
  ...props 
}) => {
  const variants = {
    primary: 'bg-ink text-white hover:opacity-90 shadow-sm active:scale-[0.98]',
    secondary: 'bg-paper text-ink border border-black/10 hover:bg-white active:scale-[0.98]',
    outline: 'bg-transparent border border-black/10 text-ink hover:bg-paper active:scale-[0.98]',
    ghost: 'bg-transparent text-ink hover:bg-black/5 active:scale-[0.98]',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm active:scale-[0.98]',
    gold: 'bg-gold text-white hover:opacity-90 shadow-sm active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs rounded-full',
    md: 'px-8 py-3 text-sm rounded-full',
    lg: 'px-10 py-4 text-base rounded-full',
    icon: 'p-3 rounded-full',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]',
        variants[variant as keyof typeof variants] || variants.primary,
        sizes[size],
        className
      )}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
};

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
  return (
    <div className="space-y-2 w-full">
      {label && <label className="text-[10px] font-bold uppercase tracking-widest text-ink/40 ml-4">{label}</label>}
      <input
        className={cn(
          'flex h-12 w-full rounded-full border border-black/5 bg-white px-6 py-2 text-sm placeholder:text-ink/20 focus:outline-none focus:ring-4 focus:ring-gold/10 disabled:cursor-not-allowed disabled:opacity-50 transition-all',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && <p className="text-[10px] font-bold text-red-500 mt-1 ml-4 uppercase tracking-widest">{error}</p>}
    </div>
  );
};

// Card Component
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export const Card: React.FC<CardProps> = ({ children, className, title, description, ...props }) => {
  return (
    <div 
      className={cn('bg-white rounded-[2rem] border border-black/5 shadow-sm overflow-hidden', className)}
      {...props}
    >
      {(title || description) && (
        <div className="p-10 border-b border-black/5 bg-paper/50">
          {title && <h3 className="text-3xl font-serif text-ink">{title}</h3>}
          {description && <p className="text-sm text-ink/50 mt-2 leading-relaxed">{description}</p>}
        </div>
      )}
      <div className="p-10">{children}</div>
    </div>
  );
};

// Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer, maxWidth = 'lg' }) => {
  if (!isOpen) return null;

  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className={cn(
        "bg-white rounded-[2.5rem] shadow-2xl w-full overflow-hidden border border-black/5 animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]",
        maxWidths[maxWidth]
      )}>
        {title && (
          <div className="flex items-center justify-between p-8 border-b border-black/5">
            <h3 className="text-2xl font-serif text-ink">{title}</h3>
            <button onClick={onClose} className="p-2 text-ink/40 hover:text-ink hover:bg-black/5 rounded-full transition-all">
              <X size={24} />
            </button>
          </div>
        )}
        <div className="p-8 overflow-y-auto custom-scrollbar flex-1">{children}</div>
        {footer && <div className="p-8 border-t border-black/5 bg-paper/30 flex justify-end gap-4">{footer}</div>}
      </div>
    </div>
  );
};

// Badge Component
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({ children, className, variant = 'primary', ...props }) => {
  const variants = {
    primary: 'bg-blue-100 text-blue-700 border-blue-200',
    secondary: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    danger: 'bg-red-100 text-red-700 border-red-200',
    outline: 'bg-transparent text-slate-600 border-slate-200',
  };

  return (
    <span 
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

// Container Component
export const Container: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  return (
    <div className={cn('max-w-7xl mx-auto px-4 md:px-8 w-full', className)}>
      {children}
    </div>
  );
};

import { X } from 'lucide-react';
