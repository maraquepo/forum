import { auth, firestore } from "@/firebase/clientApp";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BsFillEyeFill, BsFillPersonFill } from "react-icons/bs";
import { HiLockClosed } from "react-icons/hi";

type CreateTeamModalProps = {
  open: boolean;
  handleClose: () => void;
};

const CreateTeamModal: React.FC<CreateTeamModalProps> = ({
  open,
  handleClose,
}) => {
  const [user] = useAuthState(auth);
  const [teamName, setTeamName] = useState("");
  const [charsRemaining, setCharsRemaining] = useState(21);
  const [teamType, setTeamType] = useState("public");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 21) return;
    setTeamName(e.target.value);
    setCharsRemaining(21 - e.target.value.length);
  };

  const onTeamTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeamType(e.target.name);
  };

  const handleCreateTeam = async () => {
    // validate the team
    const format = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (format.test(teamName) || teamName.length < 3) {
      setError(
        "Team names must be between 3-21 characters, and can only contain letters, numbers, or underscores"
      );
      return;
    }

    setLoading(true);

    try {
      const teamDocRef = doc(firestore, "teams", teamName);

      await runTransaction(firestore, async (transaction) => {
        // Check if team exists in db
        const teamDoc = await transaction.get(teamDocRef);

        if (teamDoc.exists()) {
          throw new Error(`Sorry, ${teamName} is taken. Try another. `);
        }
        transaction.set(teamDocRef, {
          creatorId: user?.uid,
          createdAt: serverTimestamp(),
          numberOfMembers: 1,
          privacyType: teamType,
        });

        transaction.set(
          doc(firestore, `users/${user?.uid}/teamSnippets`, teamName),
          {
            teamId: teamName,
            isManager: true,
          }
        );
      });
    } catch (err: any) {
      console.error("handleCreateTeam error", err);
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <>
      <Modal isOpen={open} onClose={handleClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            flexDirection="column"
            fontSize={15}
            padding={3}
          >
            Create a team
          </ModalHeader>
          <Box pl={3} pr={3}>
            <Divider />
            <ModalCloseButton />
            <ModalBody display="flex" flexDirection="column" padding="10px 0px">
              <Text fontWeight={600} fontSize={15}>
                Name
              </Text>
              <Text fontSize={11} color="gray.500">
                Team names including capitalization cannot be changed
              </Text>
              <Text
                position="relative"
                top="28px"
                left="10px"
                width="20px"
                color="gray.400"
              >
                r/
              </Text>
              <Input
                position="relative"
                value={teamName}
                size="sm"
                pl="22px"
                onChange={handleChange}
              />
              <Text color={charsRemaining === 0 ? "red" : "gray.500"}>
                {charsRemaining} Characters Remaining
              </Text>
              <Text fontSize="9pt" color="red" pt={1}>
                {error}
              </Text>
              <Box mt={4} mb={4}>
                <Text fontWeight={600} fontSize={15}>
                  Team Type
                </Text>
                <Stack spacing={2}>
                  <Checkbox
                    name="public"
                    isChecked={teamType === "public"}
                    onChange={onTeamTypeChange}
                  >
                    <Flex align="center">
                      <Icon as={BsFillPersonFill} color="gray.500" mr={2} />
                      <Text fontSize="10pt" mr={1}>
                        Public
                      </Text>
                      {/* TODO */}
                      <Text fontSize="8pt" color="gray.500" pt={1}>
                        Anyone can view, post, and comment to this team
                      </Text>
                    </Flex>
                  </Checkbox>
                  <Checkbox
                    name="restricted"
                    isChecked={teamType === "restricted"}
                    onChange={onTeamTypeChange}
                  >
                    <Flex align="center">
                      <Icon as={BsFillEyeFill} color="gray.500" mr={2} />

                      <Text fontSize="10pt" mr={1}>
                        Restricted
                      </Text>
                      {/* TODO */}
                      <Text fontSize="8pt" color="gray.500" pt={1}>
                        Anyone can view this team, but only approved users can
                        post
                      </Text>
                    </Flex>
                  </Checkbox>
                  <Checkbox
                    name="private"
                    isChecked={teamType === "private"}
                    onChange={onTeamTypeChange}
                  >
                    <Flex align="center">
                      <Icon as={HiLockClosed} color="gray.500" mr={2} />
                      <Text fontSize="10pt" mr={1}>
                        Private
                      </Text>
                      {/* TODO */}
                      <Text fontSize="8pt" color="gray.500" pt={1}>
                        Only approved users can view and submit to this team
                      </Text>
                    </Flex>
                  </Checkbox>
                </Stack>
              </Box>
            </ModalBody>
          </Box>

          <ModalFooter bg="gray.100" borderRadius="0px 0px 10px 10px">
            <Button
              variant="outline"
              mr={3}
              height="30px"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              height="30px"
              onClick={handleCreateTeam}
              isLoading={loading}
            >
              Create Team
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default CreateTeamModal;
