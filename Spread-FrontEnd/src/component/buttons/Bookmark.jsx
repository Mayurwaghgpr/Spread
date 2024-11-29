import React, { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { setToast } from "../../redux/slices/uiSlice";
import usePublicApis from "../../Apis/publicApis";

function Bookmark({ className, post }) {
  const [bookmarkIcon, setIcon] = useState("");
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { ArchivePost } = usePublicApis();
  const queryClient = useQueryClient();

  const ArchiveMutation = useMutation((id) => ArchivePost(id), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(["loggedInUser"]);
      dispatch(setToast({ message: ` ${data.message} ✨`, type: "success" }));
      setIcon("");
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
    <div className={`${className}`}>
      {" "}
      <i
        id="bookmark"
        disabled={post?.user?.id === user?.id}
        onClick={(e) => {
          handleSavePost(post?.id, e.target);
        }}
        className={`bi cursor-pointer transition-all duration-700 ${
          isBookmarked || bookmarkIcon === `bookmark-${post?.id}`
            ? "bi-bookmark-fill"
            : "bi-bookmark"
        }`}
      ></i>
    </div>
  );
}

export default Bookmark;
