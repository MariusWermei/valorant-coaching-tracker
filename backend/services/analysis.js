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

const computeConsistencyScore = (matches) => {
  const kdPerMatch = matches.map((match) =>
    match.deaths === 0 ? match.kills : match.kills / match.deaths,
  );
  const mean = kdPerMatch.reduce((acc, kd) => acc + kd, 0) / kdPerMatch.length;

  const sumSquaredDiffs = kdPerMatch.reduce((acc, kd) => {
    return acc + Math.pow(kd - mean, 2);
  }, 0);

  const stdDev = Math.sqrt(sumSquaredDiffs / kdPerMatch.length);

  return Math.max(0, Math.round((1 - stdDev / 1.5) * 100));
};

const computeTiltScore = (matches) => {
  const postLossMatches = matches.filter((match, index) => {
    if (index === 0) return false;
    return matches[index - 1].result === "loss";
  });

  if (postLossMatches.length === 0) return 0;

  const baselineKd = computeBaseStats(matches).kdRatio;
  const postLossKd = computeBaseStats(postLossMatches).kdRatio;

  return Math.round(((postLossKd - baselineKd) / baselineKd) * 100);
};

const computeSessionDrift = (matches) => {
  const sessionMap = {};

  matches.forEach((match) => {
    const day = new Date(match.date).toISOString().slice(0, 10);
    if (!sessionMap[day]) sessionMap[day] = [];
    sessionMap[day].push(match);
  });

  const validSessions = Object.values(sessionMap).filter(
    (session) => session.length >= 3,
  );

  if (validSessions.length === 0) {
    return { firstGameKd: 0, laterGamesKd: 0, warmupGap: 0 };
  }

  const firstGames = validSessions.map((session) => session[0]);
  const laterGames = validSessions.flatMap((session) => session.slice(2));

  const firstGameKd = computeBaseStats(firstGames).kdRatio;
  const laterGamesKd = computeBaseStats(laterGames).kdRatio;

  return {
    firstGameKd: Math.round(firstGameKd * 100) / 100,
    laterGamesKd: Math.round(laterGamesKd * 100) / 100,
    warmupGap: Math.round((laterGamesKd - firstGameKd) * 100) / 100,
  };
};

const computeMapAgentCross = (matches) => {
  const pairs = {};

  matches.forEach((match) => {
    const key = `${match.map}__${match.agent}`;
    if (!pairs[key]) pairs[key] = [];
    pairs[key].push(match);
  });

  const agentStats = computeSplitBy(matches, "agent");

  return Object.entries(pairs)
    .filter(([, pairMatches]) => pairMatches.length >= 2)
    .map(([key, pairMatches]) => {
      const [map, agent] = key.split("__");
      const stats = computeBaseStats(pairMatches);
      const agentKd = agentStats[agent]?.kdRatio ?? stats.kdRatio;

      return {
        map,
        agent,
        count: pairMatches.length,
        winrate: Math.round(stats.winrate),
        kdRatio: Math.round(stats.kdRatio * 100) / 100,
        fitDelta: Math.round((stats.kdRatio - agentKd) * 100) / 100,
      };
    })
    .sort((a, b) => b.fitDelta - a.fitDelta);
};

const computeScoreShape = (matches) => {
  const losses = matches.filter((m) => m.result === "loss");
  const wins = matches.filter((m) => m.result === "win");

  if (losses.length === 0)
    return { closeLossRate: 0, blowoutLossRate: 0, closeWinRate: 0 };

  const roundDiff = (m) => Math.abs(m.roundsWon - m.roundsLost);

  const closeLosses = losses.filter((m) => roundDiff(m) <= 2).length;
  const blowoutLosses = losses.filter((m) => roundDiff(m) >= 5).length;
  const closeWins = wins.filter((m) => roundDiff(m) <= 2).length;

  return {
    closeLossRate: Math.round((closeLosses / losses.length) * 100),
    blowoutLossRate: Math.round((blowoutLosses / losses.length) * 100),
    closeWinRate:
      wins.length > 0 ? Math.round((closeWins / wins.length) * 100) : 0,
  };
};

const computeDmCompGap = (matches) => {
  const dmMatches = matches.filter((m) => m.mode === "deathmatch");
  const compMatches = matches.filter((m) => m.mode === "competitive");
  const totalMatches = matches.length;

  const dmCount = dmMatches.length;
  const compCount = compMatches.length;
  const dmRatio =
    totalMatches > 0 ? Math.round((dmCount / totalMatches) * 100) : 0;

  let practiceFlag = "none";
  if (dmCount === 0) practiceFlag = "none";
  else if (dmRatio < 15) practiceFlag = "low";
  else if (dmRatio <= 30) practiceFlag = "moderate";
  else practiceFlag = "high";

  const compKd =
    compCount > 0
      ? Math.round(computeBaseStats(compMatches).kdRatio * 100) / 100
      : 0;

  return {
    dmCount,
    compCount,
    dmRatio,
    practiceFlag,
    compKd,
  };
};

const computeWeeklyDelta = (matches) => {
  const latestDate = new Date(
    Math.max(...matches.map((m) => new Date(m.date))),
  );
  const oneWeekAgo = new Date(latestDate - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(latestDate - 14 * 24 * 60 * 60 * 1000);

  const currentWindow = matches.filter((m) => new Date(m.date) >= oneWeekAgo);
  const priorWindow = matches.filter(
    (m) => new Date(m.date) >= twoWeeksAgo && new Date(m.date) < oneWeekAgo,
  );

  if (currentWindow.length === 0 || priorWindow.length === 0) {
    return { winrateDelta: 0, kdDelta: 0, consistencyDelta: 0 };
  }

  const current = computeBaseStats(currentWindow);
  const prior = computeBaseStats(priorWindow);

  return {
    winrateDelta: Math.round(current.winrate - prior.winrate),
    kdDelta: Math.round((current.kdRatio - prior.kdRatio) * 100) / 100,
    consistencyDelta:
      computeConsistencyScore(currentWindow) -
      computeConsistencyScore(priorWindow),
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
    consistencyScore: computeConsistencyScore(matches),
    tiltScore: computeTiltScore(matches),
    sessionDrift: computeSessionDrift(matches),
    mapAgentCross: computeMapAgentCross(matches),
    scoreShape: computeScoreShape(matches),
    dmCompGap: computeDmCompGap(matches),
    weeklyDelta: computeWeeklyDelta(matches),
  };
};

module.exports = { computeAnalysis };
