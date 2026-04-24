import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/constants/theme";
import { usePlayer } from "@/contexts/PlayerContext";
import { usePlayerAnalysis } from "@/hooks/usePlayerAnalysis";
import TrendBadge from "@/components/TrendBadge";
import SectionLabel from "@/components/SectionLabel";
import PrimaryInsightCard from "@/components/PrimaryInsightCard";
import PerformanceDuel from "@/components/PerformanceDuel";
import InsightList from "@/components/InsightList";

export default function AnalysisTab() {
  const { playerId } = usePlayer();
  const { data, loading, error } = usePlayerAnalysis(playerId);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerWrapper}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>
            Generating coaching insights...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerWrapper}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMessage}>{error.message}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!data) return null;

  const { stats, coaching } = data;
  const isCoachingObject = typeof coaching === "object" && coaching !== null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>PERFORMANCE</Text>
            <Text style={styles.title}>Analysis</Text>
          </View>
          <TrendBadge trend={stats.trend} />
        </View>

        {/* Primary Insight — above the fold */}
        {isCoachingObject && (
          <PrimaryInsightCard summary={coaching.summary} />
        )}

        {/* Map Performance */}
        <View style={styles.section}>
          <SectionLabel>MAP PERFORMANCE</SectionLabel>
          <PerformanceDuel
            best={stats.coachingSignals.bestMap}
            worst={stats.coachingSignals.worstMap}
          />
        </View>

        {/* Agent Performance */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <SectionLabel>AGENT PERFORMANCE</SectionLabel>
            <Text style={styles.pool}>
              {stats.coachingSignals.numberOfAgentPlayed} in pool
            </Text>
          </View>
          <PerformanceDuel
            best={stats.coachingSignals.bestAgent}
            worst={stats.coachingSignals.worstAgent}
          />
        </View>

        {/* Strengths */}
        {isCoachingObject && coaching.strengths?.length > 0 && (
          <View style={styles.section}>
            <SectionLabel color={theme.colors.success}>STRENGTHS</SectionLabel>
            <InsightList
              items={coaching.strengths}
              accentColor={theme.colors.success}
            />
          </View>
        )}

        {/* Weaknesses */}
        {isCoachingObject && coaching.weaknesses?.length > 0 && (
          <View style={styles.section}>
            <SectionLabel color={theme.colors.primary}>WEAKNESSES</SectionLabel>
            <InsightList
              items={coaching.weaknesses}
              accentColor={theme.colors.primary}
            />
          </View>
        )}

        {/* Focus Areas — numbered, priority highlighted */}
        {isCoachingObject && coaching.focusAreas?.length > 0 && (
          <View style={styles.section}>
            <SectionLabel>COACHING RECOMMENDATIONS</SectionLabel>
            <InsightList
              items={coaching.focusAreas}
              accentColor={theme.colors.primary}
              variant="numbered"
            />
          </View>
        )}

        {/* Fallback if LLM returned a raw string */}
        {!isCoachingObject && typeof coaching === "string" && (
          <View style={styles.section}>
            <SectionLabel>COACHING OUTPUT</SectionLabel>
            <View style={styles.rawFallback}>
              <Text style={styles.rawText}>{coaching}</Text>
            </View>
          </View>
        )}
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
    paddingBottom: 80,
    gap: theme.spacing.xl,
  },
  centerWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.xl,
  },
  loadingText: {
    fontFamily: theme.fonts.body,
    fontSize: 13,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
  },
  errorTitle: {
    fontFamily: theme.fonts.heading,
    fontSize: 20,
    color: theme.colors.text.primary,
    letterSpacing: -0.3,
  },
  errorMessage: {
    fontFamily: theme.fonts.body,
    fontSize: 13,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.sm,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eyebrow: {
    fontFamily: theme.fonts.labelBold,
    fontSize: 10,
    color: theme.colors.text.secondary,
    letterSpacing: 2.5,
    marginBottom: 4,
  },
  title: {
    fontFamily: theme.fonts.heading,
    fontSize: 36,
    color: theme.colors.text.primary,
    letterSpacing: -0.5,
  },
  section: {
    gap: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pool: {
    fontFamily: theme.fonts.label,
    fontSize: 10,
    color: theme.colors.text.secondary,
    letterSpacing: 1.5,
  },
  rawFallback: {
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
  },
  rawText: {
    fontFamily: theme.fonts.body,
    fontSize: 13,
    color: theme.colors.text.primary,
    lineHeight: 20,
  },
});
