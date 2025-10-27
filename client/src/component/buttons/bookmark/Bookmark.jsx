import { memo, useCallback, useMemo, useState } from "react";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { setToast } from "../../../store/slices/uiSlice";
import usePublicApis from "../../../services/publicApis";
import { useNavigate } from "react-router-dom";
import useIcons from "../../../hooks/useIcons";
import FedInBtn from "../FedInBtn";
import { setUser } from "../../../store/slices/authSlice";
import BookmarkBox from "./BookmarkBox";

function Bookmark({ className, post, children }) {
  const [optimisticId, setOptimisticId] = useState(false);
  const { isLogin, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { savePost } = usePublicApis();
  const icons = useIcons();
  const isBookmarked = useMemo(
    () => user?.savedPostsList?.some((savedPost) => savedPost?.id === post?.id),
    [user?.savedPostsList, post?.id]
  );

  const savePostMutation = useMutation(
    ({ postId, groupName }) => savePost({ postId, groupName }),
    {
      onSuccess: (data) => {
        dispatch(setUser({ ...user, savedPostsList: data.savedPostsList }));
        // queryClient.invalidateQueries(["loggedInUser"]);
        dispatch(setToast({ message: `${data.message} ✨`, type: "success" }));
      },
      onError: (error) => {
        setOptimisticId(false); // Revert optimistic update on error
        dispatch(
          setToast({
            message:
              error.response?.data?.message || "Failed to update bookmark",
            type: "error",
          })
        );
      },
      onMutate: () => {
        setOptimisticId(true); // Optimistic update
      },
      onSettled: () => {
        setOptimisticId(false); // Revert optimistic update on error
      },
    }
  );

  const handleBookmark = useCallback(
    (e) => {
      e.stopPropagation();
      if (!isLogin) {
        navigate("/auth/signin");
        return;
      }
      savePostMutation.mutate({ postId: post?.id });
    },
    [isLogin, navigate, savePostMutation, post?.id]
  );

  const icon = useMemo(() => {
    if (optimisticId) {
      // We are performing an action
      return isBookmarked ? icons["bookmarkO"] : icons["bookmarkFi"];
    } else {
      // No action in progress
      return isBookmarked ? icons["bookmarkFi"] : icons["bookmarkO"];
    }
  }, [isBookmarked, optimisticId, icons]);

  return (
    <div className="relative group">
      <FedInBtn
        className={` ${isBookmarked ? "text-black dark:text-white" : ""} ${className}`}
        id="bookmark"
        onClick={handleBookmark}
        aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        disabled={savePostMutation.isLoading}
      >
        {icon}
        {children}
      </FedInBtn>

      <BookmarkBox
        postId={post.id}
        userId={post.user.id}
        mutation={savePostMutation.mutate}
      />
    </div>
  );
}

export default memo(Bookmark);
