import React from 'react';
import { theme } from '../theme';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = {
    fontFamily: theme.typography.fontFamily.base,
    borderRadius: theme.components.button.borderRadius,
    transition: theme.components.button.transition,
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: theme.components.button.size[size]?.fontSize || theme.typography.fontSize.base,
    padding: theme.components.button.size[size]?.padding || theme.components.button.size.md.padding,
    height: theme.components.button.size[size]?.height || theme.components.button.size.md.height,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing[2],
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.6 : 1,
  };

  let variantStyles = {};

  switch (variant) {
    case 'primary':
      variantStyles = {
        backgroundColor: theme.colors.primary,
        color: '#FFFFFF',
        fontWeight: theme.typography.fontWeight.semibold,
      };
      break;

    case 'secondary':
      variantStyles = {
        backgroundColor: theme.colors.primaryLight,
        color: '#FFFFFF',
        fontWeight: theme.typography.fontWeight.semibold,
      };
      break;

    case 'danger':
      variantStyles = {
        backgroundColor: theme.colors.error,
        color: '#FFFFFF',
        fontWeight: theme.typography.fontWeight.semibold,
      };
      break;

    case 'outline':
      variantStyles = {
        backgroundColor: 'transparent',
        color: theme.colors.primary,
        border: `1.5px solid ${theme.colors.primary}`,
        fontWeight: theme.typography.fontWeight.semibold,
      };
      break;

    case 'ghost':
      variantStyles = {
        backgroundColor: 'transparent',
        color: theme.colors.primary,
        fontWeight: theme.typography.fontWeight.semibold,
      };
      break;

    default:
      variantStyles = {
        backgroundColor: theme.colors.neutral[300],
        color: theme.colors.neutral[900],
        fontWeight: theme.typography.fontWeight.semibold,
      };
  }

  const hoverStyles = !disabled ? {
    '&:hover': {
      opacity: 0.9,
      transform: variant === 'outline' ? 'none' : 'translateY(-1px)',
    },
  } : {};

  return (
    <button
      style={{ ...baseStyles, ...variantStyles }}
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
