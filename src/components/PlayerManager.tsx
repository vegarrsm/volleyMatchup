import { useState } from "react";
import type { Player } from "../types";

interface PlayerManagerProps {
  players: Player[];
  onPlayersChange: (players: Player[]) => void;
}

export const PlayerManager = ({
  players,
  onPlayersChange,
}: PlayerManagerProps) => {
  const [playerName, setPlayerName] = useState("");

  const handleAddPlayer = () => {
    const trimmedName = playerName.trim();
    if (trimmedName && !players.some((player) => player.name === trimmedName)) {
      const newPlayer: Player = {
        id: Date.now().toString(),
        name: trimmedName,
      };
      onPlayersChange([...players, newPlayer]);
      setPlayerName("");
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddPlayer();
    }
  };

  return (
    <div className="player-manager">
      <h2>Player Management</h2>
      <div className="add-player-form">
        <input
          type="text"
          placeholder="Enter player name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          onKeyDown={handleInputKeyDown}
        />
        <button onClick={handleAddPlayer} disabled={!playerName.trim()}>
          Add Player
        </button>
      </div>

      <div className="player-list-section">
        <h3>Players ({players.length})</h3>
        <ul className="player-list">
          {players.map((player) => (
            <li key={player.id}>{player.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
