export interface Player {
  id: string;
  name: string;
  // We can add more properties here later like:
  // skillLevel: number;
  // position: string;
  // stats: PlayerStats;
}

export interface Team {
  id: string;
  player1: Player;
  player2: Player;
}

export interface Match {
  id: string;
  team1: Team;
  team2: Team;
  team1Score: number;
  team2Score: number;
  isCompleted: boolean;
}

export interface Matchup {
  id: string;
  team1: Team;
  team2: Team;
  matches: Match[];
} 