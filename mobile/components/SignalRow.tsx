import { View, Text, StyleSheet } from "react-native";
import { theme } from "@/constants/theme";

type SignalRowProps = {
  label: string;
  score: number;
  color: string;
  description: string;
};

export default function SignalRow({ label, score, color, description }: SignalRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.score, { color }]}>{score}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${score}%`, backgroundColor: color }]} />
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
    alignItems: "center",
  },
  label: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 15,
    color: theme.colors.text.primary,
  },
  score: {
    fontFamily: theme.fonts.heading,
    fontSize: 15,
    letterSpacing: -0.3,
  },
  track: {
    height: 3,
    backgroundColor: theme.colors.surface.overlay,
    borderRadius: 2,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 2,
  },
  description: {
    fontFamily: theme.fonts.body,
    fontSize: 13,
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },
});
