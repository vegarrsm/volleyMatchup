import type { Player, Match, Matchup, Team } from '../types';

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