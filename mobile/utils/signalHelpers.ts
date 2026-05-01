import { theme } from "@/constants/theme";
import { PlayerStats } from "@/types/analysis";

export type SignalScores = {
  consistencyColor: string;
  tiltResilience: number;
  tiltColor: string;
  sessionDriftScore: number;
  sessionDriftColor: string;
};

export type SignalDescriptions = {
  consistencyDesc: string;
  tiltDesc: string;
  driftDesc: string;
};

export type StatRowData = {
  mapAgentBigValue: string;
  mapAgentDesc: string;
  scoreShapeValue: string;
  scoreShapeDesc: string;
  dmCompValue: string;
  dmCompColor: string;
  dmCompDesc: string;
};

export function computeSignalScores(stats: PlayerStats): SignalScores {
  const consistencyColor =
    stats.consistencyScore >= 60
      ? theme.colors.positive
      : theme.colors.negative;

  const tiltResilience = Math.max(0, Math.min(100, 100 + stats.tiltScore));
  const tiltColor =
    stats.tiltScore < -10 ? theme.colors.negative : theme.colors.positive;

  const sessionDriftScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(100 - Math.abs(stats.sessionDrift.warmupGap) * 150),
    ),
  );
  const sessionDriftColor =
    stats.sessionDrift.warmupGap < -0.1
      ? theme.colors.negative
      : theme.colors.positive;

  return {
    consistencyColor,
    tiltResilience,
    tiltColor,
    sessionDriftScore,
    sessionDriftColor,
  };
}

export function buildSignalDescriptions(
  stats: PlayerStats,
): SignalDescriptions {
  const consistencyDesc =
    stats.consistencyScore >= 80
      ? "Performance spread is tight — you show up every session."
      : stats.consistencyScore >= 60
        ? "Some variance in your performances, but generally reliable."
        : "High inconsistency — your ceiling is high but your floor brings you down.";

  const tiltDesc =
    stats.tiltScore < -20
      ? `K/D drops ${Math.abs(stats.tiltScore)}% in matches after a loss. Tilt is a real factor.`
      : stats.tiltScore < -10
        ? `Slight dip (${stats.tiltScore}%) after a loss. Watch for compounding sessions.`
        : "You stay composed after losses — no significant tilt detected.";

  const driftDesc =
    stats.sessionDrift.warmupGap < -0.1
      ? `First-game K/D: ${stats.sessionDrift.firstGameKd} → Later K/D: ${stats.sessionDrift.laterGamesKd}. You fade late.`
      : stats.sessionDrift.warmupGap > 0.1
        ? `First-game K/D: ${stats.sessionDrift.firstGameKd} → Later K/D: ${stats.sessionDrift.laterGamesKd}. You warm up well.`
        : "K/D stays consistent throughout your sessions.";

  return { consistencyDesc, tiltDesc, driftDesc };
}

export function buildStatRows(stats: PlayerStats): StatRowData {
  const cross = stats.mapAgentCross;
  const bestFit = cross[0];
  const worstFit = cross[cross.length - 1];
  const mapAgentBigValue = bestFit?.map ?? "—";
  const mapAgentDesc =
    cross.length >= 2
      ? `${bestFit.agent}/${bestFit.map} is your best pairing — ${bestFit.winrate}% win rate. ${worstFit.agent}/${worstFit.map} is your worst at ${worstFit.winrate}%.`
      : "Not enough data to compute map/agent fit.";

  const { closeLossRate, blowoutLossRate } = stats.scoreShape;
  const dominantLoss = blowoutLossRate >= closeLossRate ? "blowout" : "close";
  const scoreShapeValue =
    dominantLoss === "blowout" ? `${blowoutLossRate}%` : `${closeLossRate}%`;
  const scoreShapeDesc =
    dominantLoss === "blowout"
      ? `${blowoutLossRate}% of your losses are blowouts (≥5 rounds). When you lose, you lose hard.`
      : `${closeLossRate}% of your losses are close (≤2 rounds). You're competitive but lose key moments.`;

  const { dmCount, dmRatio, practiceFlag, compKd } = stats.dmCompGap;
  const dmCompValue = practiceFlag.toUpperCase();
  const dmCompColor =
    practiceFlag === "high" || practiceFlag === "moderate"
      ? theme.colors.positive
      : practiceFlag === "low"
        ? theme.colors.warning
        : theme.colors.negative;
  const dmCompDesc =
    practiceFlag === "none"
      ? `No deathmatch games. ${compKd < 1.0 ? "With a comp K/D of " + compKd + ", adding DM warmups could help." : "Not necessarily an issue given your comp K/D."}`
      : practiceFlag === "low"
        ? `Only ${dmCount} DM games (${dmRatio}%). ${compKd < 1.0 ? "Your comp K/D of " + compKd + " suggests more aim training would help." : "Your comp performance is solid regardless."}`
        : practiceFlag === "high" && compKd < 1.0
          ? `${dmCount} DM games (${dmRatio}%) but comp K/D is ${compKd}. You train aim regularly — the bottleneck is game sense.`
          : `${dmCount} DM games (${dmRatio}%). Good practice habits with a comp K/D of ${compKd}.`;

  return {
    mapAgentBigValue,
    mapAgentDesc,
    scoreShapeValue,
    scoreShapeDesc,
    dmCompValue,
    dmCompColor,
    dmCompDesc,
  };
}
