import { postState } from "@/atoms/postsAtom";
import React from "react";
import { useRecoilState } from "recoil";

const usePosts = () => {
  const [postStateValue, setPostStateValue] = useRecoilState(postState);

  const onVote = async () => {};

  const onSelectedPost = () => {};

  const onDeletePost = () => {};

  return {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectedPost,
    onDeletePost,
  };
};
export default usePosts;
