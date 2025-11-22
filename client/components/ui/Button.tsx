import React, { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyles = "relative flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-200 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
  
  const variants = {
    primary: "bg-brand-500 hover:bg-brand-600 text-white shadow-[0_4px_20px_rgba(255,122,26,0.25)] hover:shadow-[0_8px_25px_rgba(255,122,26,0.35)] border border-transparent",
    secondary: "bg-dark-hover hover:bg-opacity-80 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700",
    ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-dark-hover text-gray-600 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;