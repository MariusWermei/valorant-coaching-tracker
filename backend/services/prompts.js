const buildFullCoachingPrompt = (stats, primarySignals = []) => {
  const cross = stats.mapAgentCross ?? [];
  const topFits = cross.slice(0, 3);
  const worstFits = cross.slice(-3);

  const fmt = (n, decimals = 0) =>
    decimals === 0
      ? Math.round(n)
      : Math.round(n * 10 ** decimals) / 10 ** decimals;

  const sign = (n) => (n > 0 ? `+${n}` : `${n}`);

  const prompt = `THIS PLAYER'S #1 ISSUE: ${primarySignals[0] || "No dominant signal."}                                                                                                                      
                  
  Your ENTIRE analysis — headline, diagnosis, hiddenPattern, rootCause, counterIntuitive, weeklyMission — MUST center on this issue. Everything else is secondary context.
                                                                                                                                                                                                               
  ${
    primarySignals.length > 1
      ? `Secondary signals:\n${primarySignals
          .slice(1)
          .map((s, i) => `${i + 2}. ${s}`)
          .join("\n")}`
      : ""
  }
                                                                                                                                                                                                               
  You are a pedagogical VALORANT coach. You explain mechanisms: "when X happens, you tend to Y, because Z." You cite specific numbers.
                                                                                                                                                                                                               
  ---             
                                                                                                                                                                                                               
  PLAYER DATA:    

  BASE STATS:
  - Win rate: ${fmt(stats.winrate)}% (${stats.totalWins}W / ${stats.totalLosses}L over ${stats.totalMatches} matches)
  - K/D ratio: ${fmt(stats.kdRatio, 2)}                                                                                                                                                                        
  - Average score: ${fmt(stats.averageScore)}
  - Recent trend: ${stats.trend}                                                                                                                                                                               
                  
  DEEP SIGNALS:
  - Consistency score: ${stats.consistencyScore}/100                                                                                                                                                           
  - Tilt score: ${sign(stats.tiltScore)}% K/D change after a loss
  - Session drift: first game K/D ${stats.sessionDrift.firstGameKd} → later games K/D ${stats.sessionDrift.laterGamesKd} (gap: ${sign(stats.sessionDrift.warmupGap)})                                          
  - Score shape: ${stats.scoreShape.closeLossRate}% close losses, ${stats.scoreShape.blowoutLossRate}% blowout losses, ${stats.scoreShape.closeWinRate}% close wins                                            
  - DM practice: ${stats.dmCompGap.dmCount} DM games out of ${stats.totalMatches} (${stats.dmCompGap.dmRatio}%). Practice level: ${stats.dmCompGap.practiceFlag}. Comp K/D: ${stats.dmCompGap.compKd}          
  - Weekly delta: WR ${sign(stats.weeklyDelta.winrateDelta)}%, K/D ${sign(stats.weeklyDelta.kdDelta)}, consistency ${sign(stats.weeklyDelta.consistencyDelta)} pts                                             
                                                                                                                                                                                                               
  MAP × AGENT FIT:                                                                                                                                                                                             
  Best: ${topFits.map((p) => `${p.agent}/${p.map} ${p.winrate}%WR K/D ${p.kdRatio} (${sign(p.fitDelta)})`).join(" | ")}                                                                                        
  Worst: ${worstFits.map((p) => `${p.agent}/${p.map} ${p.winrate}%WR K/D ${p.kdRatio} (${sign(p.fitDelta)})`).join(" | ")}                                                                                     
                                                                                                                                                                                                               
  AGENT POOL:                                                                                                                                                                                                  
  - Best: ${stats.coachingSignals.bestAgent.name} (${fmt(stats.coachingSignals.bestAgent.winrate)}% WR, K/D ${fmt(stats.coachingSignals.bestAgent.kdRatio, 2)})                                                
  - Worst: ${stats.coachingSignals.worstAgent.name} (${fmt(stats.coachingSignals.worstAgent.winrate)}% WR, K/D ${fmt(stats.coachingSignals.worstAgent.kdRatio, 2)})                                            
  - Total agents played: ${stats.coachingSignals.numberOfAgentPlayed}                                                                                                                                          
                                                                                                                                                                                                               
  ---                                                                                                                                                                                                          
                  
  RULES:
  1. Every claim cites a specific number from the data above. Never invent statistics not listed.
  2. Headline must surprise THIS player. If it could apply to anyone, rewrite it.                                                                                                                              
  3. counterIntuitive must go AGAINST the player's natural reflex. If it sounds obvious, it is wrong.
  4. VALORANT constraints: maps are RANDOM in matchmaking (never suggest choosing a map). Agents are RANDOM in deathmatch with all abilities disabled (never suggest choosing an agent in DM or practicing     
  abilities in DM). DM is pure aim training only.                                                                                                                                                              
  5. Protocol descriptions must be 2-3 sentences each, describing a behavioral focus during games the player naturally plays. Each must include what to do, when, and one specific thing to track.             
                                                                                                                                                                                                               
  Protocol examples to imitate:
  - "During your next 10 competitive games, call out one enemy position per round before taking any duel. This builds the habit of info-gathering before committing, which directly reduces unnecessary        
  deaths."                                                                                                                                                                                                     
  - "Play 3 DM games before each comp session as crosshair placement warmup. Focus on keeping crosshair at head level around every corner, not on the scoreboard."                                             
  - "If you lose 2 comp games in a row, stop for 15 minutes. Identify one fight per lost game you should not have taken. This breaks the tilt cycle of re-queuing on autopilot."                               
  - "In your next competitive games, track how many times per half you take a duel without a teammate ready to trade. Aim for zero solo duels — this forces you to play with your team instead of              
  solo-carrying."                                                                                                                                                                                              
                                                                                                                                                                                                               
  ---                                                                                                                                                                                                          
                  
  Respond ONLY with valid JSON. No markdown, no backticks, no text outside the JSON.

  {
    "headline": "one short revelatory sentence about the #1 issue",
    "diagnosis": "2-3 sentences explaining what is happening and why, citing numbers from the data",                                                                                                           
    "hiddenPattern": "one non-obvious pattern the player missed, explained with data",
    "rootCause": "the core mechanism driving the problem — one clear sentence",                                                                                                                                
    "counterIntuitive": "one advice that goes against the player's reflex, explained in 2-3 sentences",
    "weeklyMission": {                                                                                                                                                                                         
      "goal": "one sentence: what winning looks like this week, tied to the #1 issue",
      "protocol": [                                                                                                                                                                                            
        { "title": "6-10 word action name", "description": "2-3 sentences: what to do, when, one thing to track, why it targets the root cause" },
        { "title": "6-10 word action name", "description": "2-3 sentences: what to do, when, one thing to track, why it targets the root cause" },                                                             
        { "title": "6-10 word action name", "description": "2-3 sentences: what to do, when, one thing to track, why it targets the root cause" },                                                             
        { "title": "6-10 word action name", "description": "2-3 sentences: what to do, when, one thing to track, why it targets the root cause" }                                                              
      ],                                                                                                                                                                                                       
      "successMetric": "2-3 sentences: current baseline numbers and what change signals progress",
      "antiPattern": "2-3 sentences: one behavior to stop, why it reinforces the problem, what to do instead"                                                                                                  
    }             
  }`;

  return prompt;
};

module.exports = { buildFullCoachingPrompt };
