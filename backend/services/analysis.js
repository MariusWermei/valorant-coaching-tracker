const computeBaseStats = (matches) => {
  const win = matches.filter((e) => e.result === "win");
  const winNumber = win.length;
  const winRate = (winNumber / matches.length) * 100;

  const totalKills = matches.reduce((acc, match) => acc + match.kills, 0);
  const averageKills = totalKills / matches.length;

  const totalDeaths = matches.reduce((acc, match) => acc + match.deaths, 0);
  const averageDeaths = totalDeaths / matches.length;

  const totalScore = matches.reduce((acc, match) => acc + match.score, 0);
  const averageScore = totalScore / matches.length;

  const kdRatio = averageKills / averageDeaths;

  return {
    winrate: winRate,
    averageKills: averageKills,
    averageDeaths: averageDeaths,
    averageScore: averageScore,
    kdRatio: kdRatio,
  };
};

const computeSplitBy = (matches, field) => {
  const allValues = matches.map((e) => e[field]);
  const uniqueValues = [...new Set(allValues)];

  const result = {};

  uniqueValues.forEach((value) => {
    const filteredMatches = matches.filter((m) => m[field] === value);

    const count = filteredMatches.length;

    result[value] = {
      count: count,
      ...computeBaseStats(filteredMatches),
    };
  });
  return result;
};

const computeTrendsMatches = (matches) => {
  const firstGroup = matches.slice(-5);
  const secondGroup = matches.slice(-10, -5);

  const firstGroupStats = computeBaseStats(firstGroup);
  const secondGroupStats = computeBaseStats(secondGroup);

  let label = "";

  const difference =
    ((firstGroupStats.averageScore - secondGroupStats.averageScore) /
      secondGroupStats.averageScore) *
    100;

  if (difference > 4) {
    label = "improving";
  } else if (difference < -4) {
    label = "declining";
  } else {
    label = "stable";
  }

  return label;
};

//   1. Best/worst map — la map avec le meilleur et le pire winRate
//   2. Best/worst agent — pareil pour les agents
//   3. Agent diversity — combien d'agents différents joués (beaucoup = trop dispersé)
//   4. DM vs competitive gap — l'écart de performance entre deathmatch et compétitif

const computeCoachingSignals = (matches) => {
  const mapsData = computeSplitBy(matches, "map");
  const agentsData = computeSplitBy(matches, "agent");

  const mapsSorted = Object.entries(mapsData).sort(
    (a, b) => b[1].winrate - a[1].winrate,
  );

  const agentsSorted = Object.entries(agentsData).sort(
    (a, b) => b[1].winrate - a[1].winrate,
  );

  const agentDiversity = Object.keys(agentsData).length;

  return {
    bestMap: { name: mapsSorted[0][0], ...mapsSorted[0][1] },
    worstMap: {
      name: mapsSorted[mapsSorted.length - 1][0],
      ...mapsSorted[mapsSorted.length - 1][1],
    },
    bestAgent: { name: agentsSorted[0][0], ...agentsSorted[0][1] },
    worstAgent: {
      name: agentsSorted[agentsSorted.length - 1][0],
      ...agentsSorted[agentsSorted.length - 1][1],
    },
    numberOfAgentPlayed: agentDiversity,
  };
};

const computeAnalysis = (matches) => {
  const win = matches.filter((e) => e.result === "win");
  const winNumber = win.length;
  const lossNumber = matches.length - winNumber;

  const totalAssists = matches.reduce((acc, match) => acc + match.assists, 0);
  const averageAssists = totalAssists / matches.length;

  return {
    trend: computeTrendsMatches(matches),
    ...computeBaseStats(matches),
    totalMatches: matches.length,
    totalWins: winNumber,
    totalLosses: lossNumber,
    averageAssists: averageAssists,
    modeSplits: computeSplitBy(matches, "mode"),
    mapSplits: computeSplitBy(matches, "map"),
    agentSplits: computeSplitBy(matches, "agent"),
    coachingSignals: computeCoachingSignals(matches),
  };
};

module.exports = { computeAnalysis };
