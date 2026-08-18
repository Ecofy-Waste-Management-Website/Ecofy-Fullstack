import React from 'react';
import { theme } from '../theme';

export const FormInput = ({
  label,
  error,
  disabled = false,
  placeholder,
  className = '',
  type = 'text',
  value,
  onChange,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-1.5 text-xs font-bold uppercase tracking-widest text-gray-400">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={onChange}
        className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-900 outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed ${
          error
            ? 'border-red-500 focus:ring-2 focus:ring-red-200'
            : 'border-gray-300 bg-white focus:border-[#06a63e] focus:ring-2 focus:ring-[#06a63e]/20'
        } ${className}`}
        {...props}
      />
      {error && (
        <span className="block mt-1 text-xs font-bold text-red-500">
          {error}
        </span>
      )}
    </div>
  );
};

export default FormInput;
