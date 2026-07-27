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
import userImageSrc from "../../utils/functions/userImageSrc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setCommentCred } from "../../store/slices/postSlice";

import PostsApis from "../../services/usePostsApis";
import { setToast } from "../../store/slices/uiSlice";
import Spinner from "../../components/loaders/Spinner";
import ButtonSpinner from "../../components/loaders/ButtonSpinner";
import ProfileImage from "../../components/ProfileImage";
import Ibutton from "../../components/buttons/Ibutton";
import useIcons from "../../hooks/useIcons";
import data from "@emoji-mart/data";
const Picker = lazy(() => import("@emoji-mart/react"));
import EditableElementInput from "../../components/inputComponents/EditableElementInput";
import { useNavigate, useParams } from "react-router-dom";

function CommentInput({ className }) {
  const { isLogin, user } = useSelector((state) => state.auth);
  const { commentCred, postViewData } = useSelector((state) => state.posts);
  const { ThemeMode } = useSelector((state) => state.ui);
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const { comments: commentsApi, Comments: CommentsApi } = PostsApis();
  const sendCommentApi = commentsApi || CommentsApi;
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const userImage = userImageSrc(user);
  const pickerRef = useRef();
  const emojiButtonRef = useRef();
  const inputRef = useRef();
  const icons = useIcons();
  const navigate = useNavigate();
  const { id: routePostId } = useParams();

  const { mutate, isLoading } = useMutation({
    mutationFn: (payload) => sendCommentApi(payload || commentCred),
    onSuccess: () => {
      dispatch(
        setCommentCred({
          ...commentCred,
          topCommentId: null,
          content: "",
          replyTo: null,
        })
      );
      if (inputRef.current) inputRef.current.innerText = "";
      dispatch(
        setToast({ message: "You commented on this post", type: "success" })
      );
      queryClient.invalidateQueries(["TopComments"]);
    },
    onError: (error) => {
      dispatch(
        setToast({
          message:
            error?.data?.message || error?.message || "Failed to send comment",
          type: "error",
        })
      );
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

  const handleSend = useCallback(() => {
    if (!isLogin) {
      return navigate("/auth/signin");
    }
    const targetPostId = commentCred.postId || postViewData?.id || routePostId;
    if (!targetPostId) {
      dispatch(setToast({ message: "Post ID is missing", type: "error" }));
      return;
    }
    if (!commentCred.content || !commentCred.content.trim()) {
      dispatch(
        setToast({ message: "Comment content cannot be empty", type: "error" })
      );
      return;
    }
    mutate({
      ...commentCred,
      postId: targetPostId,
      content: commentCred.content.trim(),
    });
  }, [isLogin, commentCred, postViewData, routePostId, mutate, navigate, dispatch]);

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
          <Suspense
            fallback={
              <Spinner className={"w-8 h-8 p-1 bg-black dark:bg-white"} />
            }
          >
            {openEmojiPicker && (
              <div ref={pickerRef} className="absolute bottom-12 right-0 z-10">
                <Picker
                  data={data}
                  onEmojiSelect={handleEmojiSelect}
                  theme={ThemeMode === "dark" ? "dark" : "light"}
                />
              </div>
            )}
          </Suspense>
        </div>

        <Ibutton
          action={handleSend}
          disabled={isLoading || !commentCred.content.trim()}
          className={`${!commentCred.content.trim() && "text-gray-300"} text-2xl rounded-full p-2`}
        >
          {isLoading ? (
            <ButtonSpinner className="w-5 h-5 text-gray-700 dark:text-white" />
          ) : (
            icons["sendO"]
          )}
        </Ibutton>
      </div>
    </div>
  );
}

export default memo(CommentInput);
