import {
  Box,
  VStack,
  Heading,
  Text,
  Grid,
  GridItem,
  Badge,
} from "@chakra-ui/react";
import type { Matchup } from "../types";

interface TeamStats {
  teamId: string;
  player1: string;
  player2: string;
  wins: number;
  losses: number;
  matchesPlayed: number;
}

interface ResultsTableProps {
  matchups: Matchup[];
}

export const ResultsTable = ({ matchups }: ResultsTableProps) => {
  const calculateTeamStats = (): TeamStats[] => {
    const teamStatsMap = new Map<string, TeamStats>();

    // Initialize all teams
    matchups.forEach((matchup) => {
      const team1Id = matchup.team1.id;
      const team2Id = matchup.team2.id;

      if (!teamStatsMap.has(team1Id)) {
        teamStatsMap.set(team1Id, {
          teamId: team1Id,
          player1: matchup.team1.player1.name,
          player2: matchup.team1.player2.name,
          wins: 0,
          losses: 0,
          matchesPlayed: 0,
        });
      }

      if (!teamStatsMap.has(team2Id)) {
        teamStatsMap.set(team2Id, {
          teamId: team2Id,
          player1: matchup.team2.player1.name,
          player2: matchup.team2.player2.name,
          wins: 0,
          losses: 0,
          matchesPlayed: 0,
        });
      }
    });

    // Calculate stats from completed matches
    matchups.forEach((matchup) => {
      matchup.matches.forEach((match) => {
        if (match.isCompleted) {
          const team1Stats = teamStatsMap.get(matchup.team1.id)!;
          const team2Stats = teamStatsMap.get(matchup.team2.id)!;

          team1Stats.matchesPlayed++;
          team2Stats.matchesPlayed++;

          if (match.team1Score > match.team2Score) {
            team1Stats.wins++;
            team2Stats.losses++;
          } else if (match.team2Score > match.team1Score) {
            team2Stats.wins++;
            team1Stats.losses++;
          }
          // If scores are equal, it's a tie (no wins/losses added)
        }
      });
    });

    // Convert to array and sort by wins (descending), then by losses (ascending)
    return Array.from(teamStatsMap.values()).sort((a, b) => {
      if (b.wins !== a.wins) {
        return b.wins - a.wins;
      }
      return a.losses - b.losses;
    });
  };

  const teamStats = calculateTeamStats();
  const totalMatches = matchups
    .flatMap((m) => m.matches)
    .filter((m) => m.isCompleted).length;

  if (totalMatches === 0) {
    return (
      <Box
        bg="gray.50"
        p={6}
        borderRadius="lg"
        border="1px"
        borderColor="gray.200"
      >
        <Text textAlign="center" color="gray.500">
          No matches completed yet. Start scoring matches to see results!
        </Text>
      </Box>
    );
  }

  return (
    <Box
      bg="gray.50"
      p={6}
      borderRadius="lg"
      border="1px"
      borderColor="gray.200"
    >
      <VStack gap={4} align="stretch">
        <Heading size="md">Current Results</Heading>

        <Box overflowX="auto">
          <Box
            border="1px"
            borderColor="gray.200"
            borderRadius="md"
            overflow="hidden"
          >
            {/* Header */}
            <Grid templateColumns="1fr 2fr 1fr 1fr 1fr" bg="gray.100">
              <GridItem p={3} borderRight="1px" borderColor="gray.200">
                <Text fontWeight="bold" fontSize="sm">
                  Rank
                </Text>
              </GridItem>
              <GridItem p={3} borderRight="1px" borderColor="gray.200">
                <Text fontWeight="bold" fontSize="sm">
                  Team
                </Text>
              </GridItem>
              <GridItem
                p={3}
                borderRight="1px"
                borderColor="gray.200"
                textAlign="center"
              >
                <Text fontWeight="bold" fontSize="sm">
                  W
                </Text>
              </GridItem>
              <GridItem
                p={3}
                borderRight="1px"
                borderColor="gray.200"
                textAlign="center"
              >
                <Text fontWeight="bold" fontSize="sm">
                  L
                </Text>
              </GridItem>
              <GridItem p={3} textAlign="center">
                <Text fontWeight="bold" fontSize="sm">
                  MP
                </Text>
              </GridItem>
            </Grid>

            {/* Rows */}
            {teamStats.map((team, index) => (
              <Grid
                key={team.teamId}
                templateColumns="1fr 2fr 1fr 1fr 1fr"
                borderTop="1px"
                borderColor="gray.200"
                _hover={{ bg: "gray.50" }}
              >
                <GridItem p={3} borderRight="1px" borderColor="gray.200">
                  <Text fontWeight="bold" fontSize="sm">
                    {index + 1}
                    {index === 0 && team.matchesPlayed > 0 && (
                      <Badge ml={2} colorScheme="gold" size="sm">
                        🥇
                      </Badge>
                    )}
                  </Text>
                </GridItem>
                <GridItem p={3} borderRight="1px" borderColor="gray.200">
                  <Text fontWeight="medium" fontSize="sm">
                    {team.player1} & {team.player2}
                  </Text>
                </GridItem>
                <GridItem
                  p={3}
                  borderRight="1px"
                  borderColor="gray.200"
                  textAlign="center"
                >
                  <Badge colorScheme="green" variant="subtle">
                    {team.wins}
                  </Badge>
                </GridItem>
                <GridItem
                  p={3}
                  borderRight="1px"
                  borderColor="gray.200"
                  textAlign="center"
                >
                  <Badge colorScheme="red" variant="subtle">
                    {team.losses}
                  </Badge>
                </GridItem>
                <GridItem p={3} textAlign="center">
                  <Text fontSize="sm" fontWeight="medium">
                    {team.matchesPlayed}
                  </Text>
                </GridItem>
              </Grid>
            ))}
          </Box>
        </Box>

        <Text fontSize="sm" color="gray.600" textAlign="center">
          {totalMatches} match{totalMatches !== 1 ? "es" : ""} completed
        </Text>
      </VStack>
    </Box>
  );
};
