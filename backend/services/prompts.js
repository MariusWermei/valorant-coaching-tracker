const buildFullCoachingPrompt = (stats) => {
  const prompt = `You are an expert VALORANT performance coach. Analyze this player's recent performance data and provide complete coaching
  feedback with an improvement plan.

  PLAYER STATS:
  - Win rate: ${stats.winrate}%
  - K/D ratio: ${stats.kdRatio}
  - Average score: ${stats.averageScore}
  - Average kills: ${stats.averageKills}
  - Average deaths: ${stats.averageDeaths}
  - Total matches: ${stats.totalMatches}
  - Wins: ${stats.totalWins} / Losses: ${stats.totalLosses}
  - Recent trend: ${stats.trend}

  MAP PERFORMANCE:
  - Best map: ${stats.coachingSignals.bestMap.name} (${stats.coachingSignals.bestMap.winrate}% win rate,
  ${stats.coachingSignals.bestMap.kdRatio} K/D)
  - Worst map: ${stats.coachingSignals.worstMap.name} (${stats.coachingSignals.worstMap.winrate}% win rate,
  ${stats.coachingSignals.worstMap.kdRatio} K/D)

  AGENT PERFORMANCE:
  - Best agent: ${stats.coachingSignals.bestAgent.name} (${stats.coachingSignals.bestAgent.winrate}% win rate,
  ${stats.coachingSignals.bestAgent.kdRatio} K/D)
  - Worst agent: ${stats.coachingSignals.worstAgent.name} (${stats.coachingSignals.worstAgent.winrate}% win rate,
  ${stats.coachingSignals.worstAgent.kdRatio} K/D)
  - Total agents played: ${stats.coachingSignals.numberOfAgentPlayed}

  INSTRUCTIONS:
  Analyze this data and provide specific, evidence-based coaching feedback with a 7-day improvement plan. Do not invent stats that are not
  provided. Every insight must be supported by the data above. Do NOT wrap the response in markdown code blocks. No backticks.

  Respond ONLY with valid JSON using this exact structure:
  {
    "summary": "A short paragraph describing the player's current level, main pattern, and immediate priority",
    "strengths": ["strength 1", "strength 2", "strength 3"],
    "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
    "focusAreas": ["priority 1", "priority 2"],
    "actionPlan": {
      "title": "Short plan title based on the main focus",
      "durationDays": 7,
      "steps": ["Day 1-2: specific action", "Day 3-4: specific action", "Day 5-6: specific action", "Day 7: specific action"],
      "successCriteria": "How the player should measure progress after 7 days"
    }
  }`;

  return prompt;
};

module.exports = { buildFullCoachingPrompt };
