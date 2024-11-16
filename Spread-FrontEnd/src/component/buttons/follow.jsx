import React, { memo, useCallback, useMemo } from "react";
import userApi from "../../Apis/userApi";
import { useMutation, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import usePublicApis from "../../Apis/publicApis";

function Follow({ className, People }) {
  const { user } = useSelector((state) => state.auth);
  const { followUser, unfollowUser } = usePublicApis();
  const queryClient = useQueryClient();
  const invalidateQueries = () => {
    queryClient.invalidateQueries(["userProfile"]);
    queryClient.invalidateQueries(["loggedInUser"]);
  };

  const { mutate, isLoading: followLoading } = useMutation(followUser, {
    onSuccess: invalidateQueries,
    onError: () => console.error("Error following user"),
  });
  const isFollowing = user?.Following?.some(
    (followed) => followed?.id === People?.id
  );

  return (
    <div className={className}>
      {followLoading ? (
        <div className="w-full relative h-full flex justify-center  rounded-3xl bg-inherit transition-all duration-300 items-center">
          <div className="dotloader"></div>
        </div>
      ) : People?.id !== user?.id ? (
        <button
          onClick={() =>
            mutate({ followerId: user?.id, followedId: People?.id })
          }
          className="w-full h-full bg-inherit rounded-3xl transition-all duration-300"
          disabled={followLoading}
        >
          {isFollowing ? "Following" : "Follow"}
        </button>
      ) : (
        <div className="flex justify-center items-center w-full h-full bg-inherit transition-all duration-300 rounded-full">
          You
        </div>
      )}
    </div>
  );
}

export default memo(Follow);
