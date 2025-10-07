import { memo, useMemo, useState, useCallback } from "react";
import usePublicApis from "../../../services/publicApis";
import { useMutation, useQueryClient } from "react-query";
import { setToast } from "../../../store/slices/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LikesList from "./LikesList";
import useIcons from "../../../hooks/useIcons";
import AbbreviateNumber from "../../../utils/AbbreviateNumber";
import { getReactionColour } from "./getReactionColour";

function Like({ post, className }) {
  const icons = useIcons();
  const { LikePost } = usePublicApis();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLogin, user } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();
  // State for optimistic UI updates
  const [optimistIcon, setOptimistIcon] = useState("");
  const invalidateQueries = useCallback(() => {
    queryClient.invalidateQueries(["userProfile"]);
    queryClient.invalidateQueries(["loggedInUser"]);
  }, [queryClient]);

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
      invalidateQueries();
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
      return <AbbreviateNumber rawNumber={baseCount + 1} />;
    } else if (isLiked && !optimistIcon) {
      return <AbbreviateNumber rawNumber={baseCount - 1} />;
    }
    return <AbbreviateNumber rawNumber={baseCount} />;
  }, [optimistIcon, post?.Likes, isLiked]);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`relative flex items-end cursor-pointer group  border-inherit ${getReactionColour(optimistIcon)}  ${
        isLiked ? "" : ""
      } ${className}`}
    >
      {/* Likes list when hovered */}
      <LikesList mutate={handleLike} post={post} />
      {/* Like button */}
      <button
        name=""
        onClick={isLiked ? handleLike : null}
        className="flex items-center justify-center gap-1  "
      >
        {/* Icon rendering */}
        <span className="">{icons[optimistIcon || "likeO"]}</span>
        <span className="">{likeCount}</span>
      </button>
    </div>
  );
}

export default memo(Like);
