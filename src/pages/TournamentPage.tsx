import { useState } from "react";
import { Box, VStack, Heading, Button, HStack } from "@chakra-ui/react";
import { ScoreTable } from "../components/ScoreTable";
import { ResultsTable } from "../components/ResultsTable";
import { MatchPage } from "./MatchPage";
import type { Matchup, Match } from "../types";

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
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);

  const handleStartMatch = (match: Match) => {
    setCurrentMatch(match);
  };

  const handleMatchUpdate = (updatedMatch: Match) => {
    // Update the match in the matchups
    const updatedMatchups = matchups.map((matchup) => ({
      ...matchup,
      matches: matchup.matches.map((m) =>
        m.id === updatedMatch.id ? updatedMatch : m
      ),
    }));
    onMatchupsChange(updatedMatchups);
    setCurrentMatch(updatedMatch);
  };

  const handleBackToTournament = () => {
    setCurrentMatch(null);
  };

  if (currentMatch) {
    return (
      <MatchPage
        match={currentMatch}
        onMatchUpdate={handleMatchUpdate}
        onBackToTournament={handleBackToTournament}
      />
    );
  }

  return (
    <Box>
      <VStack gap={8} align="stretch">
        <HStack
          justify="space-between"
          align="center"
          pb={6}
          borderBottom="2px"
          borderColor="gray.200"
        >
          <Heading size="xl">Tournament in Progress</Heading>
          <Button onClick={onBackToSetup} colorScheme="gray" size="md">
            ← Back to Setup
          </Button>
        </HStack>

        <ScoreTable
          matchups={matchups}
          onMatchupsChange={onMatchupsChange}
          onStartMatch={handleStartMatch}
        />
        <ResultsTable matchups={matchups} />
      </VStack>
    </Box>
  );
};
