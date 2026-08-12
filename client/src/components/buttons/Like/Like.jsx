import { memo, useMemo, useState, useCallback, useRef, useEffect } from "react";
import usePublicApis from "../../../services/publicApis";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setToast } from "../../../store/slices/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LikesList from "./LikesList";
import useIcons from "../../../hooks/useIcons";
import AbbreviateNumber from "../../../utils/components/AbbreviateNumber";
import { getReactionColour } from "./getReactionColour";

function Like({ post, className }) {
  const icons = useIcons();
  const { LikePost } = usePublicApis();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLogin, user } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();

  const [optimistIcon, setOptimistIcon] = useState("");
  const [isPopping, setIsPopping] = useState(false);
  const [showPopover, setShowPopover] = useState(false);

  const hoverTimerRef = useRef(null);
  const leaveTimerRef = useRef(null);

  const invalidateQueries = useCallback(() => {
    queryClient.invalidateQueries(["userProfile"]);
    queryClient.invalidateQueries(["loggedInUser"]);
  }, [queryClient]);

  const isLiked = useMemo(() => {
    const like = post?.Likes?.find((like) => like.likedBy === user?.id);
    return like;
  }, [post?.Likes, user?.id]);

  const currentReaction = optimistIcon || isLiked?.type || "";

  const { mutate } = useMutation({
    mutationFn: (likeConfig) => LikePost(likeConfig),
    onSuccess: () => {
      invalidateQueries();
    },
    onError: (error) => {
      setOptimistIcon("");
      dispatch(
        setToast({
          message: `${error.response?.data?.message || "An error occurred"} ✨`,
          type: "error",
        })
      );
    },
  });

  const handleMouseEnter = useCallback(() => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
    }
    // Delay opening slightly (150ms) to prevent accidental popups when scrolling or moving across
    hoverTimerRef.current = setTimeout(() => {
      setShowPopover(true);
    }, 150);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    // Grace period delay (250ms) before closing popover
    leaveTimerRef.current = setTimeout(() => {
      setShowPopover(false);
    }, 250);
  }, []);

  const handleLike = useCallback(
    (e) => {
      if (e?.stopPropagation) e.stopPropagation();

      if (!isLogin) {
        navigate("/auth/signin");
        return;
      }

      let likeType = e?.currentTarget?.name || e?.target?.name || "";
      if (!likeType && e?.type === "click") {
        likeType = isLiked ? "" : "like";
      }

      setOptimistIcon(likeType);
      setShowPopover(false);

      // Trigger tactile spring bounce
      setIsPopping(true);
      setTimeout(() => setIsPopping(false), 300);

      mutate({ postId: post.id, liketype: likeType });
    },
    [isLogin, navigate, mutate, post.id, isLiked]
  );

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    };
  }, []);

  const likeCount = useMemo(() => {
    const baseCount = post?.Likes?.length || 0;
    if (!isLiked && optimistIcon) {
      return <AbbreviateNumber rawNumber={baseCount + 1} />;
    } else if (isLiked && optimistIcon === "") {
      return <AbbreviateNumber rawNumber={baseCount - 1} />;
    }
    return <AbbreviateNumber rawNumber={baseCount} />;
  }, [optimistIcon, post?.Likes, isLiked]);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`relative flex items-center border-inherit ${className}`}
    >
      {/* Reactions popover menu */}
      <LikesList
        mutate={handleLike}
        isVisible={showPopover}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />

      {/* Like Button - Hover trigger only on Like Button */}
      <button
        onClick={handleLike}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 hover:bg-[#f5f1ec] dark:hover:bg-[#121212] active:scale-95 cursor-pointer ${
          currentReaction
            ? "text-stone-900 dark:text-stone-100"
            : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
        }`}
      >
        <span
          className={`text-base transition-transform duration-300 ${
            isPopping ? "scale-140 -rotate-12" : "scale-100"
          } ${getReactionColour(currentReaction)}`}
        >
          {icons[currentReaction || "likeO"]}
        </span>
        <span className="text-xs font-medium">{likeCount}</span>
      </button>
    </div>
  );
}

export default memo(Like);
