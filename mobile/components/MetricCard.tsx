import { View, Text, StyleSheet } from "react-native";
import { theme } from "@/constants/theme";

type MetricCardProps = {
  label: string;
  value: string | number;
  delta?: string;
  deltaPositive?: boolean;
};

export default function MetricCard({
  label,
  value,
  delta,
  deltaPositive,
}: MetricCardProps) {
  const deltaColor =
    deltaPositive === undefined
      ? theme.colors.text.secondary
      : deltaPositive
        ? theme.colors.positive
        : theme.colors.negative;

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {delta && <Text style={[styles.delta, { color: deltaColor }]}>{delta}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
  },
  label: {
    fontFamily: theme.fonts.labelBold,
    fontSize: 9,
    color: theme.colors.text.secondary,
    letterSpacing: 1.5,
    marginBottom: theme.spacing.sm,
  },
  value: {
    fontFamily: theme.fonts.heading,
    fontSize: 28,
    color: theme.colors.text.primary,
    letterSpacing: -0.5,
  },
  delta: {
    fontFamily: theme.fonts.label,
    fontSize: 11,
    marginTop: 4,
    letterSpacing: 0.5,
  },
});
