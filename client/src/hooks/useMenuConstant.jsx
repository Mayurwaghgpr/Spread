import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setConfirmBox, setToast } from "../store/slices/uiSlice";
import { useNavigate } from "react-router-dom";
import useIcons from "./useIcons";

function useMenuConstant(parent, kind) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const icons = useIcons();
  const { user } = useSelector((state) => state.auth);

  const basePostMenu = [
    {
      id: "copy-link",
      itemName: "Copy Link",
      icon: icons["link"],
      action: () => {
        navigator.clipboard
          .writeText(window.location.href)
          .then(() => {
            dispatch(
              setToast({ message: "Copied to clipboard", type: "success" })
            );
          })
          .catch((err) => {
            console.error("Failed to copy text: ", err);
          });
      },
    },
    {
      id: "share",
      itemName: "Share",
      icon: <i className="bi bi-share"></i>,
      action: () => console.log("Share action triggered"),
    },
    {
      id: "delete-post",
      itemName: "Delete Post",
      icon: <i className="bi bi-trash2"></i>,
      action: (id) => {
        dispatch(
          setConfirmBox({
            message: "Do you really want to delete the post?",
            title: "Delete this post",
            status: true,
            content: "post",
            type: "delete",
            id,
          })
        );
      },
    },
    {
      id: "edit-post",
      itemName: "Edit Post",
      icon: icons["penO"],
      action: () => console.log("Edit action triggered"),
    },
  ];

  const baseCommentMenu = [
    {
      id: "delete-comment",
      itemName: "Delete Comment",
      icon: <i className="bi bi-trash2"></i>,
      action: (id) => {
        dispatch(
          setConfirmBox({
            message: "Do you really want to delete the comment?",
            title: "Delete this comment",
            status: true,
            content: "comment",
            type: "delete",
            id,
          })
        );
      },
    },
    {
      id: "edit-comment",
      itemName: "Edit Comment",
      icon: icons["penO"],
      action: () => console.log("Edit action triggered"),
    },
  ];

  const POST_MENU = React.useMemo(() => {
    if (!parent?.user?.id || parent.user.id === user?.id) {
      return basePostMenu;
    }
    // If not the owner, hide 'delete' and 'edit'
    return basePostMenu.filter(
      (item) => item.id !== "delete-post" && item.id !== "edit-post"
    );
  }, [parent?.user?.id, user?.id, icons]);

  const COMMENT_MENU = React.useMemo(() => {
    if (!parent?.user?.id || parent.user.id === user?.id) {
      return baseCommentMenu;
    }
    return baseCommentMenu.filter(
      (item) => item.id !== "delete-comment" && item.id !== "edit-comment"
    );
  }, [parent?.user?.id, user?.id, icons]);

  return { POST_MENU, COMMENT_MENU };
}

export default useMenuConstant;
