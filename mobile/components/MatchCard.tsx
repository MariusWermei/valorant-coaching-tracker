import { View, Text, StyleSheet, Image } from "react-native";
import { theme } from "@/constants/theme";
import { Match } from "@/types/match";
import { mapImages } from "@/constants/mapImages";

type MatchCardProps = {
  match: Match;
};

export default function MatchCard({ match }: MatchCardProps) {
  const isWin = match.result === "win";

  return (
    <View style={styles.card}>
      {/* Left: map thumbnail + map name + agent/KDA */}
      <View style={styles.left}>
        <Image source={mapImages[match.map]} style={styles.thumbnail} />
        <View>
          <Text style={styles.map}>{match.map}</Text>
          <Text style={styles.details}>
            {match.agent} · {match.kills}/{match.deaths}/{match.assists}
          </Text>
        </View>
      </View>

      {/* Right: WIN badge + score */}
      <View style={styles.right}>
        <View
          style={[styles.badge, isWin ? styles.winBadge : styles.lossBadge]}
        >
          <Text
            style={[styles.badgeText, isWin ? styles.winText : styles.lossText]}
          >
            {isWin ? "WIN" : "LOSS"}
          </Text>
        </View>
        <View style={{ gap: 8 }}>
          <Text style={styles.score}>{match.score}</Text>
          <Text style={styles.scoreLabel}>SCORE</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    flex: 1,
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.default,
  },
  map: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 15,
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  details: {
    fontFamily: theme.fonts.label,
    fontSize: 11,
    color: theme.colors.text.secondary,
    letterSpacing: 0.5,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  winBadge: {
    backgroundColor: "rgba(96, 220, 176, 0.15)",
  },
  lossBadge: {
    backgroundColor: "rgba(255, 82, 93, 0.15)",
  },
  badgeText: {
    fontFamily: theme.fonts.labelBold,
    fontSize: 10,
    letterSpacing: 1.5,
  },
  winText: {
    color: theme.colors.success,
  },
  lossText: {
    color: theme.colors.primary,
  },
  score: {
    fontFamily: theme.fonts.heading,
    fontSize: 18,
    color: theme.colors.text.primary,
    textAlign: "center",
  },
  scoreLabel: {
    fontFamily: theme.fonts.label,
    fontSize: 9,
    color: theme.colors.text.secondary,
    letterSpacing: 1,
    marginTop: -4,
  },
});
