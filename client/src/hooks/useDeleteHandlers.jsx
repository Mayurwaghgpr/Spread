import { useMutation, useQueryClient } from "@tanstack/react-query";
import usePostsApis from "../services/usePostsApis";
import { useLocation, useNavigate } from "react-router-dom";
import { resetConfirmBox, setToast } from "../store/slices/uiSlice";
import { useDispatch } from "react-redux";

let audioInstance = null;

async function playDeleteSound() {
  if (!audioInstance) {
    const audioModule = await import(
      "../assets/audio/paper-rip-fast-252617.mp3"
    );
    audioInstance = new Audio(audioModule.default);
  }

  audioInstance.currentTime = 0;
  audioInstance.play();
}

function useDeleteHandlers() {
  const { deletePostApi, deleteComtApi } = usePostsApis();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();
  const dispatch = useDispatch();

  const { mutate: delPost, isPending: isPostDeleting } = useMutation({
    mutationFn: (postId) => deletePostApi(postId),
    onSuccess: async (data) => {
      queryClient.invalidateQueries(["postsFeed"]);
      queryClient.invalidateQueries(["userProfile"]);
      await playDeleteSound();
      dispatch(setToast({ message: `${data?.message || "Post deleted"} ✨`, type: "success" }));
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to delete post. Please try again.";
      dispatch(
        setToast({
          message: errorMessage,
          type: "error",
        })
      );
    },
    onSettled: () => {
      dispatch(resetConfirmBox());
      if (location.pathname.startsWith("/view")) {
        navigate(-1);
      }
    },
  });

  const { mutate: delComment, isPending: isCommentDeleting } = useMutation({
    mutationFn: (commentId) => deleteComtApi(commentId),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["TopComments"]);
      dispatch(setToast({ message: `${data?.message || "Comment deleted"} ✨`, type: "success" }));
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to delete comment. Please try again.";
      dispatch(
        setToast({
          message: errorMessage,
          type: "error",
        })
      );
    },
    onSettled: () => {
      dispatch(resetConfirmBox());
    },
  });

  return { delPost, delComment, isPostDeleting, isCommentDeleting };
}

export default useDeleteHandlers;
