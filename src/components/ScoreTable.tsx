import type { Matchup } from "../types";

interface ScoreTableProps {
  matchups: Matchup[];
  onMatchupsChange: (matchups: Matchup[]) => void;
}

export const ScoreTable = ({ matchups, onMatchupsChange }: ScoreTableProps) => {
  const updateMatchScore = (
    matchupId: string,
    matchId: string,
    team1Score: number,
    team2Score: number
  ) => {
    onMatchupsChange(
      matchups.map((matchup) => {
        if (matchup.id === matchupId) {
          return {
            ...matchup,
            matches: matchup.matches.map((match) => {
              if (match.id === matchId) {
                return {
                  ...match,
                  team1Score,
                  team2Score,
                  isCompleted: team1Score > 0 || team2Score > 0,
                };
              }
              return match;
            }),
          };
        }
        return matchup;
      })
    );
  };

  const getAllMatches = () => {
    return matchups.flatMap((matchup) => matchup.matches);
  };

  const formatTeamName = (team: {
    player1: { name: string };
    player2: { name: string };
  }) => {
    return `${team.player1.name} & ${team.player2.name}`;
  };

  const getTeamStyle = (teamScore: number, opponentScore: number) => {
    if (teamScore === 0 && opponentScore === 0) {
      return {}; // No background for matches with no scores
    }
    if (teamScore > opponentScore) {
      return { backgroundColor: "#d4edda" }; // Light green for winning team
    } else if (teamScore < opponentScore) {
      return { backgroundColor: "#f8d7da" }; // Light red for losing team
    } else {
      return { backgroundColor: "#fff3cd" }; // Light yellow for tie
    }
  };

  const matches = getAllMatches();

  if (matches.length === 0) {
    return null;
  }

  return (
    <div className="score-table">
      <h2>Matches ({matches.length} total)</h2>
      <table className="matches-table">
        <thead>
          <tr>
            <th>Match #</th>
            <th>Team 1</th>
            <th>Score</th>
            <th>Team 2</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match, index) => (
            <tr key={match.id}>
              <td>{index + 1}</td>
              <td style={getTeamStyle(match.team1Score, match.team2Score)}>
                {formatTeamName(match.team1)}
              </td>
              <td style={getTeamStyle(match.team1Score, match.team2Score)}>
                <input
                  type="number"
                  min="0"
                  max="25"
                  value={match.team1Score}
                  onChange={(e) => {
                    const score = parseInt(e.target.value) || 0;
                    updateMatchScore(
                      matchups.find((m) => m.matches.includes(match))!.id,
                      match.id,
                      score,
                      match.team2Score
                    );
                  }}
                  className="score-input"
                />
              </td>
              <td style={getTeamStyle(match.team2Score, match.team1Score)}>
                {formatTeamName(match.team2)}
              </td>
              <td style={getTeamStyle(match.team2Score, match.team1Score)}>
                <input
                  type="number"
                  min="0"
                  max="25"
                  value={match.team2Score}
                  onChange={(e) => {
                    const score = parseInt(e.target.value) || 0;
                    updateMatchScore(
                      matchups.find((m) => m.matches.includes(match))!.id,
                      match.id,
                      match.team1Score,
                      score
                    );
                  }}
                  className="score-input"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
