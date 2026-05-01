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

export type SessionDrift = {
  firstGameKd: number;
  laterGamesKd: number;
  warmupGap: number;
};

export type MapAgentCrossEntry = {
  map: string;
  agent: string;
  count: number;
  winrate: number;
  kdRatio: number;
  fitDelta: number;
};

export type ScoreShape = {
  closeLossRate: number;
  blowoutLossRate: number;
  closeWinRate: number;
};

export type DmCompGap = {
  dmCount: number;
  compCount: number;
  dmRatio: number;
  practiceFlag: "none" | "low" | "moderate" | "high";
  compKd: number;
};

export type WeeklyDelta = {
  winrateDelta: number;
  kdDelta: number;
  consistencyDelta: number;
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
  consistencyScore: number;
  tiltScore: number;
  sessionDrift: SessionDrift;
  mapAgentCross: MapAgentCrossEntry[];
  scoreShape: ScoreShape;
  dmCompGap: DmCompGap;
  weeklyDelta: WeeklyDelta;
};

export type ProtocolStep = {
  title: string;
  description: string;
};

export type WeeklyMission = {
  goal: string;
  protocol: ProtocolStep[];
  successMetric: string;
  antiPattern: string;
};

export type CoachingOutput = {
  headline: string;
  diagnosis: string;
  hiddenPattern: string;
  rootCause: string;
  counterIntuitive: string;
  weeklyMission: WeeklyMission;
};

export type PlayerAnalysisResponse = {
  result: boolean;
  stats: PlayerStats;
  coaching: CoachingOutput | string;
};
