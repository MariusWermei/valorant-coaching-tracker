const computePrimarySignals = (stats) => {
  const signals = [];
  const sign = (n) => (n > 0 ? `+${n}` : `${n}`);

  const agentRatio =
    stats.coachingSignals.numberOfAgentPlayed / stats.totalMatches;

  if (stats.coachingSignals.numberOfAgentPlayed >= 8) {
    signals.push({
      weight: stats.coachingSignals.numberOfAgentPlayed * 5,
      signal: `AGENT FRAGMENTATION: This player used ${stats.coachingSignals.numberOfAgentPlayed} different agents across ${stats.totalMatches} matches. No agent has enough games to build real competence.   
  Average games per agent: ${Math.round(stats.totalMatches / stats.coachingSignals.numberOfAgentPlayed)}.`,
    });
  }

  const agentEntries = Object.entries(stats.agentSplits).sort(
    (a, b) => b[1].count - a[1].count,
  );
  const mainAgent = agentEntries[0];
  const mainPct = Math.round((mainAgent[1].count / stats.totalMatches) * 100);

  if (mainPct >= 60 && agentEntries.length <= 3) {
    signals.push({
      weight: 30,
      signal: `NARROW AGENT POOL: ${mainAgent[0]} represents ${mainPct}% of all games (${mainAgent[1].count}/${stats.totalMatches}). This player is highly specialized.`,
    });
  }

  if (agentEntries.length >= 2) {
    const mainWr = mainAgent[1].winrate;
    const othersCount = agentEntries
      .slice(1)
      .reduce((acc, [, s]) => acc + s.count, 0);
    const othersWr =
      agentEntries
        .slice(1)
        .reduce((acc, [, s]) => acc + s.winrate * s.count, 0) / othersCount;

    if (
      mainAgent[1].count >= stats.totalMatches * 0.4 &&
      mainWr - othersWr > 30
    ) {
      signals.push({
        weight: (mainWr - othersWr) * 0.8,
        signal: `AGENT DEPENDENCY: ${mainAgent[0]} carries with ${Math.round(mainWr)}% WR (${mainAgent[1].count} games), while other agents average ${Math.round(othersWr)}% WR. Performance collapses without the main.`,
      });
    }
  }

  // ── Consistency extremes ─────────────────────────────────────────
  if (stats.consistencyScore <= 65) {
    signals.push({
      weight: 100 - stats.consistencyScore,
      signal: `LOW CONSISTENCY: ${stats.consistencyScore}/100 — performance swings wildly between games. High variance is the primary issue, not average level.`,
    });
  } else if (stats.consistencyScore >= 85) {
    signals.push({
      weight: stats.consistencyScore - 50,
      signal: `HIGH CONSISTENCY: ${stats.consistencyScore}/100 — extremely stable and predictable. The issue is NOT variance — it's ceiling. The bottleneck is mechanical or strategic, not mental.`,
    });
  }

  // ── Tilt ─────────────────────────────────────────────────────────
  if (stats.tiltScore <= -15) {
    signals.push({
      weight: Math.abs(stats.tiltScore),
      signal: `TILT VULNERABLE: K/D drops ${Math.abs(stats.tiltScore)}% after a loss. This player tilts significantly — session length and stop-loss rules are critical.`,
    });
  } else if (stats.tiltScore >= 15) {
    signals.push({
      weight: stats.tiltScore * 0.8,
      signal: `AGGRESSIVE AFTER LOSS: K/D rises ${stats.tiltScore}% after a loss — fights harder when losing, which risks overaggression.`,
    });
  }

  // ── Session drift ────────────────────────────────────────────────
  const driftMag = Math.abs(stats.sessionDrift.warmupGap);

  if (driftMag >= 0.15) {
    const direction =
      stats.sessionDrift.warmupGap < 0 ? "FATIGUE DROP" : "WARMUP BENEFIT";
    signals.push({
      weight: driftMag * 100,
      signal: `SESSION DRIFT — ${direction}: K/D goes from ${stats.sessionDrift.firstGameKd} (first game) to ${stats.sessionDrift.laterGamesKd} (later games), a shift of ${sign(stats.sessionDrift.warmupGap)}. ${stats.sessionDrift.warmupGap < 0 ? "Performance degrades over a session." : "Performance improves with warmup."}`,
    });
  }

  // ── DM practice habits ──────────────────────────────────────────
  const { dmCount, compCount, dmRatio, practiceFlag, compKd } = stats.dmCompGap;

  if (practiceFlag === "none" && compKd < 1.0) {
    signals.push({
      weight: 35,
      signal: `NO DM PRACTICE: 0 deathmatch games out of ${stats.totalMatches}. Comp K/D is ${compKd} — player never warms up or trains raw aim. Adding dedicated DM sessions could directly improve
  mechanical performance.`,
    });
  } else if (practiceFlag === "low" && compKd < 1.0) {
    signals.push({
      weight: 30,
      signal: `LOW DM PRACTICE: Only ${dmCount} DM games out of ${stats.totalMatches} (${dmRatio}%). Comp K/D is ${compKd} — player may benefit from more frequent aim training sessions.`,
    });
  } else if (practiceFlag === "high" && compKd < 1.0) {
    signals.push({
      weight: 40,
      signal: `HIGH DM BUT WEAK COMP: ${dmCount} DM games (${dmRatio}%) but comp K/D is only ${compKd}. The player trains aim regularly but it does not translate to competitive. The bottleneck is game     
  sense and decision-making, not mechanics.`,
    });
  }

  // ── Score shape ──────────────────────────────────────────────────
  if (stats.scoreShape.blowoutLossRate >= 55) {
    signals.push({
      weight: (stats.scoreShape.blowoutLossRate - 45) * 1.5,
      signal: `BLOWOUT LOSSES: ${stats.scoreShape.blowoutLossRate}% of losses are blowouts (5+ rounds gap). This player either dominates or collapses — rarely competes in close games.`,
    });
  }

  if (stats.scoreShape.closeLossRate >= 35) {
    signals.push({
      weight: (stats.scoreShape.closeLossRate - 25) * 1.5,
      signal: `CLOSE LOSSES: ${stats.scoreShape.closeLossRate}% of losses are within 2 rounds. Competitive but cannot close tight games.`,
    });
  }

  // ── Weekly delta (momentum) ──────────────────────────────────────
  if (stats.weeklyDelta.winrateDelta >= 15) {
    signals.push({
      weight: stats.weeklyDelta.winrateDelta * 0.8,
      signal: `STRONG UPTREND: Win rate ${sign(stats.weeklyDelta.winrateDelta)}% and K/D ${sign(stats.weeklyDelta.kdDelta)} this week. Player is improving — coaching should protect momentum, not disrupt it.`,
    });
  } else if (stats.weeklyDelta.winrateDelta <= -15) {
    signals.push({
      weight: Math.abs(stats.weeklyDelta.winrateDelta) * 0.8,
      signal: `DOWNTREND: Win rate ${sign(stats.weeklyDelta.winrateDelta)}% this week. Something changed — coaching must diagnose what broke.`,
    });
  }

  // ── Sort by weight, return top 3 as strings ──────────────────────
  signals.sort((a, b) => b.weight - a.weight);
  return signals.slice(0, 3).map((s) => s.signal);
};

module.exports = { computePrimarySignals };
