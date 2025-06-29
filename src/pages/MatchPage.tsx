import { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Badge,
} from "@chakra-ui/react";
import type { Match, Team } from "../types";
import { PointGrid } from "../components/PointGrid";

interface PointEntry {
  id: string;
  teamId: string;
  teamName: string;
  points: number;
  timestamp: Date;
  setNumber: number;
}

interface SetScore {
  team1Sets: number;
  team2Sets: number;
}

interface MatchPageProps {
  match: Match;
  onMatchUpdate: (updatedMatch: Match) => void;
  onBackToTournament: () => void;
}

export const MatchPage = ({
  match,
  onMatchUpdate,
  onBackToTournament,
}: MatchPageProps) => {
  const [pointHistory, setPointHistory] = useState<PointEntry[]>([]);
  const [setScores, setSetScores] = useState<SetScore>({
    team1Sets: 0,
    team2Sets: 0,
  });
  const [currentSet, setCurrentSet] = useState(1);

  const addPoint = (teamId: string, teamName: string) => {
    const newPoint: PointEntry = {
      id: Date.now().toString(),
      teamId,
      teamName,
      points: 1,
      timestamp: new Date(),
      setNumber: currentSet,
    };

    const updatedHistory = [...pointHistory, newPoint];
    setPointHistory(updatedHistory);

    // Check if set is complete (first to 21 points)
    const setPoints = getPointsForSet(currentSet);
    const team1SetPoints = setPoints.filter(
      (p) => p.teamId === match.team1.id
    ).length;
    const team2SetPoints = setPoints.filter(
      (p) => p.teamId === match.team2.id
    ).length;

    if (team1SetPoints >= 21 || team2SetPoints >= 21) {
      // Set is complete, update set scores
      const newSetScores = {
        team1Sets: setScores.team1Sets + (team1SetPoints >= 21 ? 1 : 0),
        team2Sets: setScores.team2Sets + (team2SetPoints >= 21 ? 1 : 0),
      };
      setSetScores(newSetScores);
    }

    // Calculate current scores
    const team1Points = updatedHistory.filter(
      (p) => p.teamId === match.team1.id
    ).length;
    const team2Points = updatedHistory.filter(
      (p) => p.teamId === match.team2.id
    ).length;

    // Update match scores
    const updatedMatch: Match = {
      ...match,
      team1Score: team1Points,
      team2Score: team2Points,
      isCompleted: team1Points >= 21 || team2Points >= 21, // Beach volleyball typically to 21
    };

    onMatchUpdate(updatedMatch);
  };

  const addNewSet = () => {
    const newSetNumber = Math.max(...allSets) + 1;
    setCurrentSet(newSetNumber);
  };

  const undoLastPoint = () => {
    if (pointHistory.length === 0) return;

    const updatedHistory = pointHistory.slice(0, -1);
    setPointHistory(updatedHistory);

    // Recalculate scores
    const team1Points = updatedHistory.filter(
      (p) => p.teamId === match.team1.id
    ).length;
    const team2Points = updatedHistory.filter(
      (p) => p.teamId === match.team2.id
    ).length;

    const updatedMatch: Match = {
      ...match,
      team1Score: team1Points,
      team2Score: team2Points,
      isCompleted: team1Points >= 21 || team2Points >= 21,
    };

    onMatchUpdate(updatedMatch);
  };

  const formatTeamName = (team: Team) => {
    return `${team.player1.name} & ${team.player2.name}`;
  };

  const team1Points = pointHistory.filter(
    (p) => p.teamId === match.team1.id
  ).length;
  const team2Points = pointHistory.filter(
    (p) => p.teamId === match.team2.id
  ).length;

  // Get all set numbers
  const allSets = Array.from(
    new Set([1, ...pointHistory.map((p) => p.setNumber)])
  ).sort((a, b) => a - b);

  // Get points for a specific set
  const getPointsForSet = (setNumber: number) => {
    return pointHistory.filter((p) => p.setNumber === setNumber);
  };

  // Get set score for a specific set
  const getSetScore = (setNumber: number) => {
    const setPoints = getPointsForSet(setNumber);
    const team1SetPoints = setPoints.filter(
      (p) => p.teamId === match.team1.id
    ).length;
    const team2SetPoints = setPoints.filter(
      (p) => p.teamId === match.team2.id
    ).length;
    return { team1: team1SetPoints, team2: team2SetPoints };
  };

  // Check if a set is complete
  const isSetComplete = (setNumber: number) => {
    const setScore = getSetScore(setNumber);
    return setScore.team1 >= 21 || setScore.team2 >= 21;
  };

  // Get set winner
  const getSetWinner = (setNumber: number) => {
    const setScore = getSetScore(setNumber);
    if (setScore.team1 >= 21) return match.team1.id;
    if (setScore.team2 >= 21) return match.team2.id;
    return null;
  };

  return (
    <Box>
      <VStack gap={6} align="stretch">
        {/* Header */}
        <HStack
          justify="space-between"
          align="center"
          pb={4}
          borderBottom="2px"
          borderColor="gray.200"
        >
          <Heading size="lg">Match in Progress</Heading>
          <Button onClick={onBackToTournament} colorScheme="gray" size="md">
            ← Back to Tournament
          </Button>
        </HStack>

        {/* Teams and Current Score */}
        <Box
          bg="gray.50"
          p={6}
          borderRadius="lg"
          border="1px"
          borderColor="gray.200"
        >
          <VStack gap={4}>
            <Heading size="md" textAlign="center">
              Current Score
            </Heading>

            <HStack gap={8} justify="center">
              {/* Team 1 */}
              <VStack gap={3}>
                <Text fontWeight="bold" fontSize="lg" textAlign="center">
                  {formatTeamName(match.team1)}
                </Text>
                <Badge
                  colorScheme="blue"
                  variant="solid"
                  fontSize="2xl"
                  px={4}
                  py={2}
                >
                  {team1Points}
                </Badge>
                <Button
                  onClick={() =>
                    addPoint(match.team1.id, formatTeamName(match.team1))
                  }
                  colorScheme="green"
                  size="sm"
                >
                  +1 Point
                </Button>
                <Text fontSize="sm" color="gray.600">
                  Sets: {setScores.team1Sets}
                </Text>
              </VStack>

              {/* VS */}
              <VStack gap={3}>
                <Text fontWeight="bold" fontSize="xl" color="gray.500">
                  VS
                </Text>
                <Text fontSize="sm" color="gray.500">
                  to 21
                </Text>
              </VStack>

              {/* Team 2 */}
              <VStack gap={3}>
                <Text fontWeight="bold" fontSize="lg" textAlign="center">
                  {formatTeamName(match.team2)}
                </Text>
                <Badge
                  colorScheme="red"
                  variant="solid"
                  fontSize="2xl"
                  px={4}
                  py={2}
                >
                  {team2Points}
                </Badge>
                <Button
                  onClick={() =>
                    addPoint(match.team2.id, formatTeamName(match.team2))
                  }
                  colorScheme="green"
                  size="sm"
                >
                  +1 Point
                </Button>
                <Text fontSize="sm" color="gray.600">
                  Sets: {setScores.team2Sets}
                </Text>
              </VStack>
            </HStack>

            {/* Undo Button */}
            <Button
              onClick={undoLastPoint}
              disabled={pointHistory.length === 0}
              colorScheme="gray"
              size="sm"
              mt={4}
            >
              Undo Last Point
            </Button>
          </VStack>
        </Box>

        {/* Visual Point History with Sets */}
        <Box
          bg="gray.50"
          p={6}
          borderRadius="lg"
          border="1px"
          borderColor="gray.200"
        >
          <VStack gap={4} align="stretch">
            <Heading size="md">Point History by Sets</Heading>

            {pointHistory.length === 0 ? (
              <Text textAlign="center" color="gray.500">
                No points scored yet. Start the match!
              </Text>
            ) : (
              <Box>
                {/* Custom Tab Navigation with New Set Button */}
                <HStack gap={2} mb={4} overflowX="auto" pb={2}>
                  {allSets.map((setNumber) => {
                    const setScore = getSetScore(setNumber);
                    const isComplete = isSetComplete(setNumber);
                    const winner = getSetWinner(setNumber);

                    return (
                      <Button
                        key={setNumber}
                        onClick={() => setCurrentSet(setNumber)}
                        colorScheme={currentSet === setNumber ? "blue" : "gray"}
                        variant={currentSet === setNumber ? "solid" : "outline"}
                        size="sm"
                        minW="120px"
                      >
                        Set {setNumber} ({setScore.team1}-{setScore.team2})
                        {isComplete && (
                          <Badge
                            ml={2}
                            colorScheme={
                              winner === match.team1.id ? "blue" : "red"
                            }
                            size="sm"
                          >
                            {winner === match.team1.id ? "W" : "L"}
                          </Badge>
                        )}
                      </Button>
                    );
                  })}
                  <Button
                    onClick={addNewSet}
                    colorScheme="green"
                    variant="outline"
                    size="sm"
                    minW="100px"
                  >
                    + New Set
                  </Button>
                </HStack>

                {/* Current Set Content */}
                <Box>
                  <PointGrid
                    points={getPointsForSet(currentSet)}
                    team1={match.team1}
                    team2={match.team2}
                    formatTeamName={formatTeamName}
                  />
                </Box>
              </Box>
            )}

            {/* Overall Summary */}
            {pointHistory.length > 0 && (
              <Box pt={4} borderTop="1px" borderColor="gray.200">
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Total points: {getPointsForSet(currentSet).length}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Overall:{" "}
                    {
                      getPointsForSet(currentSet).filter(
                        (p) => p.teamId === match.team1.id
                      ).length
                    }{" "}
                    -{" "}
                    {
                      getPointsForSet(currentSet).filter(
                        (p) => p.teamId === match.team2.id
                      ).length
                    }
                  </Text>
                </HStack>
              </Box>
            )}
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};
