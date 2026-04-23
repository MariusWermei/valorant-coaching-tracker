export type BaseStats = {
  winrate: number;
  averageKills: number;
  averageDeaths: number;
  averageScore: number;
  kdRatio: number;
};

export type SplitStats = BaseStats & {
  count: number;
};

export type CoachingSignal = BaseStats & {
  name: string;
  count: number;
};

export type CoachingSignals = {
  bestMap: CoachingSignal;
  worstMap: CoachingSignal;
  bestAgent: CoachingSignal;
  worstAgent: CoachingSignal;
  numberOfAgentPlayed: number;
};

export type PlayerStats = BaseStats & {
  trend: "improving" | "stable" | "declining";
  totalMatches: number;
  totalWins: number;
  totalLosses: number;
  averageAssists: number;
  modeSplits: Record<string, SplitStats>;
  mapSplits: Record<string, SplitStats>;
  agentSplits: Record<string, SplitStats>;
  coachingSignals: CoachingSignals;
};

export type Coaching = {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  focusAreas: string[];
  actionPlan: {
    title: string;
    durationDays: number;
    steps: string[];
    successCriteria: string;
  };
};

export type PlayerAnalysisResponse = {
  result: boolean;
  stats: PlayerStats;
  coaching: Coaching | string;
};
