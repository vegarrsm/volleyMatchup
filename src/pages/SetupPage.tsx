import { useState } from "react";
import { PlayerManager } from "../components/PlayerManager";
import {
  generateMatchups,
  generateMatchupsByPlayerMatches,
} from "../utils/matchupUtils";
import type { Player, Matchup } from "../types";

type GenerationMethod = "per-matchup" | "per-player";

interface SetupPageProps {
  onSetupComplete: (matchups: Matchup[]) => void;
}

export const SetupPage = ({ onSetupComplete }: SetupPageProps) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [generationMethod, setGenerationMethod] =
    useState<GenerationMethod>("per-matchup");
  const [matchesPerMatchup, setMatchesPerMatchup] = useState(1);
  const [matchesPerPlayer, setMatchesPerPlayer] = useState(4);
  const [previewMatchups, setPreviewMatchups] = useState<Matchup[]>([]);

  const handleGeneratePreview = () => {
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

    setPreviewMatchups(newMatchups);
  };

  const handleStartTournament = () => {
    if (previewMatchups.length === 0) {
      alert("Please generate matchups first!");
      return;
    }
    onSetupComplete(previewMatchups);
  };

  const getAllMatches = () => {
    return previewMatchups.flatMap((matchup) => matchup.matches);
  };

  const formatTeamName = (team: {
    player1: { name: string };
    player2: { name: string };
  }) => {
    return `${team.player1.name} & ${team.player2.name}`;
  };

  return (
    <div className="setup-page">
      <h1>Tournament Setup</h1>

      <div className="setup-sections">
        <section className="player-section">
          <PlayerManager players={players} onPlayersChange={setPlayers} />
        </section>

        {players.length >= 4 && (
          <section className="generation-section">
            <h2>Match Generation</h2>

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
                  <label htmlFor="matches-per-player">
                    Matches per player:
                  </label>
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

            <button onClick={handleGeneratePreview} className="generate-btn">
              Generate Preview
            </button>
          </section>
        )}

        {previewMatchups.length > 0 && (
          <section className="preview-section">
            <h2>Match Preview ({getAllMatches().length} total matches)</h2>
            <div className="preview-table">
              <table className="matches-table">
                <thead>
                  <tr>
                    <th>Match #</th>
                    <th>Team 1</th>
                    <th>vs</th>
                    <th>Team 2</th>
                  </tr>
                </thead>
                <tbody>
                  {getAllMatches().map((match, index) => (
                    <tr key={match.id}>
                      <td>{index + 1}</td>
                      <td>{formatTeamName(match.team1)}</td>
                      <td>vs</td>
                      <td>{formatTeamName(match.team2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="start-tournament">
              <button onClick={handleStartTournament} className="start-btn">
                Start Tournament
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
