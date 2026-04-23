import { PlayersResponse } from "@/types/player";
import { MatchesResponse } from "@/types/match";
import { StatsResponse } from "@/types/stats";
import { PlayerAnalysisResponse } from "@/types/analysis";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export async function getPlayers(): Promise<PlayersResponse> {
  const response = await fetch(`${BASE_URL}/api/players`);
  const data = await response.json();
  return data;
}

export async function getPlayerMatches(
  playerId: string,
): Promise<MatchesResponse> {
  const response = await fetch(`${BASE_URL}/api/players/${playerId}/matches`);
  const data = await response.json();
  return data;
}

export async function getPlayerStats(playerId: string): Promise<StatsResponse> {
  const response = await fetch(`${BASE_URL}/api/players/${playerId}/stats`);
  const data = await response.json();
  return data;
}

export async function getPlayersAnalysis(
  playerId: string,
): Promise<PlayerAnalysisResponse> {
  const response = await fetch(`${BASE_URL}/api/players/${playerId}/analysis`);
  const data = await response.json();
  return data;
}
