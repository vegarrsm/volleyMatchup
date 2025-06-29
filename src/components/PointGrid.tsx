import { Box, VStack, HStack, Text } from "@chakra-ui/react";
import type { Team } from "../types";

interface PointEntry {
  id: string;
  teamId: string;
  teamName: string;
  points: number;
  timestamp: Date;
  setNumber: number;
}

interface PointGridProps {
  points: PointEntry[];
  team1: Team;
  team2: Team;
  formatTeamName: (team: Team) => string;
}

export const PointGrid = ({
  points,
  team1,
  team2,
  formatTeamName,
}: PointGridProps) => {
  return (
    <VStack gap={4} align="stretch">
      {/* Team Names Header */}
      <HStack justify="space-between" mb={4}>
        <Text fontWeight="bold" color="blue.600" fontSize="lg">
          {formatTeamName(team1)}
        </Text>
        <Text fontWeight="bold" color="red.600" fontSize="lg">
          {formatTeamName(team2)}
        </Text>
      </HStack>

      {/* Visual Timeline */}
      <Box
        border="2px"
        borderColor="gray.300"
        borderRadius="md"
        p={4}
        bg="white"
        w="50%"
        mx="auto"
      >
        {/* Single Stack for All Points */}
        <VStack gap={0} align="stretch">
          {points.map((point, index) => (
            <Box
              key={point.id}
              display="flex"
              justifyContent={
                point.teamId === team1.id ? "flex-start" : "flex-end"
              }
              alignItems="center"
              h="7"
            >
              <Box
                bg={point.teamId === team1.id ? "blue.500" : "red.500"}
                color="white"
                px={4}
                py={0.5}
                borderRadius="full"
                fontSize="sm"
                fontWeight="bold"
                textAlign="center"
                minW="60px"
              >
                {index + 1}
              </Box>
            </Box>
          ))}
        </VStack>
      </Box>

      {/* Set Summary */}
      <HStack justify="space-between" mt={4}>
        <Text fontSize="sm" color="gray.600">
          Set points: {points.length}
        </Text>
        <Text fontSize="sm" color="gray.600">
          {points.filter((p) => p.teamId === team1.id).length} -{" "}
          {points.filter((p) => p.teamId === team2.id).length}
        </Text>
      </HStack>
    </VStack>
  );
};
