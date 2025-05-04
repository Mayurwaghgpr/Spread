import React, { memo, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import userImageSrc from "../../utils/userImageSrc";
import { useMutation, useQueryClient } from "react-query";
import { setCommentCred } from "../../redux/slices/postSlice";
import DOMPurify from "dompurify";

import PostsApis from "../../Apis/PostsApis";
import { setToast } from "../../redux/slices/uiSlice";
import Spinner from "../../component/loaders/Spinner";
import ProfileImage from "../../component/ProfileImage";
import Ibutton from "../../component/buttons/Ibutton";
import useIcons from "../../hooks/useIcons";

// const EmojiPicker = lazy(() => import("emoji-picker-react"));
function CommentInput({ className }) {
  // const { isLogin, user } = useSelector((state) => state.auth);
  const { commentCred } = useSelector((state) => state.posts);
  // const { ThemeMode } = useSelector((state) => state.ui);
  const { Comments } = PostsApis();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const userImage = userImageSrc(user);
  // const pickerRef = useRef();
  const inputRef = useRef();
  const icons = useIcons();

  const { mutate, isLoading } = useMutation({
    mutationFn: () => {
      Comments(commentCred);
    },
    onSuccess: () => {
      dispatch(
        setCommentCred({
          ...commentCred,
          topCommentId: null,
          content: "",
          at: "",
          replyTo: null,
        })
      );
      inputRef.current.innerText = "";
      dispatch(
        setToast({ message: "Successfuly commented ", type: "success" })
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

  // const { menuId: openEmojiPicker, setMenuId: setOpenEmojiPicker } =
  //   useClickOutside(pickerRef);
  // console.log(commentCred);
  return (
    <div className={className}>
      <ProfileImage
        className={"min-w-10 min-h-10 h-10 w-10"}
        image={userImage.userImageurl}
        alt={user?.username}
      />{" "}
      <div className="relative flex flex-wrap justify-start items-start max-w-[70%] w-full text-wrap break-words text-sm">
        <p
          ref={inputRef}
          contentEditable={true}
          suppressContentEditableWarning
          className=" w-full border-b bg-inherit border-inherit outline-none p-2  text-inherit "
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(commentCred.at),
          }}
          onInput={(e) => handelInput(e.currentTarget.innerText)}
        ></p>
      </div>
      <div className="flex justify-center items-center gap-2">
        <Ibutton
          className={"p-1 rounded-full"}
          action={() => setOpenEmojiPicker((prev) => !prev)}
        >
          {icons["smile"]}
        </Ibutton>
        {/* <div
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
      </div> */}
        <Ibutton
          action={mutate}
          disabled={isLoading || !commentCred.content.trim()}
          className={`${!commentCred.content.trim() && "text-gray-300"} text-2xl rounded-full p-2 `}
        >
          {isLoading ? (
            <Spinner className={"w-5 h-5 dark:bg-white bg-black"} />
          ) : (
            icons["sendO"]
          )}
        </Ibutton>
      </div>
    </div>
  );
}

export default memo(CommentInput);
