// ============================================================================
// FILE 1: app/lib/theme.ts
// ============================================================================
// COPY ENTIRE CONTENT BELOW AND PASTE INTO: app/lib/theme.ts

export const COLORS = {
  primary: '#FF5200',
  primaryDark: '#E64A00',
  primaryLight: '#FF7A36',
  secondary: '#DC2626',
  secondaryLight: '#EF4444',
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  bgPrimary: '#FFFFFF',
  bgSecondary: '#F9FAFB',
  bgTertiary: '#F3F4F6',
  bgOverlay: 'rgba(0, 0, 0, 0.5)',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',
  gradientPrimary: ['#FF5200', '#FF7A36'],
  gradientFestive: ['#FF5200', '#DC2626'],
  gradientSuccess: ['#10B981', '#059669'],
};

export const FONTS = {
  family: {
    base: 'System',
    heading: 'System',
  },
  size: {
    xl4: 32,
    xl3: 28,
    xl2: 24,
    xl: 20,
    lg: 18,
    base: 16,
    sm: 14,
    xs: 12,
    xxs: 10,
  },
  weight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  lineHeight: {
    tight: 1.2,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  letterSpacing: {
    tighter: -0.5,
    tight: -0.25,
    normal: 0,
    wide: 0.25,
    wider: 0.5,
    widest: 1,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xl2: 24,
  xl3: 32,
  xl4: 40,
  containerPadding: 16,
  sectionGap: 24,
  elementGap: 12,
};

export const BORDER_RADIUS = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const SHADOWS = {
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
};

export const RESPONSIVE = {
  breakpoints: {
    xs: 0,
    sm: 375,
    md: 414,
    lg: 512,
    xl: 768,
  },
  getSizes: (deviceWidth: number) => ({
    isSmallPhone: deviceWidth < 375,
    isMediumPhone: deviceWidth >= 375 && deviceWidth < 414,
    isLargePhone: deviceWidth >= 414 && deviceWidth < 512,
    isTablet: deviceWidth >= 512,
  }),
};

export const ANIMATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
  verySlow: 800,
};

const theme = {
  COLORS,
  FONTS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  RESPONSIVE,
  ANIMATIONS,
};

export default theme;
