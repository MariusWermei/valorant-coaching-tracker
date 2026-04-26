import { View, Text, StyleSheet } from "react-native";
import { theme } from "@/constants/theme";

type Trend = "improving" | "stable" | "declining";

type TrendBadgeProps = {
  trend: Trend;
};

const CONFIG: Record<Trend, { label: string; color: string; prefix: string }> = {
  improving: { label: "IMPROVING", color: theme.colors.positive, prefix: "↑" },
  stable: { label: "STABLE", color: theme.colors.warning, prefix: "—" },
  declining: { label: "DECLINING", color: theme.colors.negative, prefix: "↓" },
};

export default function TrendBadge({ trend }: TrendBadgeProps) {
  const { label, color, prefix } = CONFIG[trend];

  return (
    <View style={[styles.badge, { backgroundColor: `${color}18` }]}>
      <Text style={[styles.prefix, { color }]}>{prefix}</Text>
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 5,
    borderRadius: theme.radius.pill,
  },
  prefix: {
    fontFamily: theme.fonts.labelBold,
    fontSize: 10,
  },
  label: {
    fontFamily: theme.fonts.labelBold,
    fontSize: 10,
    letterSpacing: 1.5,
  },
});
