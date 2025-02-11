import { useEffect, useState, useMemo, useCallback } from "react";
import { memo, useRef } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import PostsApis from "../../Apis/PostsApis";
import useClickOutside from "../../hooks/useClickOutside";
import { setConfirmBox, setToast } from "../../redux/slices/uiSlice";
import menuCosntant from "./menuCosntant";

function Menu({ post }) {
  const [isIntersect, setIsIntersect] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);
  const {} = useSelector((state) => state.ui);
  const queryClient = useQueryClient();
  const { DeletePostApi } = PostsApis();
  const { MENU_ITEMS } = menuCosntant();

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

  useEffect(() => {
    if (!menuRef.current || menuId !== post?.id) return;

    const buttonRect = menuRef.current.getBoundingClientRect();
    const menuHeight = menuRef.current.children[1]?.offsetHeight || 0;

    // Check if menu overflows at the bottom
    const willOverflow = buttonRect.bottom + menuHeight > window.innerHeight;

    setIsIntersect(!willOverflow); // If it overflows, position it above
  }, [post, menuId]);

  return (
    <div
      ref={menuRef}
      className="sm:relative flex justify-center items-center border-inherit "
    >
      <button
        aria-label="Menu"
        onClick={() => setMenuId((prev) => (prev === null ? post?.id : null))}
      >
        <i className="bi bi-three-dots-vertical"></i>
      </button>

      {menuId === post?.id && (
        <div
          onClick={() => setMenuId("")}
          className={`fixed sm:absolute flex justify-center border-inherit items-end ${isIntersect ? "sm:-top-48" : ""} sm:-left-10 left-0 right-0 top-0 bottom-0 z-10 sm:w-fit sm:h-fit h-screen `}
        >
          <ul
            onClick={(e) => e.stopPropagation()}
            className="sm:absolute z-40 border-inherit text-sm sm:animate-none animate-slide-in-bottom flex flex-col gap-1 sm:h-fit h-1/2 sm:top-5 sm:w-36 w-full mt-2 sm:p-2 p-6  bg-[#e8e4df] dark:bg-[#0f0f0f] sm:rounded-lg rounded-xl m-1 border sm:shadow-md"
          >
            {MENU_ITEMS.map((item) => (
              <li
                key={item.id}
                className="flex gap-2 text-nowrap items-center sm:px-3 sm:py-1 p-3  hover:bg-gray-400 hover:bg-opacity-10 rounded-md cursor-pointer"
                onClick={() => handleMenuClick(item)}
              >
                {item.icon}
                {item.itemName}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default memo(Menu);
