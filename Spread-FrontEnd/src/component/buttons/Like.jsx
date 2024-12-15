import React, { memo, useState } from "react";
import usePublicApis from "../../Apis/publicApis";
import { useMutation } from "react-query";
import { setToast } from "../../redux/slices/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import abbreviateNumber from "../../utils/numAbrivation";
import { useNavigate, useNavigation } from "react-router-dom";
import LikesList from "./LikesList";
// import clapSvg from "/public/clap-svgrepo-com.svg";
function Like({ post, className }) {
  const [optimisLike, setOptimisLike] = useState("");
  const { LikePost } = usePublicApis();
  const [showList, setShowList] = useState("");
  const dispatch = useDispatch();
  const { isLogin, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: (postId) => LikePost(postId),
    onSuccess: (data) => {
      post.Likes = data.updtLikes;
      dispatch(setToast({ message: ` ${data.message} ✨`, type: "success" }));
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
  // It will check if the logged in  user id is in the Likedby array of post
  const isLiked = post?.Likes?.some((like) => like.likedBy === user.id);

  return (
    <div
      // onMouseOver={() => setShowList(post?.id)}
      // onMouseOut={() => setShowList("")}
      className={`relative flex ${isLiked && "dark:text-white text-inherit "} cursor-pointer items-end  ${className}`}
    >
      {/* {showList === post?.id && <LikesList setShowList={setShowList} />} */}
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
            isLiked ? "bi-hand-thumbs-up-fill " : "bi-hand-thumbs-up"
          }`}
        ></i>
        <span>{abbreviateNumber(post.Likes.length)}</span>
      </button>
    </div>
  );
}

export default memo(Like);
