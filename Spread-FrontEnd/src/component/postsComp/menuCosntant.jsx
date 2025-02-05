import React from "react";
import { useDispatch } from "react-redux";
import { setToast } from "../../redux/slices/uiSlice";

function menuCosntant() {
  const dispatch = useDispatch();
  const MENU_ITEMS = [
    {
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
      action: (post, confirmDelete) => confirmDelete(post.id),
    },
    {
      id: "edit-post",
      itemName: "Edit Post",
      icon: <i className="bi bi-pencil"></i>,
      action: () => console.log("Edit action triggered"),
    },
  ];
  return { MENU_ITEMS };
}

export default menuCosntant;
