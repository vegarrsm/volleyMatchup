import { useState } from "react";
import {
  Box,
  VStack,
  Heading,
  Text,
  Input,
  Button,
  Grid,
  GridItem,
  HStack,
} from "@chakra-ui/react";
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
    <Box>
      <VStack gap={8} align="stretch">
        <Heading size="xl" textAlign="center">
          Tournament Setup
        </Heading>

        {/* Player Management Section */}
        <Box
          bg="gray.50"
          p={6}
          borderRadius="lg"
          border="1px"
          borderColor="gray.200"
        >
          <PlayerManager players={players} onPlayersChange={setPlayers} />
        </Box>

        {/* Match Generation Section */}
        <Box
          bg="gray.50"
          p={6}
          borderRadius="lg"
          border="1px"
          borderColor="gray.200"
        >
          <VStack gap={6} align="stretch">
            <Heading size="md">Match Generation</Heading>

            <Box>
              <Text fontWeight="medium" mb={3}>
                Generation Method:
              </Text>
              <VStack gap={3} align="start">
                <HStack>
                  <input
                    type="radio"
                    name="generationMethod"
                    value="per-matchup"
                    checked={generationMethod === "per-matchup"}
                    onChange={(e) =>
                      setGenerationMethod(e.target.value as GenerationMethod)
                    }
                  />
                  <Text>Matches per team matchup</Text>
                </HStack>
                <HStack>
                  <input
                    type="radio"
                    name="generationMethod"
                    value="per-player"
                    checked={generationMethod === "per-player"}
                    onChange={(e) =>
                      setGenerationMethod(e.target.value as GenerationMethod)
                    }
                  />
                  <Text>Matches per player</Text>
                </HStack>
              </VStack>
            </Box>

            <Box>
              <Text fontWeight="medium" mb={2}>
                {generationMethod === "per-matchup"
                  ? "Matches per team matchup:"
                  : "Matches per player:"}
              </Text>
              <Input
                type="number"
                min={1}
                max={generationMethod === "per-matchup" ? 10 : 20}
                value={
                  generationMethod === "per-matchup"
                    ? matchesPerMatchup
                    : matchesPerPlayer
                }
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 1;
                  if (generationMethod === "per-matchup") {
                    setMatchesPerMatchup(value);
                  } else {
                    setMatchesPerPlayer(value);
                  }
                }}
                width="200px"
              />
            </Box>

            <Button
              onClick={handleGeneratePreview}
              disabled={players.length < 4}
              colorScheme="blue"
              size="lg"
              title={
                players.length < 4
                  ? "At least 4 players are needed to generate matches"
                  : ""
              }
            >
              Generate Preview
            </Button>
          </VStack>
        </Box>

        {/* Preview Section */}
        {previewMatchups.length > 0 && (
          <Box
            bg="gray.50"
            p={6}
            borderRadius="lg"
            border="1px"
            borderColor="gray.200"
          >
            <VStack gap={6} align="stretch">
              <Heading size="md">
                Match Preview ({getAllMatches().length} total matches)
              </Heading>

              <Box overflowX="auto">
                <Box
                  border="1px"
                  borderColor="gray.200"
                  borderRadius="md"
                  overflow="hidden"
                >
                  {/* Header */}
                  <Grid templateColumns="1fr 2fr 1fr 2fr" bg="gray.100">
                    <GridItem p={3} borderRight="1px" borderColor="gray.200">
                      <Text fontWeight="bold">Match #</Text>
                    </GridItem>
                    <GridItem p={3} borderRight="1px" borderColor="gray.200">
                      <Text fontWeight="bold">Team 1</Text>
                    </GridItem>
                    <GridItem p={3} borderRight="1px" borderColor="gray.200">
                      <Text fontWeight="bold">vs</Text>
                    </GridItem>
                    <GridItem p={3}>
                      <Text fontWeight="bold">Team 2</Text>
                    </GridItem>
                  </Grid>

                  {/* Rows */}
                  {getAllMatches().map((match, index) => (
                    <Grid
                      key={match.id}
                      templateColumns="1fr 2fr 1fr 2fr"
                      borderTop="1px"
                      borderColor="gray.200"
                      _hover={{ bg: "gray.50" }}
                    >
                      <GridItem p={3} borderRight="1px" borderColor="gray.200">
                        <Text fontWeight="medium">{index + 1}</Text>
                      </GridItem>
                      <GridItem p={3} borderRight="1px" borderColor="gray.200">
                        <Text>{formatTeamName(match.team1)}</Text>
                      </GridItem>
                      <GridItem
                        p={3}
                        borderRight="1px"
                        borderColor="gray.200"
                        textAlign="center"
                      >
                        <Text fontWeight="bold">vs</Text>
                      </GridItem>
                      <GridItem p={3}>
                        <Text>{formatTeamName(match.team2)}</Text>
                      </GridItem>
                    </Grid>
                  ))}
                </Box>
              </Box>

              <Box textAlign="center">
                <Button
                  onClick={handleStartTournament}
                  colorScheme="green"
                  size="lg"
                >
                  Start Tournament
                </Button>
              </Box>
            </VStack>
          </Box>
        )}

        {/* Warning for insufficient players */}
        {players.length > 0 && players.length < 4 && (
          <Box
            bg="orange.50"
            p={4}
            borderRadius="md"
            border="1px"
            borderColor="orange.200"
          >
            <Text color="orange.800">
              ⚠️ You need at least 4 players to generate beach volleyball
              matchups.
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

// TODO: Predefined teams
