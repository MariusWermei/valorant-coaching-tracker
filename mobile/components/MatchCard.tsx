import { View, Text, StyleSheet } from "react-native";
import { theme } from "@/constants/theme";
import { Match } from "@/types/match";

type MatchCardProps = {
  match: Match;
};

export default function MatchCard({ match }: MatchCardProps) {
  const isWin = match.result === "win";
  const accentColor = isWin ? theme.colors.positive : theme.colors.negative;

  const date = new Date(match.date);
  const dateLabel = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <View style={styles.card}>
      <View style={[styles.bar, { backgroundColor: accentColor }]} />
      <View style={styles.left}>
        <View style={styles.mapRow}>
          <Text style={styles.map}>{match.map}</Text>
          <Text style={styles.agent}>{match.agent}</Text>
        </View>
        <Text style={styles.meta}>
          {dateLabel} · {match.mode.charAt(0).toUpperCase() + match.mode.slice(1)}
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.kda}>
          {match.kills}/{match.deaths}/{match.assists}
        </Text>
        <Text style={styles.score}>{match.score}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  bar: {
    width: 3,
    height: 44,
    borderRadius: 2,
  },
  left: {
    flex: 1,
    gap: 4,
  },
  mapRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: theme.spacing.sm,
  },
  map: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 15,
    color: theme.colors.text.primary,
  },
  agent: {
    fontFamily: theme.fonts.label,
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  meta: {
    fontFamily: theme.fonts.label,
    fontSize: 11,
    color: theme.colors.text.secondary,
    letterSpacing: 0.3,
  },
  right: {
    alignItems: "flex-end",
    gap: 2,
  },
  kda: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 13,
    color: theme.colors.text.primary,
  },
  score: {
    fontFamily: theme.fonts.label,
    fontSize: 11,
    color: theme.colors.text.secondary,
    letterSpacing: 0.5,
  },
});
