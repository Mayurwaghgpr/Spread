import React, {
  lazy,
  memo,
  Suspense,
  useCallback,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import userImageSrc from "../../utils/userImageSrc";
import { IoSend } from "react-icons/io5";
import { MdOutlineTagFaces } from "react-icons/md";
import { useMutation, useQueryClient } from "react-query";
import { setCommentCred } from "../../redux/slices/postSlice";
import DOMPurify from "dompurify";

import PostsApis from "../../Apis/PostsApis";
import { setToast } from "../../redux/slices/uiSlice";
import Spinner from "../../component/loaders/Spinner";
import useClickOutside from "../../hooks/useClickOutside";

const EmojiPicker = lazy(() => import("emoji-picker-react"));
function CommentInput({ className }) {
  const { isLogin, user } = useSelector((state) => state.auth);
  const { commentCred } = useSelector((state) => state.posts);
  const { ThemeMode } = useSelector((state) => state.ui);
  const { Comments } = PostsApis();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const userImage = userImageSrc(user);
  const pickerRef = useRef();
  const { mutate, isLoading } = useMutation({
    mutationFn: () => {
      Comments(commentCred);
    },
    onSuccess: () => {
      dispatch(
        setToast({ message: "Successfuly commented ", type: "success" })
      );
      dispatch(
        setCommentCred({
          ...commentCred,
          topCommentId: null,
          content: "",
          replyTo: null,
        })
      );
      queryClient.invalidateQueries(["TopComments"]);
    },
  });

  const handelInput = useCallback(
    (content) =>
      dispatch(
        setCommentCred({
          ...commentCred,
          content,
        })
      )[(dispatch, commentCred)]
  );
  const { menuId: openEmojiPicker, setMenuId: setOpenEmojiPicker } =
    useClickOutside(pickerRef);
  return (
    <div className={className}>
      <div className="flex  justify-start items-start text-sm">
        {" "}
        <img
          className="max-w-10 max-h-10 object-cover object-top rounded-full"
          src={userImage.userImageurl}
          alt={user?.username}
        />
        {/* <p>{user?.username}</p> */}
      </div>
      <div className="relative w-full flex items-center border-inherit">
        {" "}
        <p
          contentEditable={true}
          suppressContentEditableWarning
          aria-label="Comment..."
          className="w-full text-sm outline-none p-2 border-b bg-inherit border-inherit focus:border-black dark:focus:border-white resize-none"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(commentCred.at),
          }}
          onInput={(e) => handelInput(e.currentTarget.innerText)}
        ></p>
        <div className=" w-1 h-1 bg-none p-1 text-xl border-inherit">
          <MdOutlineTagFaces
            onClick={() => setOpenEmojiPicker((prev) => !prev)}
          />
          <div
            ref={pickerRef}
            className="absolute -right-16 min-size-10 -top-[30rem] border-inherit"
          >
            <Suspense fallback={<Spinner />}>
              <EmojiPicker
                lazyLoadEmojis={true}
                open={openEmojiPicker}
                theme={ThemeMode}
                onEmojiClick={(e) => console.log(e.emoji)}
              />
            </Suspense>
          </div>
        </div>
      </div>
      <div className=" flex justify-end *:transition-all *:duration-100 my-2 items-center gap-3">
        {/* <button className=" py-1 px-2 rounded-full">cancle</button> */}
        <button
          onClick={mutate}
          className=" hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full p-3 "
          disabled={isLoading}
        >
          {isLoading ? <Spinner /> : <IoSend />}
        </button>
      </div>
    </div>
  );
}

export default memo(CommentInput);
