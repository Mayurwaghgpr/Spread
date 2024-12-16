import React, { memo, useMemo, useState } from "react";
import usePublicApis from "../../../Apis/publicApis";
import { useMutation } from "react-query";
import { setToast } from "../../../redux/slices/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import abbreviateNumber from "../../../utils/numAbrivation";
import { useNavigate } from "react-router-dom";
import LikesList from "./LikesList";
import useLikeIcons from "./useLikeIcons";

function Like({ post, className }) {
  const likeIconObj = useLikeIcons();
  const { LikePost } = usePublicApis();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLogin, user } = useSelector((state) => state.auth);

  // States
  const [optimistIcon, setOptimistIcon] = useState(""); // Optimistic UI update
  const [showList, setShowList] = useState(false);

  // Mutation for liking the post
  const { mutate } = useMutation({
    mutationFn: (likeConfig) => LikePost(likeConfig),
    onSuccess: (data) => {
      post.Likes = [...data.updtLikes];
    },
    onError: (error) => {
      dispatch(
        setToast({
          message: ` ${error.response.data.message} ✨`,
          type: "error",
        })
      );
    },
  });

  // Memoized check if the post is liked by the user
  const isLiked = useMemo(
    () => post?.Likes?.find((like) => like.likedBy === user?.id),
    [post?.Likes, user?.id]
  );

  const handleLike = (e) => {
    e.stopPropagation();

    if (isLogin) {
      const likeType = e.currentTarget.name || "";
      setOptimistIcon(likeType);
      mutate({ postId: post.id, liketype: likeType });
      setShowList(false);
    } else {
      navigate("/auth/signin");
    }
  };

  return (
    <div
      onMouseOver={() => setShowList(true)}
      onMouseOut={() => setShowList(false)}
      className={`relative flex items-end cursor-pointer ${
        isLiked ? "dark:text-white text-inherit" : ""
      } ${className}`}
    >
      {/* Likes list when hovered */}
      {showList && <LikesList mutate={handleLike} post={post} />}

      <button
        name=""
        onClick={isLiked ? handleLike : null}
        className="flex items-center justify-center gap-2 text-2xl"
      >
        {/* Icon rendering */}
        {likeIconObj[optimistIcon || (isLiked?.type ?? "default")]}
        <span className="text-sm">{abbreviateNumber(post.Likes.length)}</span>
      </button>
    </div>
  );
}

export default memo(Like);
