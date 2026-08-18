import React from 'react';
import { theme } from '../theme';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  className = '',
  type = 'button',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variantClasses = {
    primary: 'bg-[#06a63e] hover:bg-[#058b33] text-white shadow-sm',
    secondary: 'bg-[#06a63e]/10 text-[#06a63e] hover:bg-[#06a63e]/20',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm',
    outline: 'border border-[#06a63e] text-[#06a63e] hover:bg-[#06a63e]/5',
    ghost: 'text-[#06a63e] hover:bg-gray-100',
    default: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
        sizeClasses[size] || sizeClasses.md
      } ${variantClasses[variant] || variantClasses.primary} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
