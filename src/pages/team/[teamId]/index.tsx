import { Team } from "@/atoms/teamsAtom";
import PageContent from "@/components/Layout/PageContent";
import Posts from "@/components/Posts/Posts";
import CreatePostLink from "@/components/Team/CreatePostLink";
import Header from "@/components/Team/Header";
import TeamNotFound from "@/components/Team/TeamNotFound";
import { firestore } from "@/firebase/clientApp";
import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React from "react";
import safeJsonStringify from "safe-json-stringify";

type TeamPageProps = {
  teamData: Team;
};

const TeamPage: React.FC<TeamPageProps> = ({ teamData }) => {
  if (!teamData) {
    return <TeamNotFound />;
  }

  return (
    <>
      <Header teamData={teamData} />
      <PageContent>
        <>
          <CreatePostLink />
          <Posts teamData={teamData} />
        </>
        <>
          <div>RHS</div>
        </>
      </PageContent>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const teamDocRef = doc(firestore, "teams", context.query.teamId as string);
    const teamDoc = await getDoc(teamDocRef);

    return {
      props: {
        teamData: teamDoc.exists()
          ? JSON.parse(safeJsonStringify({ id: teamDoc.id, ...teamDoc.data() }))
          : "",
      },
    };
  } catch (err) {
    console.log("getServerSideProps error", err);
  }
}

export default TeamPage;
