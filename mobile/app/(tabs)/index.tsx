import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { getPlayerStats, getPlayerMatches } from "@/services/api";
import { usePlayer } from "@/contexts/PlayerContext";
import { theme } from "@/constants/theme";
import Button from "@/components/Button";
import MetricCard from "@/components/MetricCard";
import { StatsResponse } from "@/types/stats";
import { Match } from "@/types/match";
import MatchCard from "@/components/MatchCard";

export default function OverviewTab() {
  const router = useRouter();
  const { playerId } = usePlayer();

  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!playerId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsData, matchesData] = await Promise.all([
          getPlayerStats(playerId),
          getPlayerMatches(playerId),
        ]);
        setStats(statsData);
        setMatches(matchesData.matches);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [playerId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerWrapper}>
          <ActivityIndicator size="large" color={theme.colors.accent.green} />
          <Text style={styles.loadingText}>Loading performance data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!stats) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.appLabel}>FORM</Text>
            <Text style={styles.displayName}>{stats.player.displayName}</Text>
            <Text style={styles.riotTag}>{stats.player.riotTag}</Text>
          </View>
          <View style={styles.deltaColumn}>
            <View style={styles.deltaChipNegative}>
              <Text style={styles.deltaChipTextNegative}>
                ↓ −4% WR THIS WEEK
              </Text>
            </View>
            <View style={styles.deltaChipPositive}>
              <Text style={styles.deltaChipTextPositive}>
                ↑ +0.3 K/D THIS WEEK
              </Text>
            </View>
          </View>
        </View>

        {/* Metrics grid — 2x2 */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricsRow}>
            <MetricCard
              label="WIN RATE"
              value={`${stats.stats.winrate.toFixed(0)}%`}
              delta={`last ${stats.stats.totalMatches} games`}
            />
            <MetricCard
              label="K / D"
              value={stats.stats.kdRatio.toFixed(2)}
            />
          </View>
          <View style={styles.metricsRow}>
            <MetricCard
              label="AVG SCORE"
              value={Math.round(stats.stats.averageScore)}
            />
            <MetricCard
              label="MATCHES"
              value={stats.stats.totalMatches}
              delta="this week"
            />
          </View>
        </View>

        {/* CTA */}
        <View style={styles.ctaCard}>
          <View>
            <Text style={styles.ctaLabel}>WEEKLY ANALYSIS READY</Text>
            <Text style={styles.ctaTitle}>
              Read your coaching report →
            </Text>
          </View>
          <View style={styles.ctaCircle}>
            <Text style={styles.ctaArrow}>→</Text>
          </View>
        </View>

        {/* Recent matches */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>RECENT MATCHES</Text>
          <View style={styles.matchesList}>
            {matches.slice(0, 10).map((match) => (
              <MatchCard key={match.matchId} match={match} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface.base,
  },
  scroll: {
    padding: theme.spacing.xl,
    paddingBottom: 90,
    gap: theme.spacing.xl,
  },
  centerWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontFamily: theme.fonts.body,
    fontSize: 13,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  appLabel: {
    fontFamily: theme.fonts.labelBold,
    fontSize: 10,
    color: theme.colors.accent.green,
    letterSpacing: 2.5,
    marginBottom: 4,
  },
  displayName: {
    fontFamily: theme.fonts.heading,
    fontSize: 24,
    color: theme.colors.text.primary,
    letterSpacing: -0.5,
  },
  riotTag: {
    fontFamily: theme.fonts.label,
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  deltaColumn: {
    gap: theme.spacing.xs,
    alignItems: "flex-end",
  },
  deltaChipNegative: {
    backgroundColor: theme.colors.accent.redDim,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radius.sm,
  },
  deltaChipTextNegative: {
    fontFamily: theme.fonts.labelBold,
    fontSize: 9,
    color: theme.colors.negative,
    letterSpacing: 1,
  },
  deltaChipPositive: {
    backgroundColor: theme.colors.accent.greenDim,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radius.sm,
  },
  deltaChipTextPositive: {
    fontFamily: theme.fonts.labelBold,
    fontSize: 9,
    color: theme.colors.positive,
    letterSpacing: 1,
  },
  metricsGrid: {
    gap: theme.spacing.sm,
  },
  metricsRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  ctaCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
  },
  ctaLabel: {
    fontFamily: theme.fonts.labelBold,
    fontSize: 9,
    color: theme.colors.accent.green,
    letterSpacing: 2,
    marginBottom: 4,
  },
  ctaTitle: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 15,
    color: theme.colors.text.primary,
  },
  ctaCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.accent.green,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaArrow: {
    fontFamily: theme.fonts.heading,
    fontSize: 16,
    color: theme.colors.surface.base,
  },
  section: {
    gap: theme.spacing.md,
  },
  sectionLabel: {
    fontFamily: theme.fonts.labelBold,
    fontSize: 10,
    color: theme.colors.text.secondary,
    letterSpacing: 2,
  },
  matchesList: {
    gap: theme.spacing.lg,
  },
});
