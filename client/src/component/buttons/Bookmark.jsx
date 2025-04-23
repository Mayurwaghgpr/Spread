import React, { memo, useCallback, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { setToast } from "../../redux/slices/uiSlice";
import usePublicApis from "../../Apis/publicApis";
import { useNavigate } from "react-router-dom";
import Ibutton from "./Ibutton";

function Bookmark({ className, post }) {
  const [bookmarkIcon, setIcon] = useState("");
  const { isLogin, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ArchivePost } = usePublicApis();
  const queryClient = useQueryClient();

  const ArchiveMutation = useMutation((id) => ArchivePost(id), {
    onSuccess: (data) => {
      console.log(data);
      dispatch(setToast({ message: ` ${data.message} ✨`, type: "success" }));
      queryClient.invalidateQueries(["loggedInUser"]);
    },
    onError: (error) => {
      console.log(error);
      dispatch(
        setToast({
          message: error.message,
          type: "error",
        })
      );
    },
    onSettled: () => {
      setIcon("");
    },
  });

  const handleSavePost = useCallback(
    (post, icon) => {
      ArchiveMutation.mutate(post);
      setIcon(`${icon?.id}-${post}`);
    },
    [ArchiveMutation]
  );
  const isBookmarked = user?.savedPosts?.some(
    (savedPost) => savedPost?.id === post?.id
  );
  return (
    <div
      className={`${isBookmarked ? " text-black dark:text-white" : ""} ${className} `}
    >
      {" "}
      <Ibutton
        id="bookmark"
        onClick={(e) => {
          if (isLogin) {
            handleSavePost(post?.id, e.target);
          } else {
            navigate("/auth/signin");
          }
        }}
        disabled={post?.user?.id === user?.id}
      >
        <i
          className={`bi cursor-pointer transition-all duration-300 ${
            isBookmarked || bookmarkIcon === `bookmark-${post?.id}`
              ? "bi-bookmark-fill"
              : "bi-bookmark"
          }`}
        ></i>
      </Ibutton>
    </div>
  );
}

export default memo(Bookmark);
