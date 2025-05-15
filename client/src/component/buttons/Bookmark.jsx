import React, { memo, useCallback, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { setToast } from "../../redux/slices/uiSlice";
import usePublicApis from "../../Apis/publicApis";
import { useNavigate } from "react-router-dom";
import useIcons from "../../hooks/useIcons";
import FedInBtn from "./FedInBtn";
function Bookmark({ className, post }) {
  const [optimisticIcon, setOptimisticIcon] = useState("");
  const { isLogin, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ArchivePost } = usePublicApis();
  const queryClient = useQueryClient();
  const icons = useIcons();
  const ArchiveMutation = useMutation((id) => ArchivePost(id), {
    onSuccess: (data) => {
      if (data.removed) {
        setOptimisticIcon("");
      }
      dispatch(setToast({ message: ` ${data.message} ✨`, type: "success" }));
      // queryClient.invalidateQueries(["loggedInUser"]);
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
  });

  const handleSavePost = useCallback(
    (id) => {
      ArchiveMutation.mutate(id);
      setOptimisticIcon(id);
    },
    [ArchiveMutation]
  );
  const isBookmarked = user?.savedPosts?.some(
    (savedPost) => savedPost?.id === post?.id
  );
  const isIcon = useMemo(() => {
    if (optimisticIcon === post?.id && !isBookmarked) {
      return icons["bookmarkFi"];
    } else if (optimisticIcon === post?.id && isBookmarked) {
      return icons["bookmarkO"];
    } else if (optimisticIcon !== post?.id && isBookmarked) {
      return icons["bookmarkFi"];
    } else {
      return icons["bookmarkO"];
    }
  }, [user?.savedPosts, optimisticIcon, isBookmarked]);

  return (
    <FedInBtn
      className={`${isBookmarked ? " text-black dark:text-white" : ""} ${className} `}
      id="bookmark"
      onClick={(e) => {
        if (isLogin) {
          handleSavePost(post?.id);
        } else {
          navigate("/auth/signin");
        }
      }}
    >
      {isIcon}
    </FedInBtn>
  );
}

export default memo(Bookmark);
