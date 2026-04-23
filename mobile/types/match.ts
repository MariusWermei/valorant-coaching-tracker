export type Match = {
  matchId: string;
  date: string;
  mode: "competitive" | "deathmatch" | "swiftplay" | "unrated";
  map: string;
  agent: string;
  result: "win" | "loss";
  kills: number;
  deaths: number;
  assists: number;
  score: number;
  roundsWon: number;
  roundsLost: number;
};

export type MatchesResponse = {
  result: boolean;
  matches: Match[];
};
