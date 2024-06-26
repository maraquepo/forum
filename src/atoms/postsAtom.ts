import { Timestamp } from "@google-cloud/firestore";
import { atom } from "recoil";

export type Post = {
  id: string;
  teamId: string;
  creatorId: string;
  creatorDisplayName: string;
  title: string;
  body?: string;
  numberOfComments: number;
  voteStatus: number;
  imageURL?: string;
  teamImageURL?: string;
  createdAt: Timestamp;
};

interface PostState {
  selectedPost: Post | null;
  posts: Post[];
  // postVotes
}

const defaultPostState: PostState = {
  selectedPost: null,
  posts: [],
};

export const postState = atom({
  key: "postState",
  default: defaultPostState,
});
