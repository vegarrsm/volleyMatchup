import { ScoreTable } from "../components/ScoreTable";
import type { Matchup } from "../types";

interface TournamentPageProps {
  matchups: Matchup[];
  onMatchupsChange: (matchups: Matchup[]) => void;
  onBackToSetup: () => void;
}

export const TournamentPage = ({
  matchups,
  onMatchupsChange,
  onBackToSetup,
}: TournamentPageProps) => {
  return (
    <div className="tournament-page">
      <div className="tournament-header">
        <h1>Tournament in Progress</h1>
        <button onClick={onBackToSetup} className="back-btn">
          ← Back to Setup
        </button>
      </div>

      <ScoreTable matchups={matchups} onMatchupsChange={onMatchupsChange} />
    </div>
  );
};
