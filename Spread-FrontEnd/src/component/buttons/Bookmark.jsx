import React, { memo, useCallback, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { setToast } from "../../redux/slices/uiSlice";
import usePublicApis from "../../Apis/publicApis";
import { useNavigate } from "react-router-dom";

function Bookmark({ className, post }) {
  const [bookmarkIcon, setIcon] = useState("");
  const { isLogin, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ArchivePost } = usePublicApis();
  const queryClient = useQueryClient();

  const ArchiveMutation = useMutation((id) => ArchivePost(id), {
    onSuccess: (data) => {
      // queryClient.invalidateQueries(["loggedInUser"]);
      dispatch(setToast({ message: ` ${data.message} ✨`, type: "success" }));
    },
    onError: (error) => {
      dispatch(
        setToast({
          message: error.response?.error,
          type: "error",
        })
      );
    },
  });

  const handleSavePost = useCallback(
    (post, icon) => {
      ArchiveMutation.mutate(post);
      setIcon(`${icon?.id}-${post}`);
    },
    [ArchiveMutation]
  );
  const isBookmarked = user?.SavedPosts?.some(
    (savedPost) => savedPost?.id === post?.id
  );
  return (
    <div
      className={`${isBookmarked && "dark:text-white text-inherit "} ${className} `}
    >
      {" "}
      <i
        id="bookmark"
        disabled={post?.user?.id === user?.id}
        onClick={(e) => {
          if (isLogin) {
            handleSavePost(post?.id, e.target);
          } else {
            navigate("/auth/signin");
          }
        }}
        className={` bi cursor-pointer transition-all duration-300 ${
          isBookmarked || bookmarkIcon === `bookmark-${post?.id}`
            ? "bi-bookmark-fill"
            : "bi-bookmark"
        }`}
      ></i>
    </div>
  );
}

export default memo(Bookmark);
