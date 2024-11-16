import React, { useCallback, useRef, useState } from "react";
import useClickOutside from "../../hooks/useClickOutside";
import { useDispatch, useSelector } from "react-redux";
import { setConfirmBox, setToast } from "../../redux/slices/uiSlice";
import { v4 as uuidv4 } from "uuid";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import PostsApis from "../../Apis/PostsApis";
function Menu({ post }) {
  const [postIdToDelete, setPostIdToDelete] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef();

  const { isConfirm } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);

  const queryClient = useQueryClient();
  const { DeletePostApi } = PostsApis();

  const { menuId, setMenuId } = useClickOutside(menuRef);

  useQuery({
    queryKey: "DeletePost",
    queryFn: () => DeletePostApi(postIdToDelete),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["Allposts"]);
      dispatch(setToast({ message: ` ${data.message} ✨`, type: "success" }));
    },
    onError: () => {},
    enabled: !!(isConfirm.status && postIdToDelete),
    onSettled: () => {
      if (location.pathname !== "/") {
        navigate(-1);
      }
    },
  });
  const confirmDeletePost = useCallback(
    (id) => {
      dispatch(
        setConfirmBox({
          message: "Do you really want to delete the post?",
          status: true,
          type: "delete post",
        })
      );
      setPostIdToDelete(id);
      setMenuId("");
    },
    [dispatch]
  );

  const menuItem = [
    {
      id: uuidv4(),
      itemName: "Delete Post",
      icon: <i className="bi bi-trash2"></i>,
      itemMethod: () => confirmDeletePost(post?.id),
    },
    {
      id: uuidv4(),
      itemName: "Edite Post",
      icon: <i className="bi bi-vignette"></i>,
      itemMethod: () => {},
    },
  ];
  return (
    <div className="relative  flex justify-center w-full items-center">
      <span
        className="cursor-pointer"
        onClick={() => setMenuId((prev) => (prev === "" ? post?.id : ""))}
        type="button"
      >
        <i className="bi bi-three-dots-vertical  "></i>
      </span>
      {menuId === post?.id && (
        <ul
          ref={menuRef}
          className="absolute sm:top-5 mt-2 p-2 gap-2 flex flex-col  w-32  bg-white dark:bg-[#0f0f0f]  border before:content-normal before:absolute before:-top-[0.3rem] before:right-[3.6rem] before:h-[10px] before:w-[10px] before:rotate-45 before:bg-inherit before:border-l before:border-t border-gray-300 rounded-lg"
        >
          {menuItem.map((item, idx) => (
            <li
              key={item.id}
              className="w-full flex gap-2 cursor-pointer"
              onClick={item.itemMethod}
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

export default Menu;
