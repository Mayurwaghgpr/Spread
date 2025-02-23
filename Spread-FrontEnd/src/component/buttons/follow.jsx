import React, { memo, useCallback, useMemo } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import usePublicApis from "../../Apis/publicApis";
import { setToast } from "../../redux/slices/uiSlice";

function Follow({ className, People }) {
  const { user } = useSelector((state) => state.auth);
  const { followUser, unfollowUser } = usePublicApis();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const invalidateQueries = () => {
    queryClient.invalidateQueries(["userProfile"]);
    queryClient.invalidateQueries(["loggedInUser"]);
  };

  const { mutate, isLoading: followLoading } = useMutation(followUser, {
    onSuccess: (data) => {
      dispatch(setToast({ message: data.message, type: "success" }));
      invalidateQueries();
    },
    onError: (data) => {
      console.log(data);
      dispatch(setToast({ message: data.data.message, type: "success" }));
    },
  });
  const isFollowing = user?.Following?.some(
    (followed) => followed?.id === People?.id
  );

  return followLoading ? (
    <div className={`${className} `}>
      <div className="dotloader"></div>
    </div>
  ) : (
    <>
      {People?.id !== user?.id ? (
        <button
          onClick={() =>
            mutate({ followerId: user?.id, followedId: People?.id })
          }
          className={`relative group ${className} ${isFollowing && "hover:border-red-400  hover:border hover:bg-transparent"}`}
          disabled={followLoading}
        >
          {isFollowing ? (
            <>
              <span className="opacity-100 group-hover:opacity-0 ">
                Following
              </span>
              <span className="absolute left-0 right-0  opacity-0   bg-transparent group-hover:opacity-100 text-red-600 ">
                Unfollow
              </span>
            </>
          ) : (
            "Follow"
          )}
        </button>
      ) : (
        <button className={className}>You</button>
      )}
    </>
  );
}

export default memo(Follow);
