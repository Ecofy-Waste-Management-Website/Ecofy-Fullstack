import React from 'react';
import { theme } from '../theme';

export const Card = ({
  children,
  title,
  className = '',
  padding = true,
  ...props
}) => {
  return (
    <div className={`rounded-3xl border border-gray-200 bg-white shadow-sm ${padding ? 'p-6' : ''} ${className}`} {...props}>
      {title && (
        <h3 className="text-lg font-black text-gray-900 mb-4">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default Card;
