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

      {/* Delta pill floats on top of the separator */}
      <View style={styles.deltaPill} pointerEvents="none">
        <Text style={styles.deltaLabel}>Δ</Text>
        <Text style={styles.deltaValue}>{delta} pts</Text>
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
  const accent =
    variant === "best" ? theme.colors.success : theme.colors.primary;
  const tagLabel = variant === "best" ? "STRONGEST" : "WEAKEST";
  const clampedWinrate = Math.max(0, Math.min(100, entry.winrate));

  return (
    <View style={styles.row}>
      <View style={styles.rowTop}>
        <View style={styles.headerBlock}>
          <Text style={[styles.tag, { color: accent }]}>{tagLabel}</Text>
          <Text style={styles.name}>{entry.name}</Text>
          <Text style={styles.meta}>
            {entry.count} games · K/D {entry.kdRatio.toFixed(2)}
          </Text>
        </View>
        <View style={styles.winrateWrapper}>
          <Text style={[styles.winrate, { color: accent }]}>
            {Math.round(entry.winrate)}
          </Text>
          <Text style={styles.winrateUnit}>%</Text>
        </View>
      </View>

      <View style={styles.barTrack}>
        <View
          style={[
            styles.barFill,
            { width: `${clampedWinrate}%`, backgroundColor: accent },
          ]}
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
  headerBlock: {
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
    letterSpacing: 1,
    marginTop: 2,
  },
  winrateWrapper: {
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
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: theme.colors.surface.high,
    borderRadius: 999,
    transform: [{ translateY: -10 }],
  },
  deltaLabel: {
    fontFamily: theme.fonts.labelBold,
    fontSize: 9,
    color: theme.colors.text.secondary,
  },
  deltaValue: {
    fontFamily: theme.fonts.labelBold,
    fontSize: 9,
    color: theme.colors.text.primary,
    letterSpacing: 1,
  },
});
