const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export async function getPlayers() {
  const response = await fetch(`${BASE_URL}/api/players`);
  const data = await response.json();
  return data;
}

export async function getPlayerMatches(playerId: string) {
  const response = await fetch(`${BASE_URL}/api/players/${playerId}/matches`);
  const data = await response.json();
  return data;
}

export async function getPlayersAnalysis(playerId: string) {
  const response = await fetch(`${BASE_URL}/api/players/${playerId}/analysis`);
  const data = await response.json();
  return data;
}
