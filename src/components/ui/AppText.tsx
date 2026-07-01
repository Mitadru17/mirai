/**
 * AppText — Theme-aware typography component.
 * All text in Mirai passes through this component.
 * Never use raw <Text> anywhere else.
 */

import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { typography, TypographyVariant } from '../../theme/typography';
import { useColors } from '../../theme/ThemeContext';

interface AppTextProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  align?: TextStyle['textAlign'];
  children: React.ReactNode;
}

export function AppText({
  variant = 'body',
  color,
  align,
  style,
  children,
  ...rest
}: AppTextProps) {
  const colors = useColors();
  const resolvedColor = color ?? colors.primary;
  const variantStyle = typography[variant] ?? typography.body;

  return (
    <Text
      style={[
        variantStyle,
        { color: resolvedColor },
        align != null ? { textAlign: align } : undefined,
        style,
      ]}
      allowFontScaling
      maxFontSizeMultiplier={1.3}
      {...rest}
    >
      {children}
    </Text>
  );
}
