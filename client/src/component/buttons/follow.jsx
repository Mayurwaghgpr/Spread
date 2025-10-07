import { memo, useCallback, useMemo } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import usePublicApis from "../../services/publicApis";
import { setToast } from "../../store/slices/uiSlice";
import { useNavigate } from "react-router-dom";

function Follow({ className, person }) {
  const { user, isLogin } = useSelector((state) => state.auth);
  const { followUser } = usePublicApis();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Memoize the invalidation function
  const invalidateQueries = useCallback(() => {
    queryClient.invalidateQueries(["userProfile"]);
    queryClient.invalidateQueries(["loggedInUser"]);
  }, [queryClient]);

  // Check if currently following this user
  const isFollowing = useMemo(() => {
    return user?.Following?.some((followed) => followed?.id === person?.id);
  }, [user, person?.id]);

  // Follow mutation
  const { mutate, isLoading: isLoading } = useMutation(followUser, {
    onSuccess: (data) => {
      invalidateQueries();
      dispatch(setToast({ message: data.message, type: "success" }));
    },
    onError: (data) => {
      dispatch(setToast({ message: data.data.message, type: "success" }));
    },
  });

  // Handle follow/unfollow action
  const handleFollowToggle = useCallback(() => {
    if (!isLogin) {
      return navigate("/auth/signin");
    }

    if (!user?.id || !person?.id) return;
    mutate({ followerId: user.id, followedId: person.id });
  }, [isLogin, user?.id, person?.id, mutate, navigate]);

  return (
    <button
      onClick={handleFollowToggle}
      className={`relative flex justify-center items-center  group text-xs  sm:text-sm font-semibold text-white dark:text-black  rounded-full transition-all duration-200 hover:scale-105 sm:h-8 sm:min-w-28 w-20 h-8  ${className} ${
        isFollowing
          ? "hover:border-red-400 bg-black dark:bg-white  hover:border hover:bg-white dark:hover:bg-black/60"
          : "bg-black dark:bg-white  hover:bg-black/60 dark:hover:bg-white/90"
      }`}
      disabled={isLoading}
      aria-label={
        isFollowing
          ? `Unfollow ${person?.username || "user"}`
          : `Follow ${person?.username || "user"}`
      }
    >
      {isLoading ? (
        <div className="dotloader"></div>
      ) : person?.id === user?.id ? (
        <span>You</span>
      ) : isFollowing ? (
        <div>
          <span className="opacity-100 group-hover:opacity-0">Following</span>
          <span className="absolute left-0 right-0 opacity-0 bg-transparent group-hover:opacity-100 text-red-600">
            Unfollow
          </span>
        </div>
      ) : (
        <span className="w-full">Follow</span>
      )}
    </button>
  );
}

export default memo(Follow);
