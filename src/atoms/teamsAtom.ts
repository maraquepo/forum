import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";

export interface Team {
  id: string;
  creatorId: string;
  numberOfMembers: number;
  privacyType: "public" | "restricted" | "private";
  createdAt?: Timestamp;
  imageURL?: string;
}

export interface TeamSnippet {
  teamId: string;
  isManager?: boolean;
  imageURL?: string;
}

interface TeamState {
  mySnippets: TeamSnippet[];
}

const defaultTeamState: TeamState = {
  mySnippets: [],
};

export const teamState = atom<TeamState>({
  key: "teamsState",
  default: defaultTeamState,
});
