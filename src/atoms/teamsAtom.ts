import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";

export interface Team {
  id: string;
  creatorId: string;
  numberOfMembers: number;
  privacyType: "public" | "restricted" | "private";
  createdAt?: Timestamp;
  imageUrl?: string;
}
