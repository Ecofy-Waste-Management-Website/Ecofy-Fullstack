import React from 'react';
import { theme } from '../theme';

export const Card = ({
  children,
  title,
  className = '',
  padding = true,
  shadow = 'base',
  ...props
}) => {
  const styles = {
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.background,
    boxShadow: theme.shadows[shadow],
    padding: padding ? theme.components.card.padding : '0px',
    overflow: 'hidden',
  };

  return (
    <div style={styles} className={className} {...props}>
      {title && (
        <h3
          style={{
            fontSize: theme.typography.heading2.size,
            fontWeight: theme.typography.heading2.weight,
            color: theme.colors.neutral[900],
            marginBottom: theme.spacing[4],
            padding: padding ? '0px' : theme.spacing[4],
          }}
        >
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default Card;
