import { View, Text, StyleSheet } from "react-native";
import { theme } from "@/constants/theme";

type StatRowProps = {
  label: string;
  bigValue: string;
  bigValueColor: string;
  description: string;
};

export default function StatRow({ label, bigValue, bigValueColor, description }: StatRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.bigValue, { color: bigValueColor }]}>{bigValue}</Text>
      </View>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface.high,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: theme.spacing.md,
  },
  label: {
    fontFamily: theme.fonts.labelBold,
    fontSize: 10,
    color: theme.colors.text.secondary,
    letterSpacing: 1.5,
    paddingTop: 6,
  },
  bigValue: {
    fontFamily: theme.fonts.heading,
    fontSize: 30,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  description: {
    fontFamily: theme.fonts.body,
    fontSize: 13,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
});
