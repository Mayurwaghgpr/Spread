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

  return followLoading ? (
    <div
      className={`${className} w-[6.7rem] bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full `}
    >
      <div className="dotloader"></div>
    </div>
  ) : (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      className={`group ${className} ${isFollowing && "hover:border-red-400 hover:bg-transparent"} bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full`}
    >
      {People?.id !== user?.id ? (
        <button
          onClick={() =>
            mutate({ followerId: user?.id, followedId: People?.id })
          }
          className="w-full *:transition-all *:duration-200 h-full bg-inherit rounded-3xl "
          disabled={followLoading}
        >
          {isFollowing ? (
            <>
              <span className="block group-hover:hidden ">Following</span>
              <span className="hidden group-hover:block text-red-600 ">
                Unfollow
              </span>
            </>
          ) : (
            "Follow"
          )}
        </button>
      ) : (
        <span className="flex justify-center items-center w-full h-full bg-inherit rounded-full">
          You
        </span>
      )}
    </div>
  );
}

export default memo(Follow);
