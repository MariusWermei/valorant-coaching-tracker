import { View, Text, StyleSheet } from "react-native";
import { theme } from "@/constants/theme";

type SnapshotCardProps = {
  label: string;
  labelColor: string;
  name: string;
  winrate: number;
  kdRatio: number;
};

export default function SnapshotCard({ label, labelColor, name, winrate, kdRatio }: SnapshotCardProps) {
  return (
    <View style={styles.card}>
      <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.stats}>
        {Math.round(winrate)}% WR · {kdRatio.toFixed(2)} K/D
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: theme.colors.surface.high,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    gap: 4,
  },
  label: {
    fontFamily: theme.fonts.labelBold,
    fontSize: 9,
    letterSpacing: 1.5,
  },
  name: {
    fontFamily: theme.fonts.heading,
    fontSize: 24,
    color: theme.colors.text.primary,
    letterSpacing: -0.5,
  },
  stats: {
    fontFamily: theme.fonts.label,
    fontSize: 11,
    color: theme.colors.text.secondary,
    letterSpacing: 0.3,
  },
});
