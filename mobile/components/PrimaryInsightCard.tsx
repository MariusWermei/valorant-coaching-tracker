import { View, Text, StyleSheet } from "react-native";
import { theme } from "@/constants/theme";

type PrimaryInsightCardProps = {
  summary: string;
};

export default function PrimaryInsightCard({ summary }: PrimaryInsightCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.accent} />
      <Text style={styles.summary}>{summary}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.radius.md,
    overflow: "hidden",
  },
  accent: {
    width: 3,
    backgroundColor: theme.colors.accent.green,
  },
  summary: {
    flex: 1,
    fontFamily: theme.fonts.bodyBold,
    fontSize: 15,
    color: theme.colors.text.primary,
    lineHeight: 22,
    padding: theme.spacing.xl,
    fontStyle: "italic",
  },
});
