import {
  Box,
  Input,
  Text,
  VStack,
  Heading,
  Grid,
  GridItem,
  Button,
} from "@chakra-ui/react";
import type { Matchup, Match } from "../types";

interface ScoreTableProps {
  matchups: Matchup[];
  onMatchupsChange: (matchups: Matchup[]) => void;
  onStartMatch?: (match: Match) => void;
}

export const ScoreTable = ({
  matchups,
  onMatchupsChange,
  onStartMatch,
}: ScoreTableProps) => {
  const updateMatchScore = (
    matchupId: string,
    matchId: string,
    team1Score: number,
    team2Score: number
  ) => {
    onMatchupsChange(
      matchups.map((matchup) => {
        if (matchup.id === matchupId) {
          return {
            ...matchup,
            matches: matchup.matches.map((match) => {
              if (match.id === matchId) {
                return {
                  ...match,
                  team1Score,
                  team2Score,
                  isCompleted: team1Score > 0 || team2Score > 0,
                };
              }
              return match;
            }),
          };
        }
        return matchup;
      })
    );
  };

  const getAllMatches = () => {
    return matchups.flatMap((matchup) => matchup.matches);
  };

  const formatTeamName = (team: {
    player1: { name: string };
    player2: { name: string };
  }) => {
    return `${team.player1.name} & ${team.player2.name}`;
  };

  const getTeamBgColor = (teamScore: number, opponentScore: number) => {
    if (teamScore === 0 && opponentScore === 0) {
      return "transparent";
    }
    if (teamScore > opponentScore) {
      return "green.50";
    } else if (teamScore < opponentScore) {
      return "red.50";
    } else {
      return "yellow.50";
    }
  };

  const matches = getAllMatches();

  if (matches.length === 0) {
    return null;
  }

  return (
    <Box>
      <VStack gap={6} align="stretch">
        <Heading size="lg">Matches ({matches.length} total)</Heading>

        <Box overflowX="auto">
          <Box
            border="1px"
            borderColor="gray.200"
            borderRadius="md"
            overflow="hidden"
          >
            {/* Header */}
            <Grid templateColumns="1fr 2fr 1fr 2fr 1fr 1fr" bg="gray.50">
              <GridItem p={3} borderRight="1px" borderColor="gray.200">
                <Text fontWeight="bold">Match #</Text>
              </GridItem>
              <GridItem p={3} borderRight="1px" borderColor="gray.200">
                <Text fontWeight="bold">Team 1</Text>
              </GridItem>
              <GridItem p={3} borderRight="1px" borderColor="gray.200">
                <Text fontWeight="bold">Score</Text>
              </GridItem>
              <GridItem p={3} borderRight="1px" borderColor="gray.200">
                <Text fontWeight="bold">Team 2</Text>
              </GridItem>
              <GridItem p={3} borderRight="1px" borderColor="gray.200">
                <Text fontWeight="bold">Score</Text>
              </GridItem>
              <GridItem p={3}>
                <Text fontWeight="bold">Action</Text>
              </GridItem>
            </Grid>

            {/* Rows */}
            {matches.map((match, index) => (
              <Grid
                key={match.id}
                templateColumns="1fr 2fr 1fr 2fr 1fr 1fr"
                borderTop="1px"
                borderColor="gray.200"
                _hover={{ bg: "gray.50" }}
              >
                <GridItem p={3} borderRight="1px" borderColor="gray.200">
                  <Text fontWeight="medium">{index + 1}</Text>
                </GridItem>
                <GridItem
                  p={3}
                  borderRight="1px"
                  borderColor="gray.200"
                  bg={getTeamBgColor(match.team1Score, match.team2Score)}
                >
                  <Text fontWeight="medium">{formatTeamName(match.team1)}</Text>
                </GridItem>
                <GridItem
                  p={3}
                  borderRight="1px"
                  borderColor="gray.200"
                  bg={getTeamBgColor(match.team1Score, match.team2Score)}
                >
                  <Input
                    type="number"
                    min={0}
                    max={25}
                    value={match.team1Score}
                    onChange={(e) => {
                      const score = parseInt(e.target.value) || 0;
                      updateMatchScore(
                        matchups.find((m) => m.matches.includes(match))!.id,
                        match.id,
                        score,
                        match.team2Score
                      );
                    }}
                    size="sm"
                    width="70px"
                    textAlign="center"
                  />
                </GridItem>
                <GridItem
                  p={3}
                  borderRight="1px"
                  borderColor="gray.200"
                  bg={getTeamBgColor(match.team2Score, match.team1Score)}
                >
                  <Text fontWeight="medium">{formatTeamName(match.team2)}</Text>
                </GridItem>
                <GridItem
                  p={3}
                  borderRight="1px"
                  borderColor="gray.200"
                  bg={getTeamBgColor(match.team2Score, match.team1Score)}
                >
                  <Input
                    type="number"
                    min={0}
                    max={25}
                    value={match.team2Score}
                    onChange={(e) => {
                      const score = parseInt(e.target.value) || 0;
                      updateMatchScore(
                        matchups.find((m) => m.matches.includes(match))!.id,
                        match.id,
                        match.team1Score,
                        score
                      );
                    }}
                    size="sm"
                    width="70px"
                    textAlign="center"
                  />
                </GridItem>
                <GridItem p={3}>
                  <Button
                    onClick={() => onStartMatch?.(match)}
                    colorScheme="blue"
                    size="sm"
                    width="100%"
                  >
                    Start Match
                  </Button>
                </GridItem>
              </Grid>
            ))}
          </Box>
        </Box>
      </VStack>
    </Box>
  );
};
