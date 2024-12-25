import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useClickOutside from "../../hooks/useClickOutside";
import { useDispatch, useSelector } from "react-redux";
import { setConfirmBox, setToast } from "../../redux/slices/uiSlice";
import { v4 as uuidv4 } from "uuid";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import PostsApis from "../../Apis/PostsApis";
import audio from "../../assets/audio/paper-rip-fast-252617.mp3";
function Menu({ post }) {
  const [postIdToDelete, setPostIdToDelete] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);
  const tearpaper = useMemo(() => new Audio(audio), []);
  const { isConfirm } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);

  const queryClient = useQueryClient();
  const { DeletePostApi } = PostsApis();

  const { menuId, setMenuId } = useClickOutside(menuRef);

  const { mutate: deleteMutation } = useMutation((id) => DeletePostApi(id), {
    mutationKey: "DeletePost",
    onSuccess: (data) => {
      queryClient.invalidateQueries(["Allposts"]);
      dispatch(setToast({ message: ` ${data.message} ✨`, type: "success" }));
    },
    onError: () => {},
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
  useEffect(() => {
    if (isConfirm.status && postIdToDelete) {
      deleteMutation(postIdToDelete);
      tearpaper.play();
    }
  }, [postIdToDelete]);

  const menuItem = [
    {
      id: uuidv4(),
      itemName: "Copy Link",
      icon: <i className="bi bi-link text-lg"></i>,
      itemMethod: () => {
        navigator.clipboard.writeText(window.location.href);
      },
    },
    {
      id: uuidv4(),
      itemName: "Share",
      icon: <i className="bi bi-share"></i>,
      itemMethod: () => {},
    },
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
    <div
      className={`relative flex  dark:border-[#383838] justify-center items-center border-inherit`}
    >
      <span
        className="cursor-pointer"
        onClick={() => setMenuId((prev) => (prev === "" ? post?.id : ""))}
        type="button"
      >
        <i className="bi bi-three-dots-vertical"></i>
      </span>
      {menuId === post?.id && (
        <ul
          ref={menuRef}
          className="absolute border-inherit sm:top-5 mt-2 py-1 gap-2 px-1 hidden sm:flex flex-col w-36 z-10  bg-[#e8e4df] shadow-lg dark:bg-[#0f0f0f]  border before:content-normal before:absolute before:-top-[0.3rem] before:right-[4rem] before:h-[10px] before:w-[10px] before:rotate-45 before:bg-inherit before:border-l before:border-t before:border-inherit rounded-lg"
        >
          {menuItem.map((item, idx) => (
            <li
              key={item.id}
              className="w-full flex gap-2 items-center px-1 hover:bg-gray-400 hover:bg-opacity-15 rounded-md cursor-pointer"
              onClick={item.itemMethod}
            >
              {item.icon}
              {item.itemName}
            </li>
          ))}
        </ul>
      )}

      {menuId === post?.id && (
        <div className="fixed flex border-inherit items-end left-0 bottom-0 right-0  z-40 h-full sm:hidden">
          {" "}
          <ul
            ref={menuRef}
            className=" w-full  flex flex-col gap-2 animate-slide-in-bottom rounded-t-2xl border-inherit  border sm:hidden right-20 bg-white dark:bg-[#0f0f0f]  py-6"
          >
            {menuItem.map((item, idx) => (
              <li
                key={item.id}
                className="w-full flex gap-2 px-6 hover:bg-gray-400 hover:bg-opacity-25 p-2 items-center cursor-pointer"
                onClick={item.itemMethod}
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
