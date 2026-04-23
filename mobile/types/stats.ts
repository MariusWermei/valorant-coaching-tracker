import { PlayerStats } from "./analysis";

export type StatsResponse = {
  result: boolean;
  player: {
    displayName: string;
    riotTag: string;
  };
  stats: PlayerStats;
};
