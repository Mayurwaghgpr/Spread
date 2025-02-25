import React from "react";
import { useDispatch } from "react-redux";
import { setConfirmBox, setToast } from "../../redux/slices/uiSlice";
import { useNavigate } from "react-router-dom";

function menuCosntant() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const MENU_ITEMS = {
    copylike: {
      id: "copy-link",
      itemName: "Copy Link",
      icon: <i className="bi bi-link "></i>,
      action: (post) => {
        navigator.clipboard
          .writeText(window.location.href)
          .then(() => {
            dispatch(
              setToast({ message: "copied to clipboard", type: "success" })
            );
          })
          .catch((err) => {
            console.error("Failed to copy text: ", err);
          });
      },
    },
    share: {
      id: "share",
      itemName: "Share",
      icon: <i className="bi bi-share"></i>,
      action: () => console.log("Share action triggered"),
    },
    deletePost: {
      id: "delete-post",
      itemName: "Delete Post",
      icon: <i className="bi bi-trash2"></i>,
      action: (id) => {
        dispatch(
          setConfirmBox({
            message: "Do you really want to delete the post?",
            title: "delete this post",
            status: true,
            content: "post",
            type: "delete",
            id,
          })
        );
      },
    },
    editPost: {
      id: "edit-post",
      itemName: "Edit Post",
      icon: <i className="bi bi-pencil"></i>,
      action: () => console.log("Edit action triggered"),
    },
    deleteComment: {
      id: "delete-comment",
      itemName: "Delete Comment",
      icon: <i className="bi bi-trash2"></i>,
      action: (id) => {
        dispatch(
          setConfirmBox({
            message: "Do you really want to delete the comment?",
            title: "delete this comment",
            status: true,
            content: "comment",
            type: "delete",
            id,
          })
        );
      },
    },
    editComment: {
      id: "edit-comment",
      itemName: "Edit comment",
      icon: <i className="bi bi-pencil"></i>,
      action: () => console.log("Edit action triggered"),
    },
  };
  return { MENU_ITEMS };
}

export default menuCosntant;
