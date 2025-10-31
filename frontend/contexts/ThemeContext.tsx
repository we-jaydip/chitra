// ============================================================================
// FILE 2: app/contexts/ThemeContext.tsx
// ============================================================================
// COPY ENTIRE CONTENT BELOW AND PASTE INTO: app/contexts/ThemeContext.tsx

import React, { createContext, useContext, ReactNode } from 'react';
import theme from '@/lib/theme';

interface ThemeContextType {
  COLORS: typeof theme.COLORS;
  FONTS: typeof theme.FONTS;
  SPACING: typeof theme.SPACING;
  BORDER_RADIUS: typeof theme.BORDER_RADIUS;
  SHADOWS: typeof theme.SHADOWS;
  RESPONSIVE: typeof theme.RESPONSIVE;
  ANIMATIONS: typeof theme.ANIMATIONS;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const value: ThemeContextType = {
    COLORS: theme.COLORS,
    FONTS: theme.FONTS,
    SPACING: theme.SPACING,
    BORDER_RADIUS: theme.BORDER_RADIUS,
    SHADOWS: theme.SHADOWS,
    RESPONSIVE: theme.RESPONSIVE,
    ANIMATIONS: theme.ANIMATIONS,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error(
      'useTheme must be used within ThemeProvider'
    );
  }
  
  return context;
};

export default ThemeContext;
