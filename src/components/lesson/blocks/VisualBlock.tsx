/**
 * VisualBlock — Renders a lesson's interactive/illustrative visualization.
 *
 * Switches on `visual.kind`. Data is intentionally loose (Record<string,unknown>)
 * so content can describe a diagram without importing UI types; each renderer
 * defensively coerces what it needs. Unknown kinds degrade to a captioned
 * placeholder so new content can ship before its renderer does.
 */

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Svg, { Path, Line, Text as SvgText } from 'react-native-svg';
import { AppText } from '../../ui/AppText';
import { useColors } from '../../../theme/ThemeContext';
import { spacing, radius } from '../../../theme/spacing';
import type { VisualSpec } from '../../../curriculum/types';

interface VisualBlockProps {
  visual: VisualSpec;
}

// ─── Coercion helpers ───────────────────────────────────────────────────────

function asStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.map((x) => String(x)) : [];
}
function asNumber(v: unknown): number | undefined {
  return typeof v === 'number' ? v : undefined;
}

// ─── Shared cell ────────────────────────────────────────────────────────────

function Cell({
  value,
  index,
  highlighted,
}: {
  value: string;
  index?: number;
  highlighted?: boolean;
}) {
  const colors = useColors();
  return (
    <View style={styles.cellCol}>
      <View
        style={[
          styles.cell,
          {
            backgroundColor: highlighted ? colors.accent.limeMuted : colors.cardElevated,
            borderColor: highlighted ? colors.accent.lime : colors.border,
          },
        ]}
      >
        <AppText
          variant="subheadlineMedium"
          color={highlighted ? colors.accent.lime : colors.primary}
        >
          {value}
        </AppText>
      </View>
      {index != null ? (
        <AppText variant="caption2" color={colors.tertiary} style={styles.cellIndex}>
          {index}
        </AppText>
      ) : null}
    </View>
  );
}

// ─── Kind renderers ─────────────────────────────────────────────────────────

function ArrayVisual({ data }: { data?: Record<string, unknown> }) {
  const cells = asStringArray(data?.cells);
  const labels = asStringArray(data?.labels);
  const highlight = asNumber(data?.highlight);
  const colors = useColors();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.row}>
        {cells.map((value, i) => (
          <View key={i} style={styles.labelledCol}>
            <Cell value={value} index={i} highlighted={i === highlight} />
            {labels[i] ? (
              <AppText variant="caption2" color={colors.secondary} style={styles.varLabel}>
                {labels[i]}
              </AppText>
            ) : null}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function StringVisual({ data }: { data?: Record<string, unknown> }) {
  const text = typeof data?.text === 'string' ? data.text : '';
  const highlight = asNumber(data?.highlight);
  const chars = text.split('');

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.row}>
        {chars.map((ch, i) => (
          <Cell key={i} value={ch === ' ' ? '␣' : ch} index={i} highlighted={i === highlight} />
        ))}
      </View>
    </ScrollView>
  );
}

function StackVisual({ data }: { data?: Record<string, unknown> }) {
  const items = asStringArray(data?.items);
  const colors = useColors();
  // Top of stack = last item. Render top-most first (visually on top).
  const ordered = [...items].reverse();

  return (
    <View style={styles.stackWrap}>
      {ordered.map((value, i) => {
        const isTop = i === 0;
        return (
          <View key={i} style={styles.stackRow}>
            <View
              style={[
                styles.stackCell,
                {
                  backgroundColor: isTop ? colors.accent.limeMuted : colors.cardElevated,
                  borderColor: isTop ? colors.accent.lime : colors.border,
                },
              ]}
            >
              <AppText variant="subheadlineMedium" color={isTop ? colors.accent.lime : colors.primary}>
                {value}
              </AppText>
            </View>
            {isTop ? (
              <AppText variant="caption" color={colors.accent.lime} style={styles.stackTag}>
                ← top
              </AppText>
            ) : null}
          </View>
        );
      })}
      <View style={[styles.stackBase, { backgroundColor: colors.border }]} />
    </View>
  );
}

function LinkedListVisual({ data }: { data?: Record<string, unknown> }) {
  const nodes = asStringArray(data?.nodes);
  const colors = useColors();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.row}>
        {nodes.map((value, i) => (
          <View key={i} style={styles.llGroup}>
            <View style={[styles.llNode, { borderColor: colors.border, backgroundColor: colors.cardElevated }]}>
              <AppText variant="subheadlineMedium" color={colors.primary}>
                {value}
              </AppText>
            </View>
            <AppText variant="body" color={colors.tertiary} style={styles.llArrow}>
              →
            </AppText>
          </View>
        ))}
        <View style={[styles.llNull, { borderColor: colors.borderSubtle }]}>
          <AppText variant="caption" color={colors.tertiary}>
            null
          </AppText>
        </View>
      </View>
    </ScrollView>
  );
}

