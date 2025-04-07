import React, { memo, useMemo, useState, useCallback } from "react";
import usePublicApis from "../../../Apis/publicApis";
import { useMutation } from "react-query";
import { setToast } from "../../../redux/slices/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import abbreviateNumber from "../../../utils/numAbrivation";
import { useNavigate } from "react-router-dom";
import LikesList from "./LikesList";
import useIcons from "../../../hooks/useIcons";

function Like({ post, className }) {
  const icons = useIcons();
  const { LikePost } = usePublicApis();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLogin, user } = useSelector((state) => state.auth);

  // State for optimistic UI updates
  const [optimistIcon, setOptimistIcon] = useState("");

  // Memoized check if the post is liked by the user
  const isLiked = useMemo(() => {
    const like = post?.Likes?.find((like) => like.likedBy === user?.id);
    setOptimistIcon(like?.type || "");
    return like;
  }, [post?.Likes, user?.id]);

  // Mutation for liking the post
  const { mutate } = useMutation({
    mutationFn: (likeConfig) => LikePost(likeConfig),
    onSuccess: (data) => {
      post.Likes = data.updatedLikes;
    },
    onError: (error) => {
      setOptimistIcon(""); // Revert optimistic update on error
      dispatch(
        setToast({
          message: `${error.response?.data?.message || "An error occurred"} ✨`,
          type: "error",
        })
      );
    },
  });

  // Handle like button click
  const handleLike = useCallback(
    (e) => {
      e.stopPropagation();

      if (!isLogin) {
        navigate("/auth/signin");
        return;
      }

      const likeType = e.currentTarget.name || "";
      setOptimistIcon(likeType); // Optimistic UI update
      mutate({ postId: post.id, liketype: likeType });
    },
    [isLogin, navigate, mutate, post.id]
  );

  // Memoized like count calculation
  const likeCount = useMemo(() => {
    const baseCount = post?.Likes?.length || 0;
    if (!isLiked && optimistIcon) {
      return abbreviateNumber(baseCount + 1);
    } else if (isLiked && !optimistIcon) {
      return abbreviateNumber(baseCount - 1);
    }
    return abbreviateNumber(baseCount);
  }, [optimistIcon, post?.Likes, isLiked]);

  return (
    <div
      className={`relative flex items-end cursor-pointer group ${
        isLiked ? "dark:text-white text-inherit" : ""
      } ${className}`}
    >
      {/* Likes list when hovered */}
      <LikesList mutate={handleLike} post={post} />

      {/* Like button */}
      <button
        name=""
        onClick={isLiked ? handleLike : null}
        className="flex items-center justify-center gap-1 text-inherit"
      >
        {/* Icon rendering */}
        {icons[optimistIcon || "likeO"]}
        <span className="text-md mt-1">{likeCount}</span>
      </button>
    </div>
  );
}

export default memo(Like);
