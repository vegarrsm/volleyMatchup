import { useState } from "react";
import { ChakraProvider, Container, defaultSystem } from "@chakra-ui/react";
import { SetupPage } from "./pages/SetupPage";
import { TournamentPage } from "./pages/TournamentPage";
import type { Matchup } from "./types";

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
    <ChakraProvider value={defaultSystem}>
      <Container maxW="xl" py={8}>
        {currentPage === "setup" ? (
          <SetupPage onSetupComplete={handleSetupComplete} />
        ) : (
          <TournamentPage
            matchups={matchups}
            onMatchupsChange={setMatchups}
            onBackToSetup={handleBackToSetup}
          />
        )}
      </Container>
    </ChakraProvider>
  );
}

export default App;

// TODO: Enkelt API. Bruk koder for å "joine" turnering. Admin kode og deltager kode for bare se eller edite