const BIGO_CURVES: { label: string; fn: (t: number) => number; key: string }[] = [
  { key: 'const', label: 'O(1)', fn: () => 0.04 },
  { key: 'log', label: 'O(log n)', fn: (t) => Math.log2(1 + t * 31) / 5 },
  { key: 'lin', label: 'O(n)', fn: (t) => t },
  { key: 'nlogn', label: 'O(n log n)', fn: (t) => (t * Math.log2(2 + t * 30)) / 5 },
  { key: 'quad', label: 'O(n²)', fn: (t) => t * t },
];

function BigOVisual() {
  const colors = useColors();
  const W = 300;
  const H = 170;
  const pad = 24;
  const innerW = W - pad * 2;
  const innerH = H - pad * 2;

  const palette = ['#636366', '#5AC8FA', colors.accent.lime, '#FFD60A', '#FF453A'];

  function pathFor(fn: (t: number) => number): string {
    const pts: string[] = [];
    const steps = 40;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const y = Math.min(1, fn(t));
      const x = pad + t * innerW;
      const py = pad + innerH - y * innerH;
      pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${py.toFixed(1)}`);
    }
    return pts.join(' ');
  }

  return (
    <View>
      <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
        {/* axes */}
        <Line x1={pad} y1={pad} x2={pad} y2={H - pad} stroke={colors.border} strokeWidth={1} />
        <Line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke={colors.border} strokeWidth={1} />
        {BIGO_CURVES.map((c, i) => (
          <Path key={c.key} d={pathFor(c.fn)} stroke={palette[i]} strokeWidth={2} fill="none" strokeLinecap="round" />
        ))}
        <SvgText x={W - pad} y={H - pad + 14} fill={colors.tertiary} fontSize={9} textAnchor="end">
          input size n →
        </SvgText>
      </Svg>
      <View style={styles.legend}>
        {BIGO_CURVES.map((c, i) => (
          <View key={c.key} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: palette[i] }]} />
            <AppText variant="caption2" color={colors.secondary}>
              {c.label}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Entry ──────────────────────────────────────────────────────────────────

export function VisualBlock({ visual }: VisualBlockProps) {
  const colors = useColors();

  let body: React.ReactNode;
  switch (visual.kind) {
    case 'array':       body = <ArrayVisual data={visual.data} />; break;
    case 'string':      body = <StringVisual data={visual.data} />; break;
    case 'stack':       body = <StackVisual data={visual.data} />; break;
    case 'linked-list': body = <LinkedListVisual data={visual.data} />; break;
    case 'bigo':        body = <BigOVisual />; break;
    default:            body = (
      <AppText variant="caption" color={colors.tertiary}>
        Visualization
      </AppText>
    );
  }

  return (
    <View style={[styles.container, { borderColor: colors.border, backgroundColor: colors.surface }]}>
      {body}
      {visual.caption ? (
        <AppText variant="caption" color={colors.tertiary} style={styles.caption}>
          {visual.caption}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  labelledCol: {
    alignItems: 'center',
  },
  cellCol: {
    alignItems: 'center',
  },
  cell: {
    minWidth: 44,
    height: 44,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellIndex: {
    marginTop: spacing.xs,
  },
  varLabel: {
    marginTop: 2,
  },
  // Stack
  stackWrap: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  stackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  stackCell: {
    minWidth: 96,
    height: 40,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stackTag: {
    position: 'absolute',
    left: 108,
    width: 60,
  },
  stackBase: {
    width: 128,
    height: 3,
    borderRadius: 2,
    marginTop: spacing.xs,
  },
  // Linked list
  llGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  llNode: {
    minWidth: 44,
    height: 44,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  llArrow: {
    marginHorizontal: spacing.sm,
  },
  llNull: {
    height: 44,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Big-O
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.sm,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  caption: {
    marginTop: spacing.md,
    textAlign: 'center',
  },
});
