import { memo, useCallback, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import usePublicApis from "../../services/publicApis";
import { setToast } from "../../store/slices/uiSlice";
import { useNavigate } from "react-router-dom";

function Follow({ className = "", person }) {
  const { user, isLogin } = useSelector((state) => state.auth);
  const { followUser } = usePublicApis();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const invalidateQueries = useCallback(() => {
    queryClient.invalidateQueries(["userProfile"]);
    queryClient.invalidateQueries(["loggedInUser"]);
  }, [queryClient]);

  const isFollowing = useMemo(() => {
    return user?.Following?.some((followed) => followed?.id === person?.id);
  }, [user, person?.id]);

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: followUser,
    onSuccess: (data) => {
      invalidateQueries();
      dispatch(
        setToast({
          message: `${data?.message || "Updated follow status"} ${person?.displayName || "user"} ✨`,
          type: "success",
        })
      );
    },
    onError: (error) => {
      const msg = error?.response?.data?.message || error?.message || "Failed to update follow status";
      dispatch(
        setToast({
          message: `${msg} ✨`,
          type: "error",
        })
      );
    },
  });

  const handleFollowToggle = useCallback(
    (e) => {
      if (e?.stopPropagation) e.stopPropagation();
      if (!isLogin) {
        return navigate("/auth/signin");
      }

      if (!user?.id || !person?.id) return;
      mutate({ followerId: user.id, followedId: person.id });
    },
    [isLogin, user?.id, person?.id, mutate, navigate]
  );

  return (
    <button
      onClick={handleFollowToggle}
      className={`relative inline-flex items-center justify-center group text-xs font-semibold rounded-full transition-all duration-200 hover:scale-105 px-4 py-1.5 min-w-[90px] h-8 border ${className} ${
        isFollowing
          ? "bg-[#f5f1ec] dark:bg-[#121212] text-stone-800 dark:text-stone-200 border-inherit hover:border-red-500 hover:text-red-500"
          : "bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 border-transparent hover:opacity-90 shadow-sm"
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
        <div className="flex items-center justify-center">
          <span className="opacity-100 group-hover:opacity-0 transition-opacity">Following</span>
          <span className="absolute left-0 right-0 opacity-0 group-hover:opacity-100 text-red-500 transition-opacity font-bold text-center">
            Unfollow
          </span>
        </div>
      ) : (
        <span className="w-full text-center">Follow</span>
      )}
    </button>
  );
}

export default memo(Follow);
