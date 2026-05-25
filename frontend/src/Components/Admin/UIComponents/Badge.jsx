import React from 'react';
import { theme } from '../theme';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.base,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
    padding: '4px 8px',
    whiteSpace: 'nowrap',
  };

  let variantStyles = {};

  switch (variant) {
    case 'active':
      variantStyles = {
        backgroundColor: `${theme.colors.success}15`,
        color: theme.colors.success,
      };
      break;

    case 'pending':
      variantStyles = {
        backgroundColor: `${theme.colors.warning}15`,
        color: theme.colors.warning,
      };
      break;

    case 'error':
      variantStyles = {
        backgroundColor: `${theme.colors.error}15`,
        color: theme.colors.error,
      };
      break;

    case 'inactive':
      variantStyles = {
        backgroundColor: theme.colors.neutral[200],
        color: theme.colors.neutral[600],
      };
      break;

    case 'info':
      variantStyles = {
        backgroundColor: `${theme.colors.info}15`,
        color: theme.colors.info,
      };
      break;

    case 'primary':
      variantStyles = {
        backgroundColor: `${theme.colors.primary}15`,
        color: theme.colors.primary,
      };
      break;

    default:
      variantStyles = {
        backgroundColor: theme.colors.neutral[100],
        color: theme.colors.neutral[700],
      };
  }

  return (
    <span style={{ ...baseStyles, ...variantStyles }} className={className} {...props}>
      {children}
    </span>
  );
};

export default Badge;
