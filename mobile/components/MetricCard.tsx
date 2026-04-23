import { View, Text, StyleSheet } from "react-native";
import { theme } from "@/constants/theme";

type MetricCardProps = {
  label: string;
  value: string | number;
};

export default function MetricCard({ label, value }: MetricCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
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
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontFamily: theme.fonts.labelBold,
    fontSize: 10,
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
});
