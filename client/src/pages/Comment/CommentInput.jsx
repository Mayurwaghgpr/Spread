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
import ProfileImage from "../../components/ProfileImage";
import data from "@emoji-mart/data";
import EditableElementInput from "../../components/inputComponents/EditableElementInput";
import { useNavigate, useParams } from "react-router-dom";
import useIcons from "../../hooks/useIcons";

const Picker = lazy(() => import("@emoji-mart/react"));

function CommentInput({ className = "" }) {
  const icons = useIcons();
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
        setToast({ message: "Response published ✨", type: "success" })
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

  const handleInput = useCallback(
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
        setToast({ message: "Response content cannot be empty", type: "error" })
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
    const currentText = commentCred.content || "";
    const updatedText = currentText + emoji.native;

    dispatch(
      setCommentCred({
        ...commentCred,
        content: updatedText,
        at: updatedText,
      })
    );

    if (inputRef.current) {
      inputRef.current.innerText = updatedText;
    }
    setOpenEmojiPicker(false);
  };

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
  }, []);

  useEffect(() => {
    if (commentCred.replyTo && inputRef?.current) {
      inputRef.current.innerHTML = `<a href="#${commentCred.replyTo}" class="text-stone-700 dark:text-stone-300 font-semibold cursor-pointer">@${commentCred.at}</a> `;
    }
  }, [commentCred.replyTo, commentCred.at]);

  return (
    <div className={`flex items-center gap-3 w-full border-inherit ${className}`}>
      <ProfileImage
        className="w-9 h-9 rounded-full shrink-0 ring-1 ring-stone-300 dark:ring-stone-700"
        image={userImage.userImageurl}
        alt={user?.username}
      />

      <div className="flex-1 flex items-center gap-2 spread-card px-3 py-1.5 rounded-2xl border border-stone-200 dark:border-stone-800 focus-within:ring-2 focus-within:ring-stone-400/50 transition-all">
        <div className="flex-1 min-w-0">
          <EditableElementInput ref={inputRef} onChange={handleInput} />
        </div>

        {/* Emoji Button */}
        <div className="relative shrink-0">
          <button
            ref={emojiButtonRef}
            type="button"
            onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
            className="p-1.5 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer text-base"
            aria-label="Add emoji"
          >
            {icons.smile}
          </button>

          {openEmojiPicker && (
            <div ref={pickerRef} className="absolute bottom-12 right-0 z-50 shadow-2xl rounded-2xl overflow-hidden">
              <Suspense fallback={<Spinner className="w-5 h-5 text-stone-900 dark:text-stone-100 p-2" />}>
                <Picker
                  data={data}
                  onEmojiSelect={handleEmojiSelect}
                  theme={ThemeMode === "dark" ? "dark" : "light"}
                />
              </Suspense>
            </div>
          )}
        </div>

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={isLoading || !commentCred?.content?.trim()}
          className={`p-2 rounded-full spread-btn-primary flex items-center justify-center transition-transform text-xs ${
            !commentCred?.content?.trim() || isLoading
              ? "opacity-40 cursor-not-allowed"
              : "hover:scale-105 cursor-pointer"
          }`}
          aria-label="Send response"
        >
          {isLoading ? (
            <Spinner className="w-3.5 h-3.5 text-stone-900 dark:text-stone-100" />
          ) : (
            icons.sendFi
          )}
        </button>
      </div>
    </div>
  );
}

export default memo(CommentInput);
