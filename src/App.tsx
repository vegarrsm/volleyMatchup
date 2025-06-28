import { useState } from "react";
import { SetupPage } from "./pages/SetupPage";
import { TournamentPage } from "./pages/TournamentPage";
import type { Matchup } from "./types";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState<"setup" | "tournament">(
    "setup"
  );
  const [matchups, setMatchups] = useState<Matchup[]>([]);

  const handleSetupComplete = (generatedMatchups: Matchup[]) => {
    setMatchups(generatedMatchups);
    setCurrentPage("tournament");
  };

  const handleBackToSetup = () => {
    setCurrentPage("setup");
  };

  return (
    <div className="app-container">
      {currentPage === "setup" ? (
        <SetupPage onSetupComplete={handleSetupComplete} />
      ) : (
        <TournamentPage
          matchups={matchups}
          onMatchupsChange={setMatchups}
          onBackToSetup={handleBackToSetup}
        />
      )}
    </div>
  );
}

export default App;
