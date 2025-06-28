import type { Player, Match, Matchup, Team } from '../types';

// Simple deterministic random number generator for consistent results
class DeterministicRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

export const generateMatchups = (players: Player[], matchesPerMatchup: number): Matchup[] => {
  if (players.length < 4) {
    return [];
  }

  // Generate all possible teams of 2 players
  const teams: Team[] = [];
  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      teams.push({
        id: `${players[i].id}-${players[j].id}`,
        player1: players[i],
        player2: players[j],
      });
    }
  }

  // Generate matches between different teams
  const matchups: Matchup[] = [];
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      const team1 = teams[i];
      const team2 = teams[j];
      
      // Check if teams have any players in common (shouldn't play against each other)
      const team1Players = [team1.player1.id, team1.player2.id];
      const team2Players = [team2.player1.id, team2.player2.id];
      const hasCommonPlayers = team1Players.some(id => team2Players.includes(id));
      
      if (!hasCommonPlayers) {
        const matches: Match[] = [];
        
        // Create the specified number of matches for this team matchup
        for (let k = 0; k < matchesPerMatchup; k++) {
          matches.push({
            id: `${team1.id}-vs-${team2.id}-match-${k + 1}`,
            team1: team1,
            team2: team2,
            team1Score: 0,
            team2Score: 0,
            isCompleted: false,
          });
        }

        const matchup: Matchup = {
          id: `${team1.id}-vs-${team2.id}`,
          team1: team1,
          team2: team2,
          matches: matches,
        };
        matchups.push(matchup);
      }
    }
  }

  return matchups;
};

export const generateMatchupsByPlayerMatches = (
  players: Player[], 
  matchesPerPlayer: number
): Matchup[] => {
  if (players.length < 4) {
    return [];
  }

  // Create a seed based on player count and matches per player for consistent results
  const seed = players.length * 1000 + matchesPerPlayer;
  const random = new DeterministicRandom(seed);

  // Calculate total matches needed
  const totalMatches = (players.length * matchesPerPlayer) / 4; // 4 players per match

  const matchups: Matchup[] = [];
  const usedMatchups = new Set<string>();

  // Track how many matches each player has played
  const playerMatchCount = new Map<string, number>();
  players.forEach(player => playerMatchCount.set(player.id, 0));

  let attempts = 0;
  const maxAttempts = totalMatches * 100; // Prevent infinite loops

  while (matchups.length < totalMatches && attempts < maxAttempts) {
    attempts++;

    // Shuffle players to get random pairing
    const shuffledPlayers = random.shuffle([...players]);
    
    // Try to create teams from shuffled players
    for (let i = 0; i < shuffledPlayers.length - 3; i += 4) {
      if (i + 3 >= shuffledPlayers.length) break;

      const team1: Team = {
        id: `${shuffledPlayers[i].id}-${shuffledPlayers[i + 1].id}`,
        player1: shuffledPlayers[i],
        player2: shuffledPlayers[i + 1],
      };

      const team2: Team = {
        id: `${shuffledPlayers[i + 2].id}-${shuffledPlayers[i + 3].id}`,
        player1: shuffledPlayers[i + 2],
        player2: shuffledPlayers[i + 3],
      };

      // Check if this matchup has been used before
      const matchupKey = [team1.id, team2.id].sort().join('-vs-');
      if (usedMatchups.has(matchupKey)) {
        continue;
      }

      // Check if any player would exceed their match limit
      const team1Players = [team1.player1.id, team1.player2.id];
      const team2Players = [team2.player1.id, team2.player2.id];
      const allPlayers = [...team1Players, ...team2Players];
      
      const wouldExceedLimit = allPlayers.some(playerId => {
        const currentCount = playerMatchCount.get(playerId) || 0;
        return currentCount >= matchesPerPlayer;
      });

      if (wouldExceedLimit) {
        continue;
      }

      // Create the matchup
      const matchup: Matchup = {
        id: matchupKey,
        team1: team1,
        team2: team2,
        matches: [{
          id: `${matchupKey}-match-1`,
          team1: team1,
          team2: team2,
          team1Score: 0,
          team2Score: 0,
          isCompleted: false,
        }],
      };

      matchups.push(matchup);
      usedMatchups.add(matchupKey);

      // Update player match counts
      allPlayers.forEach(playerId => {
        const currentCount = playerMatchCount.get(playerId) || 0;
        playerMatchCount.set(playerId, currentCount + 1);
      });

      if (matchups.length >= totalMatches) break;
    }
  }

  return matchups;
}; 