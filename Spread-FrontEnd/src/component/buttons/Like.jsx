import React, { memo, useState } from "react";
import usePublicApis from "../../Apis/publicApis";
import { useMutation } from "react-query";
import { setToast } from "../../redux/slices/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import abbreviateNumber from "../../utils/numAbrivation";
import { useNavigate, useNavigation } from "react-router-dom";
// import clapSvg from "/public/clap-svgrepo-com.svg";
function Like({ post, className }) {
  const [optimisLike, setOptimisLike] = useState("");
  const { LikePost } = usePublicApis();
  const dispatch = useDispatch();
  const { isLogin, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  console.log(post.id);
  const { mutate } = useMutation({
    mutationFn: (postId) => LikePost(postId),
    onSuccess: (data) => {
      post.Likes = data.updtLikes;
      dispatch(setToast({ message: ` ${data.message} ✨`, type: "success" }));
    },
    onError: (error) => {
      console.log(error);
      dispatch(
        setToast({
          message: ` ${error.response.data.message} ✨`,
          type: "error",
        })
      );
    },
  });
  // It will check if the logged in  user id is in the Likedby array of post
  const isLiked = post?.Likes?.some((like) => like.likedBy === user.id);

  return (
    <div className={`flex cursor-pointer items-end ${className}`}>
      <button
        onClick={() => {
          if (isLogin) {
            mutate(post.id);
          } else {
            navigate("/auth/signin");
          }
        }}
        className=" flex items-end justify-center gap-1"
      >
        <i
          className={`bi ${
            isLiked ? "bi-hand-thumbs-up-fill" : "bi-hand-thumbs-up"
          }`}
        ></i>
        <span>{abbreviateNumber(post.Likes.length)}</span>
      </button>
    </div>
  );
}

export default memo(Like);
