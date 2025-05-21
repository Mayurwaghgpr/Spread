import React, { memo, useCallback, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { setToast } from "../../redux/slices/uiSlice";
import usePublicApis from "../../Apis/publicApis";
import { useNavigate } from "react-router-dom";
import useIcons from "../../hooks/useIcons";
import FedInBtn from "./FedInBtn";
import PropTypes from "prop-types";
import { setUser } from "../../redux/slices/authSlice";

function Bookmark({ className, post }) {
  const [optimisticId, setOptimisticId] = useState(false);
  const { isLogin, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ArchivePost } = usePublicApis();
  const queryClient = useQueryClient();
  const icons = useIcons();

  const isBookmarked = useMemo(
    () => user?.savedPosts?.some((savedPost) => savedPost?.id === post?.id),
    [user?.savedPosts, post?.id]
  );

  const ArchiveMutation = useMutation((id) => ArchivePost(id), {
    onSuccess: (data) => {
      dispatch(setUser({ ...user, savedPosts: data.archived }));
      // queryClient.invalidateQueries(["loggedInUser"]);
      dispatch(setToast({ message: `${data.message} ✨`, type: "success" }));
    },
    onError: (error) => {
      setOptimisticId(false); // Revert optimistic update on error
      dispatch(
        setToast({
          message: error.response?.data?.message || "Failed to update bookmark",
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
  });

  const handleBookmark = useCallback(() => {
    if (!isLogin) {
      navigate("/auth/signin");
      return;
    }
    ArchiveMutation.mutate(post?.id);
  }, [isLogin, navigate, ArchiveMutation, post?.id]);

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
    <FedInBtn
      className={`${isBookmarked ? "text-black dark:text-white" : ""} ${className}`}
      id="bookmark"
      onClick={handleBookmark}
      aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
      disabled={ArchiveMutation.isLoading}
    >
      {icon}
    </FedInBtn>
  );
}

Bookmark.propTypes = {
  className: PropTypes.string,
  post: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
};

export default memo(Bookmark);
