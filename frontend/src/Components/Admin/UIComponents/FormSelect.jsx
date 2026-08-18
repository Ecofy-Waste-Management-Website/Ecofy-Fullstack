import React from 'react';
import { theme } from '../theme';

export const FormSelect = ({
  label,
  error,
  disabled = false,
  placeholder = 'Select an option',
  options = [],
  value,
  onChange,
  className = '',
  ...props
}) => {
  const baseStyles = {
    width: '100%',
    fontFamily: theme.typography.fontFamily.base,
    fontSize: theme.typography.fontSize.base,
    padding: theme.components.input.padding,
    height: theme.components.input.height,
    border: `1px solid ${error ? theme.colors.error : theme.colors.border}`,
    borderRadius: theme.components.input.borderRadius,
    transition: theme.components.input.transition,
    outline: 'none',
    backgroundColor: disabled ? theme.colors.neutral[50] : '#FFFFFF',
    color: disabled ? theme.colors.neutral[500] : theme.colors.neutral[900],
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label
          style={{
            display: 'block',
            marginBottom: theme.spacing[2],
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.neutral[700],
          }}
        >
          {label}
        </label>
      )}
      <select
        disabled={disabled}
        value={value}
        onChange={onChange}
        style={baseStyles}
        className={className}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
      {error && (
        <span
          style={{
            display: 'block',
            marginTop: theme.spacing[1],
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.error,
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
};

export default FormSelect;
