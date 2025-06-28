import { useState } from "react";
import { PlayerManager } from "../components/PlayerManager";
import { ScoreTable } from "../components/ScoreTable";
import {
  generateMatchups,
  generateMatchupsByPlayerMatches,
} from "../utils/matchupUtils";
import type { Player, Matchup } from "../types";

type GenerationMethod = "per-matchup" | "per-player";

export const MatchupPage = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [generationMethod, setGenerationMethod] =
    useState<GenerationMethod>("per-matchup");
  const [matchesPerMatchup, setMatchesPerMatchup] = useState(1);
  const [matchesPerPlayer, setMatchesPerPlayer] = useState(4);
  const [matchups, setMatchups] = useState<Matchup[]>([]);

  const handleGenerateMatchups = () => {
    if (players.length < 4) {
      alert(
        "You need at least 4 players to generate beach volleyball matchups!"
      );
      return;
    }

    let newMatchups: Matchup[];

    if (generationMethod === "per-matchup") {
      newMatchups = generateMatchups(players, matchesPerMatchup);
    } else {
      newMatchups = generateMatchupsByPlayerMatches(players, matchesPerPlayer);
    }

    setMatchups(newMatchups);
  };

  return (
    <div className="matchup-page">
      <h1>Volleyball Matchup</h1>

      <PlayerManager players={players} onPlayersChange={setPlayers} />

      {players.length >= 4 && (
        <div className="matchup-controls">
          <div className="generation-method">
            <h3>Generation Method:</h3>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="generationMethod"
                  value="per-matchup"
                  checked={generationMethod === "per-matchup"}
                  onChange={(e) =>
                    setGenerationMethod(e.target.value as GenerationMethod)
                  }
                />
                Matches per team matchup
              </label>
              <label>
                <input
                  type="radio"
                  name="generationMethod"
                  value="per-player"
                  checked={generationMethod === "per-player"}
                  onChange={(e) =>
                    setGenerationMethod(e.target.value as GenerationMethod)
                  }
                />
                Matches per player
              </label>
            </div>
          </div>

          <div className="matches-input">
            {generationMethod === "per-matchup" ? (
              <>
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
              </>
            ) : (
              <>
                <label htmlFor="matches-per-player">Matches per player:</label>
                <input
                  id="matches-per-player"
                  type="number"
                  min="1"
                  max="20"
                  value={matchesPerPlayer}
                  onChange={(e) =>
                    setMatchesPerPlayer(parseInt(e.target.value) || 1)
                  }
                />
              </>
            )}
          </div>

          <button onClick={handleGenerateMatchups} className="generate-btn">
            Generate Matchups
          </button>
        </div>
      )}

      <ScoreTable matchups={matchups} onMatchupsChange={setMatchups} />
    </div>
  );
};
