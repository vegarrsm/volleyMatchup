import { useState } from "react";
import { PlayerManager } from "../components/PlayerManager";
import { ScoreTable } from "../components/ScoreTable";
import { generateMatchups } from "../utils/matchupUtils";
import type { Player, Matchup } from "../types";

export const MatchupPage = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [matchesPerMatchup, setMatchesPerMatchup] = useState(1);
  const [matchups, setMatchups] = useState<Matchup[]>([]);

  const handleGenerateMatchups = () => {
    if (players.length < 4) {
      alert(
        "You need at least 4 players to generate beach volleyball matchups!"
      );
      return;
    }

    const newMatchups = generateMatchups(players, matchesPerMatchup);
    setMatchups(newMatchups);
  };

  return (
    <div className="matchup-page">
      <h1>Volleyball Matchup</h1>

      <PlayerManager players={players} onPlayersChange={setPlayers} />

      {players.length >= 4 && (
        <div className="matchup-controls">
          <div className="matches-input">
            <label htmlFor="matches-per-matchup">
              Matches per team matchup:
            </label>
            <input
              id="matches-per-matchup"
              type="number"
              min="1"
              max="10"
              value={matchesPerMatchup}
              onChange={(e) =>
                setMatchesPerMatchup(parseInt(e.target.value) || 1)
              }
            />
          </div>
          <button onClick={handleGenerateMatchups} className="generate-btn">
            Generate All Matchups
          </button>
        </div>
      )}

      <ScoreTable matchups={matchups} onMatchupsChange={setMatchups} />
    </div>
  );
};
