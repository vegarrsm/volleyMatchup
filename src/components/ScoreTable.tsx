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
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match, index) => (
            <tr key={match.id} className={match.isCompleted ? "completed" : ""}>
              <td>{index + 1}</td>
              <td>{formatTeamName(match.team1)}</td>
              <td>
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
              <td>{formatTeamName(match.team2)}</td>
              <td>
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
              <td>
                {match.isCompleted ? (
                  <span className="status-completed">Completed</span>
                ) : (
                  <span className="status-pending">Pending</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
