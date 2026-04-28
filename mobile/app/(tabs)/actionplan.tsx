import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/constants/theme";
import { usePlayer } from "@/contexts/PlayerContext";
import { usePlayerAnalysis } from "@/hooks/usePlayerAnalysis";
import { CoachingOutput } from "@/types/analysis";
import ProtocolItem from "@/components/ProtocolItem";
import MissionBlock from "@/components/MissionBlock";

export default function ActionPlanTab() {
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
  const mission =
    typeof coaching === "object" && coaching !== null
      ? (coaching as CoachingOutput).weeklyMission
      : null;

  const fromWr = Math.round(stats.winrate);
  const targetWr = Math.min(fromWr + 5, 70);

  const checkInDate = new Date();
  checkInDate.setDate(checkInDate.getDate() + 2);
  const checkInLabel = checkInDate
    .toLocaleDateString("en-US", { month: "short", day: "numeric" })
    .toUpperCase();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* ── Hero ──────────────────────────────────────────────── */}
        <View style={styles.hero}>
          <View style={styles.heroTopRow}>
            <Text style={styles.missionLabel}>WEEKLY MISSION</Text>
            <View style={styles.pill}>
              <Text style={styles.pillText}>7 DAYS</Text>
            </View>
          </View>

          <Text style={styles.goalText}>{mission?.goal ?? "—"}</Text>

          <View style={styles.statsStrip}>
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>TARGET WR</Text>
              <Text style={styles.statValue}>{targetWr}%</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>FROM</Text>
              <Text style={[styles.statValue, styles.statValueMuted]}>
                {fromWr}%
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>GAMES NEEDED</Text>
              <Text style={styles.statValue}>15</Text>
            </View>
          </View>
        </View>
        {/* ── Protocol Section ──────────────────────────────────────────────── */}

        {mission && (
          <View style={styles.protocolSection}>
            <Text style={styles.sectionLabel}>PROTOCOL</Text>
            {mission.protocol
              .filter((step) => step.title?.trim() || step.description?.trim())
              .map((step, index) => (
                <ProtocolItem
                  key={index}
                  index={index + 1}
                  title={step.title}
                  description={step.description}
                  showDivider={index > 0}
                />
              ))}
          </View>
        )}

        {/* ── Mission Blocks ──────────────────────────────────────── */}
        {mission && (
          <>
            <MissionBlock
              variant="success"
              label="HOW YOU'LL KNOW IT'S WORKING"
              text={mission.successMetric}
            />
            <MissionBlock
              variant="danger"
              label="STOP DOING THIS"
              text={mission.antiPattern}
            />
          </>
        )}

        {/* ── Progress Placeholder ────────────────────────────────── */}
        <View style={styles.progressBlock}>
          <Text style={styles.progressLabel}>
            PROGRESS · CHECKS IN {checkInLabel}
          </Text>
          <Text style={styles.progressText}>
            Come back after 15 games. Form will compare your performance before
            and after this protocol and update the diagnosis.
          </Text>
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

  // Hero
  hero: {
    backgroundColor: theme.colors.surface.low,
    padding: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface.high,
    gap: theme.spacing.lg,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  missionLabel: {
    fontFamily: theme.fonts.labelBold,
    fontSize: 10,
    color: theme.colors.positive,
    letterSpacing: 2,
  },
  pill: {
    backgroundColor: theme.colors.surface.high,
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  pillText: {
    fontFamily: theme.fonts.labelBold,
    fontSize: 10,
    color: theme.colors.text.secondary,
    letterSpacing: 1.5,
  },
  goalText: {
    fontFamily: theme.fonts.heading,
    fontSize: 32,
    color: theme.colors.text.primary,
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  statsStrip: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: theme.spacing.sm,
  },
  statCol: {
    gap: theme.spacing.xs,
  },
  statLabel: {
    fontFamily: theme.fonts.labelBold,
    fontSize: 9,
    color: theme.colors.text.secondary,
    letterSpacing: 1.5,
  },
  statValue: {
    fontFamily: theme.fonts.heading,
    fontSize: 28,
    color: theme.colors.text.primary,
    letterSpacing: -0.5,
  },
  statValueMuted: {
    color: theme.colors.text.secondary,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: theme.colors.surface.high,
    marginHorizontal: theme.spacing.lg,
  },

  // Protocol
  protocolSection: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface.high,
  },
  sectionLabel: {
    fontFamily: theme.fonts.labelBold,
    fontSize: 10,
    color: theme.colors.text.secondary,
    letterSpacing: 2,
    marginBottom: theme.spacing.sm,
  },

  // Progress placeholder
  progressBlock: {
    marginHorizontal: theme.spacing.xl,
    marginTop: theme.spacing.lg,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: theme.colors.text.disabled,
    gap: theme.spacing.sm,
  },
  progressLabel: {
    fontFamily: theme.fonts.labelBold,
    fontSize: 10,
    color: theme.colors.text.disabled,
    letterSpacing: 2,
  },
  progressText: {
    fontFamily: theme.fonts.body,
    fontSize: 13,
    color: theme.colors.text.disabled,
    lineHeight: 20,
  },
});
