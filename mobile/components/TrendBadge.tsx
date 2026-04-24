import { View, Text, StyleSheet } from "react-native";
import { theme } from "@/constants/theme";

type Trend = "improving" | "stable" | "declining";

type TrendBadgeProps = {
  trend: Trend;
};

const CONFIG: Record<Trend, { label: string; color: string; glyph: string }> = {
  improving: { label: "IMPROVING", color: theme.colors.success, glyph: "▲" },
  stable: { label: "STABLE", color: theme.colors.warning, glyph: "—" },
  declining: { label: "DECLINING", color: theme.colors.primary, glyph: "▼" },
};

export default function TrendBadge({ trend }: TrendBadgeProps) {
  const { label, color, glyph } = CONFIG[trend];

  return (
    <View style={styles.badge}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.glyph, { color }]}>{glyph}</Text>
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: theme.colors.surface.high,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  glyph: {
    fontFamily: theme.fonts.labelBold,
    fontSize: 10,
  },
  label: {
    fontFamily: theme.fonts.labelBold,
    fontSize: 10,
    letterSpacing: 1.5,
  },
});
