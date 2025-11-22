import React, { InputHTMLAttributes, useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, icon: Icon, error, className = '', value, onFocus, onBlur, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value !== '';
  const isFloating = isFocused || hasValue;

  return (
    <div className={`relative mb-5 ${className}`}>
      <div className="relative">
        {Icon && (
          <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${isFocused ? 'text-brand-500' : 'text-gray-400'}`}>
            <Icon size={20} />
          </div>
        )}
        
        <input
          {...props}
          value={value}
          className={`
            w-full bg-white dark:bg-dark-card 
            text-gray-900 dark:text-gray-100 
            border-2 rounded-xl px-4 py-3.5 outline-none transition-all duration-200
            ${Icon ? 'pl-12' : ''}
            ${error 
              ? 'border-red-500 focus:border-red-500' 
              : 'border-gray-200 dark:border-dark-border focus:border-brand-500 dark:focus:border-brand-500'
            }
            placeholder-transparent peer
          `}
          placeholder={label}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
        />
        
        <label
          className={`
            absolute pointer-events-none transition-all duration-200
            ${Icon && !isFloating ? 'left-12' : 'left-4'}
            ${isFloating 
              ? '-top-2.5 text-xs bg-white dark:bg-dark-card px-1 text-brand-500 font-medium' 
              : 'top-3.5 text-base text-gray-500 dark:text-gray-400'
            }
          `}
        >
          {label}
        </label>
      </div>
      {error && (
        <p className="absolute -bottom-5 left-1 text-xs text-red-500 animate-fade-in">{error}</p>
      )}
    </div>
  );
};

export default Input;