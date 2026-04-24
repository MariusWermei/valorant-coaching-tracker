import { View, Text, StyleSheet } from "react-native";
import { theme } from "@/constants/theme";
import SectionLabel from "./SectionLabel";

type PrimaryInsightCardProps = {
  summary: string;
};

export default function PrimaryInsightCard({
  summary,
}: PrimaryInsightCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.accent} />
      <View style={styles.content}>
        <SectionLabel color={theme.colors.primary}>
          TACTICAL BRIEFING
        </SectionLabel>
        <Text style={styles.summary}>{summary}</Text>
      </View>
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
    backgroundColor: theme.colors.primary,
  },
  content: {
    flex: 1,
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  summary: {
    fontFamily: theme.fonts.body,
    fontSize: 15,
    color: theme.colors.text.primary,
    lineHeight: 22,
  },
});
