import { useMutation, useQueryClient } from "react-query";
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
  const { DeletePostApi, deleteComtApi } = usePostsApis();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();
  const dispatch = useDispatch();

  const { mutate: delPost, isLoading: isPostDeleting } = useMutation(
    DeletePostApi,
    {
      onSuccess: async (data) => {
        queryClient.invalidateQueries(["Allposts"]);
        await playDeleteSound();
        dispatch(setToast({ message: `${data.message} ✨`, type: "success" }));
      },
      onError: () => {
        dispatch(
          setToast({
            message: "Failed to delete post. Please try again.",
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
    }
  );

  const { mutate: delComment, isLoading: isCommentDeleting } = useMutation(
    deleteComtApi,
    {
      onSuccess: (data) => {
        dispatch(setToast({ message: `${data.message} ✨`, type: "success" }));
      },
      onError: () => {
        dispatch(
          setToast({
            message: "Failed to delete comment. Please try again.",
            type: "error",
          })
        );
      },
      onSettled: () => {
        dispatch(resetConfirmBox());
      },
    }
  );

  return { delPost, delComment, isPostDeleting, isCommentDeleting };
}

export default useDeleteHandlers;
