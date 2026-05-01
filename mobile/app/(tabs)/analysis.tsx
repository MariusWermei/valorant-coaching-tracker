import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { theme } from "@/constants/theme";
import { usePlayer } from "@/contexts/PlayerContext";
import { usePlayerAnalysis } from "@/hooks/usePlayerAnalysis";
import SignalRow from "@/components/SignalRow";
import StatRow from "@/components/StatRow";
import SnapshotCard from "@/components/SnapshotCard";
import {
  computeSignalScores,
  buildSignalDescriptions,
  buildStatRows,
} from "@/utils/signalHelpers";

export default function AnalysisTab() {
  const router = useRouter();
  const { playerId } = usePlayer();
  const { data, loading, error } = usePlayerAnalysis(playerId);

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.centerWrapper}>
          <ActivityIndicator size="large" color={theme.colors.accent.green} />
          <Text style={styles.loadingText}>
            Generating coaching insights...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
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

  const {
    consistencyColor,
    tiltResilience,
    tiltColor,
    sessionDriftScore,
    sessionDriftColor,
  } = computeSignalScores(stats);
  const { consistencyDesc, tiltDesc, driftDesc } =
    buildSignalDescriptions(stats);
  const {
    mapAgentBigValue,
    mapAgentDesc,
    scoreShapeValue,
    scoreShapeDesc,
    dmCompValue,
    dmCompColor,
    dmCompDesc,
  } = buildStatRows(stats);

  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - 6);
  const fmt = (d: Date) =>
    d
      .toLocaleDateString("en-US", { month: "short", day: "numeric" })
      .toUpperCase();
  const weekLabel = `WEEKLY DIAGNOSIS · ${fmt(weekStart)} – ${fmt(today)}`;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* ── Diagnosis hero ──────────────────────────────────────────────── */}
        <View style={styles.diagnosisSection}>
          <Text style={styles.weekLabel}>{weekLabel}</Text>
          {isCoachingObject && (
            <>
              <Text style={styles.headline}>{coaching.headline}</Text>
              <Text style={styles.diagnosisText}>{coaching.diagnosis}</Text>
            </>
          )}
        </View>

        {/* ── Hidden pattern ──────────────────────────────────────────────── */}
        {isCoachingObject && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>DID YOU NOTICE?</Text>
            <View style={styles.quoteBlock}>
              <View style={styles.quoteBar} />
              <View style={styles.quoteContent}>
                <Text style={styles.quoteText}>{coaching.hiddenPattern}</Text>
              </View>
            </View>
          </View>
        )}

        {/* ── Root cause ──────────────────────────────────────────────────── */}
        {isCoachingObject && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>ROOT CAUSE</Text>
            <Text style={styles.rootCauseText}>{coaching.rootCause}</Text>
          </View>
        )}

        {/* ── Counter-intuitive ───────────────────────────────────────────── */}
        {isCoachingObject && (
          <View style={styles.counterBlock}>
            <Text style={styles.counterLabel}>COUNTER-INTUITIVE</Text>
            <Text style={styles.counterText}>{coaching.counterIntuitive}</Text>
          </View>
        )}

        {/* ── Deep signals ────────────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DEEP SIGNALS</Text>
          <SignalRow
            label="Consistency gauge"
            score={stats.consistencyScore}
            color={consistencyColor}
            description={consistencyDesc}
          />
          <SignalRow
            label="Tilt resilience"
            score={tiltResilience}
            color={tiltColor}
            description={tiltDesc}
          />
          <SignalRow
            label="Session drift"
            score={sessionDriftScore}
            color={sessionDriftColor}
            description={driftDesc}
          />
        </View>

        {/* ── Stat rows ───────────────────────────────────────────────────── */}
        <View style={styles.statRowsContainer}>
          <StatRow
            label="MAP × AGENT FIT"
            bigValue={mapAgentBigValue}
            bigValueColor={theme.colors.positive}
            description={mapAgentDesc}
          />
          <StatRow
            label="SCORE SHAPE"
            bigValue={scoreShapeValue}
            bigValueColor={theme.colors.text.primary}
            description={scoreShapeDesc}
          />
          <StatRow
            label="DM TRAINING"
            bigValue={dmCompValue}
            bigValueColor={dmCompColor}
            description={dmCompDesc}
          />
        </View>

        {/* ── Performance snapshot ────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PERFORMANCE SNAPSHOT</Text>
          <View style={styles.snapshotGrid}>
            <View style={styles.snapshotRow}>
              <SnapshotCard
                label="BEST MAP"
                labelColor={theme.colors.positive}
                name={stats.coachingSignals.bestMap.name}
                winrate={stats.coachingSignals.bestMap.winrate}
                kdRatio={stats.coachingSignals.bestMap.kdRatio}
              />
              <SnapshotCard
                label="WORST MAP"
                labelColor={theme.colors.negative}
                name={stats.coachingSignals.worstMap.name}
                winrate={stats.coachingSignals.worstMap.winrate}
                kdRatio={stats.coachingSignals.worstMap.kdRatio}
              />
            </View>
            <View style={styles.snapshotRow}>
              <SnapshotCard
                label="BEST AGENT"
                labelColor={theme.colors.positive}
                name={stats.coachingSignals.bestAgent.name}
                winrate={stats.coachingSignals.bestAgent.winrate}
                kdRatio={stats.coachingSignals.bestAgent.kdRatio}
              />
              <SnapshotCard
                label="AVOID AGENT"
                labelColor={theme.colors.negative}
                name={stats.coachingSignals.worstAgent.name}
                winrate={stats.coachingSignals.worstAgent.winrate}
                kdRatio={stats.coachingSignals.worstAgent.kdRatio}
              />
            </View>
          </View>
        </View>

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        <Pressable
          style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
          onPress={() => router.push("/(tabs)/actionplan")}
        >
          <View>
            <Text style={styles.ctaLabel}>NEXT STEP</Text>
            <Text style={styles.ctaTitle}>See your action plan →</Text>
          </View>
          <Text style={styles.ctaArrow}>→</Text>
        </Pressable>

        {/* ── Fallback ────────────────────────────────────────────────────── */}
        {!isCoachingObject && typeof coaching === "string" && (
          <View style={styles.section}>
            <Text style={styles.diagnosisText}>{coaching}</Text>
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
    paddingBottom: 20,
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
  diagnosisSection: {
    padding: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface.high,
  },
  weekLabel: {
    fontFamily: theme.fonts.labelBold,
    fontSize: 10,
    color: theme.colors.positive,
    letterSpacing: 2,
    marginBottom: theme.spacing.md,
  },
  headline: {
    fontFamily: theme.fonts.heading,
    fontSize: 36,
    color: theme.colors.text.primary,
    letterSpacing: -0.8,
    lineHeight: 44,
    marginBottom: theme.spacing.lg,
  },
  diagnosisText: {
    fontFamily: theme.fonts.body,
    fontSize: 15,
    color: theme.colors.text.secondary,
    lineHeight: 24,
  },
  section: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface.high,
    gap: theme.spacing.md,
  },
  sectionLabel: {
    fontFamily: theme.fonts.labelBold,
    fontSize: 10,
    color: theme.colors.text.secondary,
    letterSpacing: 2,
  },
  quoteBlock: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.radius.md,
    overflow: "hidden",
  },
  quoteBar: {
    width: 3,
    backgroundColor: theme.colors.positive,
  },
  quoteContent: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  quoteText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 15,
    color: theme.colors.text.primary,
    lineHeight: 23,
  },
  rootCauseText: {
    fontFamily: theme.fonts.heading,
    fontSize: 22,
    color: theme.colors.text.primary,
    letterSpacing: -0.3,
    lineHeight: 30,
  },
  counterBlock: {
    marginHorizontal: theme.spacing.xl,
    marginVertical: theme.spacing.sm,
    backgroundColor: theme.colors.accent.greenDim,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: "rgba(79,255,176,0.15)",
  },
  counterLabel: {
    fontFamily: theme.fonts.labelBold,
    fontSize: 10,
    color: theme.colors.positive,
    letterSpacing: 2,
  },
  counterText: {
    fontFamily: theme.fonts.body,
    fontSize: 14,
    color: theme.colors.text.primary,
    lineHeight: 22,
  },
  statRowsContainer: {
    paddingHorizontal: theme.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface.high,
  },
  snapshotGrid: {
    gap: theme.spacing.sm,
  },
  snapshotRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  cta: {
    margin: theme.spacing.xl,
    backgroundColor: theme.colors.accent.green,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ctaPressed: {
    opacity: 0.85,
  },
  ctaLabel: {
    fontFamily: theme.fonts.labelBold,
    fontSize: 9,
    color: theme.colors.surface.low,
    letterSpacing: 2,
    marginBottom: 4,
  },
  ctaTitle: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 16,
    color: theme.colors.surface.base,
  },
  ctaArrow: {
    fontFamily: theme.fonts.heading,
    fontSize: 20,
    color: theme.colors.surface.base,
  },
});
