import React, { memo, useCallback, useMemo } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import usePublicApis from "../../services/publicApis";
import { setToast } from "../../store/slices/uiSlice";

function Follow({ className, person }) {
  const { user } = useSelector((state) => state.auth);
  const { followUser } = usePublicApis();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  // Memoize the invalidation function
  const invalidateQueries = useCallback(() => {
    queryClient.invalidateQueries(["userProfile"]);
    queryClient.invalidateQueries(["loggedInUser"]);
  }, [queryClient]);

  // Check if currently following this user
  const isFollowing = useMemo(
    () => user?.Following?.some((followed) => followed?.id === person?.id),
    [(user?.Following, person?.id)]
  );

  // Follow mutation
  const { mutate, isLoading: isLoading } = useMutation(followUser, {
    onSuccess: (data) => {
      invalidateQueries();
      dispatch(setToast({ message: data.message, type: "success" }));
    },
    onError: (data) => {
      console.log(data);
      dispatch(setToast({ message: data.data.message, type: "success" }));
    },
  });

  // Handle follow/unfollow action
  const handleFollowToggle = useCallback(() => {
    if (!user?.id || !person?.id) return;
    mutate({ followerId: user.id, followedId: person.id });
  }, [user?.id, person?.id, isFollowing, mutate]);

  // Don't render if it's the current user
  if (person?.id === user?.id) {
    return <button className={className}>You</button>;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className={className}>
        <div className="dotloader"></div>
      </div>
    );
  }

  // Skeleton loading state when person data is not available
  if (!person?.id && isLoading) {
    return (
      <button
        className={`${className} dark:bg-white bg-black bg-opacity-30 dark:bg-opacity-30 animate-pulse p-4 px-5 w-20 rounded-full`}
        disabled
      />
    );
  }

  return (
    <button
      onClick={handleFollowToggle}
      className={`relative group font-bold ${className} ${
        isFollowing
          ? "hover:border-red-400 hover:border hover:bg-transparent"
          : ""
      }`}
      disabled={isLoading}
      aria-label={
        isFollowing
          ? `Unfollow ${person?.username || "user"}`
          : `Follow ${person?.username || "user"}`
      }
    >
      {isFollowing ? (
        <div>
          <span className="opacity-100 group-hover:opacity-0">Following</span>
          <span className="absolute left-0 right-0 opacity-0 bg-transparent group-hover:opacity-100 text-red-600">
            Unfollow
          </span>
        </div>
      ) : (
        "Follow"
      )}
    </button>
  );
}

export default memo(Follow);
