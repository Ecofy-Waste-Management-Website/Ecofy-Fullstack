// Design System / Theme Configuration
// Centralized colors, typography, spacing, and other design tokens

export const theme = {
  colors: {
    // Primary Eco-Green
    primary: '#397239',
    primaryLight: '#6B9F7E',
    primaryDark: '#244c21',

    // Semantic Colors
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#0A84FF',

    // Neutral Grays
    neutral: {
      50: '#F5F5F7',
      100: '#EFEFF2',
      200: '#E5E5EA',
      300: '#D1D1D6',
      400: '#C7C7CC',
      500: '#A2A2A7',
      600: '#8E8E93',
      700: '#636366',
      800: '#48484A',
      900: '#1C1C1E',
    },

    // Contextual Status Colors
    status: {
      active: '#34C759',
      pending: '#FF9500',
      error: '#FF3B30',
      inactive: '#8E8E93',
    },

    // Semantic Backgrounds
    background: '#FFFFFF',
    surface: '#F5F5F7',
    border: '#E5E5EA',
  },

  typography: {
    // Font families
    fontFamily: {
      base: 'system-ui, -apple-system, sans-serif',
      mono: 'Menlo, monospace',
    },

    // Font sizes (in px)
    fontSize: {
      xs: '10px',      // caption
      sm: '12px',      // label
      base: '14px',    // body
      md: '16px',      // subheading
      lg: '18px',      // heading3
      xl: '20px',      // heading2
      '2xl': '24px',   // heading1
    },

    // Font weights
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      black: 900,
    },

    // Line heights
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },

    // Predefined text styles
    heading1: {
      size: '24px',
      weight: 600,
      lineHeight: 1.2,
    },
    heading2: {
      size: '20px',
      weight: 600,
      lineHeight: 1.3,
    },
    heading3: {
      size: '16px',
      weight: 600,
      lineHeight: 1.4,
    },
    body: {
      size: '14px',
      weight: 400,
      lineHeight: 1.5,
    },
    label: {
      size: '12px',
      weight: 500,
      lineHeight: 1.5,
    },
    caption: {
      size: '10px',
      weight: 400,
      lineHeight: 1.4,
    },
  },

  spacing: {
    // 8px base unit
    0: '0px',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
  },

  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },

  borderRadius: {
    none: '0px',
    sm: '4px',
    base: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '20px',
    full: '9999px',
  },

  // Component specific configurations
  components: {
    button: {
      size: {
        sm: {
          padding: '6px 12px',
          fontSize: '12px',
          height: '28px',
        },
        md: {
          padding: '8px 16px',
          fontSize: '14px',
          height: '36px',
        },
        lg: {
          padding: '10px 20px',
          fontSize: '16px',
          height: '44px',
        },
      },
      borderRadius: '8px',
      transition: 'all 0.2s ease-in-out',
    },

    input: {
      borderRadius: '8px',
      padding: '8px 12px',
      fontSize: '14px',
      height: '36px',
      border: '1px solid #E5E5EA',
      transition: 'all 0.2s ease-in-out',
    },

    card: {
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      backgroundColor: '#FFFFFF',
    },

    badge: {
      borderRadius: '6px',
      padding: '4px 8px',
      fontSize: '10px',
      fontWeight: 500,
    },
  },

  // Transitions
  transitions: {
    fast: '0.1s ease-in-out',
    base: '0.2s ease-in-out',
    slow: '0.3s ease-in-out',
  },
};

// Helper function to get computed styles
export const getStyles = (component, variant = 'default') => {
  const styles = theme.components[component];
  return styles && styles[variant] ? styles[variant] : styles;
};
