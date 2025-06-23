import React, {
  lazy,
  memo,
  Suspense,
  useCallback,
  useRef,
  useState,
  useEffect,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import userImageSrc from "../../utils/userImageSrc";
import { useMutation, useQueryClient } from "react-query";
import { setCommentCred } from "../../store/slices/postSlice";

import PostsApis from "../../services/PostsApis";
import { setToast } from "../../store/slices/uiSlice";
import Spinner from "../../component/loaders/Spinner";
import ProfileImage from "../../component/ProfileImage";
import Ibutton from "../../component/buttons/Ibutton";
import useIcons from "../../hooks/useIcons";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import EditableElementInput from "../../component/inputComponents/EditableElementInput";

function CommentInput({ className }) {
  const { isLogin, user } = useSelector((state) => state.auth);
  const { commentCred } = useSelector((state) => state.posts);
  const { ThemeMode } = useSelector((state) => state.ui);
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const { Comments } = PostsApis();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const userImage = userImageSrc(user);
  const pickerRef = useRef();
  const emojiButtonRef = useRef();
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
          replyTo: null,
        })
      );
      inputRef.current.innerText = "";
      dispatch(
        setToast({ message: "You commented on this post", type: "success" })
      );
      queryClient.invalidateQueries(["TopComments"]);
    },
  });

  const handelInput = useCallback(
    (content) => {
      dispatch(
        setCommentCred({
          ...commentCred,
          content,
        })
      );
    },
    [dispatch, commentCred]
  );

  const handleEmojiSelect = (emoji) => {
    // Insert emoji at cursor position or append to end
    const currentText = commentCred.content;
    const updatedText = currentText + emoji.native;

    // Update Redux state
    dispatch(
      setCommentCred({
        ...commentCred,
        content: updatedText,
        at: updatedText,
      })
    );

    // Update the contentEditable div
    if (inputRef.current) {
      inputRef.current.innerText = updatedText;
    }

    // Close the emoji picker
    setOpenEmojiPicker(false);
  };

  // Handle clicks outside the emoji picker to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target)
      ) {
        setOpenEmojiPicker(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [pickerRef, emojiButtonRef]);
  useEffect(() => {
    if (commentCred.replyTo && inputRef?.current) {
      //
      inputRef.current.innerHTML = `<a href="#${commentCred.replyTo}" class="text-blue-500 cursor-pointer">@${commentCred.at}</a>`;
    }
  }, [commentCred.replyTo]);

  return (
    <div className={className}>
      <ProfileImage
        className={"min-w-10 min-h-10 h-10 w-10"}
        image={userImage.userImageurl}
        alt={user?.username}
      />
      <EditableElementInput ref={inputRef} onChange={handelInput} />
      <div className="relative flex justify-center items-center gap-2">
        <div className="relative">
          <Ibutton
            className={"p-1 rounded-full"}
            action={() => setOpenEmojiPicker(!openEmojiPicker)}
          >
            {icons["smile"]}
          </Ibutton>
          {openEmojiPicker && (
            <div ref={pickerRef} className="absolute bottom-12 right-0 z-10">
              <Picker
                data={data}
                onEmojiSelect={handleEmojiSelect}
                theme={ThemeMode === "dark" ? "dark" : "light"}
              />
            </div>
          )}
        </div>
        <Ibutton
          action={mutate}
          disabled={isLoading || !commentCred.content.trim()}
          className={`${!commentCred.content.trim() && "text-gray-300"} text-2xl rounded-full p-2`}
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
