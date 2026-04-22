const buildAnalysisPrompt = (stats) => {
  const prompt = `You are an expert VALORANT performance coach. Analyze this player's recent performance data and provide         
  actionable coaching feedback.                                                                                                     
                                                                                                                                    
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
  Analyze this data and provide specific, evidence-based coaching feedback. Do not invent stats that are not provided. Every insight
   must be supported by the data above.                                                                                             
   
  Respond ONLY with valid JSON using this exact structure:                                                                          
  {                                                                                                                                 
    "summary": "A short paragraph describing the player's current level, main pattern, and immediate priority",
    "strengths": ["strength 1", "strength 2", "strength 3"],                                                                        
    "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
    "focusAreas": ["priority 1", "priority 2"]                                                                                      
  }`;

  return prompt;
};

module.exports = { buildAnalysisPrompt };
