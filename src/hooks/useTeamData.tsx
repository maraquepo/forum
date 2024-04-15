import { authModalState } from "@/atoms/authModalAtom";
import { Team, TeamSnippet, teamState } from "@/atoms/teamsAtom";
import { auth, firestore } from "@/firebase/clientApp";
import {
  collection,
  doc,
  getDocs,
  increment,
  writeBatch,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useSetRecoilState } from "recoil";

const useTeamData = () => {
  const [user] = useAuthState(auth);
  const [teamStateValue, setTeamStateValue] = useRecoilState(teamState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const setAuthModalState = useSetRecoilState(authModalState);

  const onJoinOrLeaveTeam = (teamData: Team, isJoined: boolean) => {
    if (!user) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }

    setLoading(true);

    if (isJoined) {
      leaveTeam(teamData.id);
      return;
    }

    joinTeam(teamData);
  };

  const getMySnippets = async () => {
    setLoading(true);
    try {
      const snippetDocs = await getDocs(
        collection(firestore, `users/${user?.uid}/teamSnippets`)
      );

      const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }));

      setTeamStateValue((prev) => ({
        ...prev,
        mySnippets: snippets as TeamSnippet[],
      }));

      console.log("snip", snippets);
    } catch (err: any) {
      console.log("getMySnippets error", err);
    }
    setLoading(false);
  };

  const joinTeam = async (teamData: Team) => {
    // creating a new team snippet
    // updating the numberOfMembers
    // update recoil state - communityState.mySnippets
    setLoading(true);
    try {
      const batch = writeBatch(firestore);

      const newSnippet: TeamSnippet = {
        teamId: teamData.id,
        imageURL: teamData.imageURL || "",
      };

      batch.set(
        doc(firestore, `users/${user?.uid}/teamSnippets`, teamData.id),
        newSnippet
      );

      batch.update(doc(firestore, "teams", teamData.id), {
        numberOfMembers: increment(1),
      });

      await batch.commit();

      setTeamStateValue((prev) => ({
        ...prev,
        mySnippets: [...prev.mySnippets, newSnippet],
      }));
    } catch (err: any) {
      console.log("joinTeam error", err.message);
      setError(err.message);
    }
    setLoading(false);
  };

  const leaveTeam = async (teamId: string) => {
    // deleting the team snippet from user
    // updating the numberOf Members
    // update recoil state
    setLoading(true);

    try {
      const batch = writeBatch(firestore);

      batch.delete(doc(firestore, `users/${user?.uid}/teamSnippets`, teamId));

      batch.update(doc(firestore, "teams", teamId), {
        numberOfMembers: increment(-1),
      });

      await batch.commit();

      setTeamStateValue((prev) => ({
        ...prev,
        mySnippets: prev.mySnippets.filter((item) => item.teamId !== teamId),
      }));
    } catch (err: any) {
      console.log("leaveTeam error", err.message);
      setError(err.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    getMySnippets();
  }, [user]);

  return {
    teamStateValue,
    onJoinOrLeaveTeam,
    loading,
  };
};
export default useTeamData;
