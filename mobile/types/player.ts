export type Player = {
  playerId: string;
  displayName: string;
  riotTag: string;
  profileType: string;
  notes?: string;
};

export type PlayersResponse = {
  result: boolean;
  data: Player[];
};
