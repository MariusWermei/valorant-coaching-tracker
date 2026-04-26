import { View, Text, StyleSheet } from "react-native";
import { theme } from "@/constants/theme";

type PerformanceEntry = {
  name: string;
  winrate: number;
  count: number;
  kdRatio: number;
};

type PerformanceDuelProps = {
  best: PerformanceEntry;
  worst: PerformanceEntry;
};

export default function PerformanceDuel({ best, worst }: PerformanceDuelProps) {
  const delta = Math.round(best.winrate - worst.winrate);

  return (
    <View style={styles.card}>
      <PerformanceRow entry={best} variant="best" />
      <View style={styles.separator} />
      <PerformanceRow entry={worst} variant="worst" />
      <View style={styles.deltaPill} pointerEvents="none">
        <Text style={styles.deltaText}>Δ {delta} pts</Text>
      </View>
    </View>
  );
}

function PerformanceRow({
  entry,
  variant,
}: {
  entry: PerformanceEntry;
  variant: "best" | "worst";
}) {
  const accent = variant === "best" ? theme.colors.positive : theme.colors.negative;
  const tag = variant === "best" ? "BEST" : "WEAKEST";
  const clamped = Math.max(0, Math.min(100, entry.winrate));

  return (
    <View style={styles.row}>
      <View style={styles.rowTop}>
        <View style={styles.left}>
          <Text style={[styles.tag, { color: accent }]}>{tag}</Text>
          <Text style={styles.name}>{entry.name}</Text>
          <Text style={styles.meta}>
            {entry.count} games · K/D {entry.kdRatio.toFixed(2)}
          </Text>
        </View>
        <View style={styles.winrateBlock}>
          <Text style={[styles.winrate, { color: accent }]}>
            {Math.round(entry.winrate)}
          </Text>
          <Text style={styles.winrateUnit}>%</Text>
        </View>
      </View>
      <View style={styles.barTrack}>
        <View
          style={[styles.barFill, { width: `${clamped}%`, backgroundColor: accent }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.radius.md,
    overflow: "hidden",
    position: "relative",
  },
  row: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  left: {
    flex: 1,
    gap: 2,
  },
  tag: {
    fontFamily: theme.fonts.labelBold,
    fontSize: 9,
    letterSpacing: 2,
  },
  name: {
    fontFamily: theme.fonts.heading,
    fontSize: 20,
    color: theme.colors.text.primary,
    letterSpacing: -0.3,
  },
  meta: {
    fontFamily: theme.fonts.label,
    fontSize: 10,
    color: theme.colors.text.secondary,
    letterSpacing: 0.8,
    marginTop: 2,
  },
  winrateBlock: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginLeft: theme.spacing.md,
  },
  winrate: {
    fontFamily: theme.fonts.heading,
    fontSize: 24,
    letterSpacing: -0.8,
    lineHeight: 26,
  },
  winrateUnit: {
    fontFamily: theme.fonts.headingLight,
    fontSize: 13,
    color: theme.colors.text.secondary,
    marginLeft: 2,
    marginBottom: 2,
  },
  barTrack: {
    height: 2,
    backgroundColor: theme.colors.surface.high,
    borderRadius: 1,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 1,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.surface.base,
    marginHorizontal: theme.spacing.lg,
  },
  deltaPill: {
    position: "absolute",
    top: "50%",
    right: theme.spacing.lg,
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: theme.colors.surface.overlay,
    borderRadius: theme.radius.pill,
    transform: [{ translateY: -10 }],
  },
  deltaText: {
    fontFamily: theme.fonts.labelBold,
    fontSize: 9,
    color: theme.colors.text.secondary,
    letterSpacing: 1,
  },
});
