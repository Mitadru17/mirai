/**
 * CodeText — Monospaced, horizontally-scrollable code panel.
 * Used by `code` and `walkthrough` lesson blocks. Dark inset surface with a
 * subtle border, tuned for readability on the jet-black theme.
 */

import React from 'react';
import { View, ScrollView, StyleSheet, Platform } from 'react-native';
import { AppText } from '../ui/AppText';
import { useColors } from '../../theme/ThemeContext';
import { spacing, radius } from '../../theme/spacing';

const MONO = Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' });

interface CodeTextProps {
  code: string;
  /** Optional caption shown below the panel. */
  caption?: string;
  /** Dim the panel slightly (used inside walkthrough steps). */
  inset?: boolean;
}

export function CodeText({ code, caption, inset = false }: CodeTextProps) {
  const colors = useColors();

  return (
    <View>
      <View
        style={[
          styles.panel,
          {
            backgroundColor: inset ? colors.background : colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <AppText
            variant="footnote"
            color={colors.primary}
            style={[styles.code, { fontFamily: MONO }]}
          >
            {code}
          </AppText>
        </ScrollView>
      </View>
      {caption ? (
        <AppText variant="caption" color={colors.tertiary} style={styles.caption}>
          {caption}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderRadius: radius.md,
    borderWidth: 1,
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.base,
  },
  scrollContent: {
    paddingRight: spacing.base,
  },
  code: {
    lineHeight: 20,
  },
  caption: {
    marginTop: spacing.sm,
    marginLeft: spacing.xs,
  },
});
