import { Team } from "@/atoms/teamsAtom";
import useTeamData from "@/hooks/useTeamData";
import { Box, Button, Flex, Icon, Image, Text } from "@chakra-ui/react";
import React from "react";
import { FaReddit } from "react-icons/fa";

type HeaderProps = {
  teamData: Team;
};

const Header: React.FC<HeaderProps> = ({ teamData }) => {
  const { teamStateValue, onJoinOrLeaveTeam, loading } = useTeamData();

  const isJoined = !!teamStateValue.mySnippets.find(
    (item) => item.teamId === teamData.id
  );

  return (
    <Flex direction="column" width="100%" height="146px">
      <Box height="50%" bg="blue.400" />
      <Flex justify="center" bg="white" flexGrow={1}>
        <Flex width="95%" maxWidth="860px">
          {teamData.imageURL ? (
            <Image />
          ) : (
            <Icon
              as={FaReddit}
              fontSize={64}
              position="relative"
              top={-3}
              color="blue.500"
              border="4px solid white"
              borderRadius="full"
            />
          )}
          <Flex padding="10px 16px">
            <Flex direction="column" mr={6}>
              <Text fontWeight={800} fontSize="16pt">
                {teamData.id}
              </Text>
              <Text fontWeight={600} fontSize="10pt" color="gray.400">
                r/{teamData.id}
              </Text>
            </Flex>
            <Button
              variant={isJoined ? "outline" : "solid"}
              height="30px"
              pr={6}
              pl={6}
              isLoading={loading}
              onClick={() => onJoinOrLeaveTeam(teamData, isJoined)}
            >
              {isJoined ? "Joined" : "Join"}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
export default Header;
