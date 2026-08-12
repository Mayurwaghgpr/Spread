import { memo, useCallback, useMemo, useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { setToast } from "../../../store/slices/uiSlice";
import { useNavigate } from "react-router-dom";
import useIcons from "../../../hooks/useIcons";
import FedInBtn from "../FedInBtn";
import BookmarkBox from "./BookmarkBox";
import usePostsApis from "../../../services/usePostsApis";

function Bookmark({ className, post, children }) {
  const [optimisticId, setOptimisticId] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const timeoutRef = useRef(null);

  const { isLogin, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { savePost, addSavedPostToGroup } = usePostsApis();
  const icons = useIcons();

  const isBookmarked = useMemo(
    () => user?.savedPostsList?.some((savedPost) => savedPost?.id === post?.id),
    [user?.savedPostsList, post?.id],
  );

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsMenuOpen(false);
    }, 300); // 300ms grace period prevents accidental menu dismissal during cursor transition
  };

  const savePostMutation = useMutation({
    mutationFn: ({ postId }) => savePost({ postId }),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["loggedInUser"]);
      dispatch(setToast({ message: `${data.message} ✨`, type: "success" }));
    },
    onError: (error) => {
      setOptimisticId(false);
      dispatch(
        setToast({
          message: error.response?.data?.message || "Failed to update bookmark",
          type: "error",
        }),
      );
    },
    onMutate: () => {
      setOptimisticId(true);
    },
    onSettled: () => {
      setOptimisticId(false);
    },
  });

  const addtoGroupMutation = useMutation({
    mutationFn: ({ postId, groupName }) =>
      addSavedPostToGroup({ postId, groupName }),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["loggedInUser"]);
      dispatch(setToast({ message: `${data.message} ✨`, type: "success" }));
    },
    onError: (error) => {
      setOptimisticId(false);
      dispatch(
        setToast({
          message: error.data?.message || "Failed to update bookmark group",
          type: "error",
        }),
      );
    },
  });

  const handleBookmark = useCallback(
    (e) => {
      e.stopPropagation();
      if (!isLogin) {
        navigate("/auth/signin");
        return;
      }
      savePostMutation.mutate({ postId: post?.id });
    },
    [isLogin, navigate, savePostMutation, post?.id],
  );

  const icon = useMemo(() => {
    if (optimisticId) {
      return isBookmarked ? icons["bookmarkO"] : icons["bookmarkFi"];
    } else {
      return isBookmarked ? icons["bookmarkFi"] : icons["bookmarkO"];
    }
  }, [isBookmarked, optimisticId, icons]);

  return (
    <div
      className="relative inline-flex items-center border-inherit"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <FedInBtn
        className={`transition-all duration-200 hover:scale-110 active:scale-95 ${
          isBookmarked
            ? "text-stone-900 dark:text-stone-100 font-bold"
            : "text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
        } ${className}`}
        id="bookmark"
        onClick={handleBookmark}
        aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        disabled={savePostMutation.isPending}
      >
        {icon}
        {children}
      </FedInBtn>

      {isLogin && (
        <BookmarkBox
          postId={post?.id}
          userId={post?.author?.id}
          isOpen={isMenuOpen}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          mutation={addtoGroupMutation.mutate}
        />
      )}
    </div>
  );
}

export default memo(Bookmark);
