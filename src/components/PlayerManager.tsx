import { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  SimpleGrid,
  Badge,
  Heading,
} from "@chakra-ui/react";
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
    <Box>
      <Heading size="md" mb={4}>
        Player Management
      </Heading>

      <VStack gap={4} align="stretch">
        <HStack>
          <Input
            placeholder="Enter player name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyDown={handleInputKeyDown}
            size="md"
          />
          <Button
            onClick={handleAddPlayer}
            disabled={!playerName.trim()}
            colorScheme="green"
            size="md"
          >
            Add Player
          </Button>
        </HStack>

        <Box>
          <Text fontSize="lg" fontWeight="medium" mb={3}>
            Players ({players.length})
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={3}>
            {players.map((player) => (
              <Badge
                key={player.id}
                colorScheme="blue"
                variant="subtle"
                p={3}
                textAlign="center"
                fontSize="md"
              >
                {player.name}
              </Badge>
            ))}
          </SimpleGrid>
        </Box>
      </VStack>
    </Box>
  );
};
