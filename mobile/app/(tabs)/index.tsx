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
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
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
          <Text style={styles.displayName}>{stats.player.displayName}</Text>
          <Text style={styles.riotTag}>{stats.player.riotTag}</Text>
        </View>

        {/* Metrics */}
        <View style={styles.metricsRow}>
          <MetricCard
            label="WIN RATE"
            value={`${stats.stats.winrate.toFixed(0)}%`}
          />
          <MetricCard label="K/D" value={stats.stats.kdRatio.toFixed(2)} />
          <MetricCard
            label="AVG SCORE"
            value={Math.round(stats.stats.averageScore)}
          />
        </View>

        {/* CTA */}
        <View style={styles.ctaWrapper}>
          <Button
            label="VIEW PERFORMANCE ANALYSIS →"
            onPress={() => router.push("/(tabs)/analysis")}
          />
        </View>

        {/* Recent sessions */}
        <Text style={styles.sectionLabel}>RECENT SESSIONS</Text>
        {/* On affichera les matchs juste après */}
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
  },
  loadingWrapper: {
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
    marginBottom: theme.spacing.xl,
  },
  displayName: {
    fontFamily: theme.fonts.heading,
    fontSize: 36,
    color: theme.colors.text.primary,
    letterSpacing: -0.5,
  },
  riotTag: {
    fontFamily: theme.fonts.label,
    fontSize: 12,
    color: theme.colors.text.secondary,
    letterSpacing: 1.5,
    marginTop: 4,
  },
  metricsRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  ctaWrapper: {
    marginBottom: theme.spacing.xl,
  },
  sectionLabel: {
    fontFamily: theme.fonts.labelBold,
    fontSize: 11,
    color: theme.colors.text.secondary,
    letterSpacing: 2,
    marginBottom: theme.spacing.md,
  },
});
