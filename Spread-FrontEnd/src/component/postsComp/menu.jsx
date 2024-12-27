import { useEffect, useState, useMemo, useCallback } from "react";
import { memo, useRef } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import PostsApis from "../../Apis/PostsApis";
import useClickOutside from "../../hooks/useClickOutside";
import { setConfirmBox, setToast } from "../../redux/slices/uiSlice";

const MENU_ITEMS = [
  {
    id: "copy-link",
    itemName: "Copy Link",
    icon: <i className="bi bi-link text-lg"></i>,
    action: (post) => navigator.clipboard.writeText(window.location.href),
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
    action: (post, confirmDeletePost) => confirmDeletePost(post.id),
  },
  {
    id: "edit-post",
    itemName: "Edit Post",
    icon: <i className="bi bi-pencil"></i>,
    action: () => console.log("Edit action triggered"),
  },
];

function Menu({ post }) {
  const [postIdToDelete, setPostIdToDelete] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);
  const {} = useSelector((state) => state.ui);
  const queryClient = useQueryClient();
  const { DeletePostApi } = PostsApis();

  const confirmDeletePost = useCallback(
    (id) => {
      dispatch(
        setConfirmBox({
          message: "Do you really want to delete the post?",
          title: "delete this post",
          status: true,
          type: "delete",
          id,
        })
      );
    },
    [dispatch]
  );

  const { menuId, setMenuId } = useClickOutside(menuRef);
  const handleMenuClick = useCallback(
    (item) => {
      // Don't close the menu for actions requiring confirmation
      if (item.id !== "delete-post") {
        setMenuId(""); // Close menu for non-confirmation actions
      }
      item.action(post, confirmDeletePost);
    },
    [post, confirmDeletePost, setMenuId]
  );

  return (
    <div ref={menuRef} className="relative flex justify-center items-center">
      <button
        aria-label="Menu"
        onClick={() => setMenuId((prev) => (prev === "" ? post?.id : ""))}
      >
        <i className="bi bi-three-dots-vertical"></i>
      </button>
      {menuId === post?.id && (
        <ul className="absolute z-20 sm:top-5 mt-2 py-1 gap-2 px-1 flex flex-col w-36 bg-[#e8e4df] dark:bg-[#0f0f0f] rounded-lg shadow-md">
          {MENU_ITEMS.map((item) => (
            <li
              key={item.id}
              className="flex gap-2 items-center px-1 hover:bg-gray-400 rounded-md cursor-pointer"
              onClick={() => handleMenuClick(item)}
            >
              {item.icon}
              {item.itemName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default memo(Menu);
