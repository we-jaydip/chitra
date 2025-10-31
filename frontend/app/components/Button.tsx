// ============================================================================
// FILE 3: app/components/Button.tsx
// ============================================================================
// COPY ENTIRE CONTENT BELOW AND PASTE INTO: app/components/Button.tsx

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outlined' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  children: string;
  onPress?: () => void;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  onPress,
  fullWidth = false,
}) => {
  const { COLORS, FONTS, SPACING, BORDER_RADIUS } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: disabled ? COLORS.gray300 : COLORS.primary,
          borderColor: 'transparent',
          borderWidth: 0,
        };
      case 'secondary':
        return {
          backgroundColor: COLORS.gray100,
          borderColor: 'transparent',
          borderWidth: 0,
        };
      case 'outlined':
        return {
          backgroundColor: COLORS.white,
          borderColor: COLORS.primary,
          borderWidth: 2,
        };
      case 'success':
        return {
          backgroundColor: COLORS.success,
          borderColor: 'transparent',
          borderWidth: 0,
        };
      case 'danger':
        return {
          backgroundColor: COLORS.error,
          borderColor: 'transparent',
          borderWidth: 0,
        };
      default:
        return {
          backgroundColor: COLORS.primary,
          borderColor: 'transparent',
          borderWidth: 0,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: SPACING.md,
          paddingHorizontal: SPACING.lg,
          fontSize: FONTS.size.sm,
        };
      case 'lg':
        return {
          paddingVertical: SPACING.xl,
          paddingHorizontal: SPACING.xl2,
          fontSize: FONTS.size.lg,
        };
      case 'md':
      default:
        return {
          paddingVertical: SPACING.lg,
          paddingHorizontal: SPACING.xl2,
          fontSize: FONTS.size.base,
        };
    }
  };

  const getTextColor = () => {
    if (disabled) return COLORS.gray400;
    if (variant === 'secondary' || variant === 'outlined') return COLORS.textPrimary;
    return COLORS.white;
  };

  const styles = StyleSheet.create({
    button: {
      ...getVariantStyles(),
      ...getSizeStyles(),
      borderRadius: BORDER_RADIUS.md,
      alignItems: 'center',
      justifyContent: 'center',
      width: fullWidth ? '100%' : 'auto',
      flexDirection: 'row',
    },
    text: {
      color: getTextColor(),
      fontWeight: FONTS.weight.semibold as any,
      marginLeft: loading ? SPACING.sm : 0,
    },
  });

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading && <ActivityIndicator color={getTextColor()} size="small" />}
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  );
};

export default Button;
