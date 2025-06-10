import { useMutation, useQueryClient } from "react-query";
import PostsApis from "../services/PostsApis";
import audio from "../assets/audio/paper-rip-fast-252617.mp3";
import { useLocation, useNavigate } from "react-router-dom";
import { setConfirmBox, setToast } from "../store/slices/uiSlice";
import { useDispatch } from "react-redux";
function useDeleteHandlers() {
  const { DeletePostApi, deleteComtApi } = PostsApis();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();
  const tarePaper = new Audio(audio);
  const dispatch = useDispatch();
  //post deleting mutation
  const { mutate: delPost, isPostDeleting } = useMutation(DeletePostApi, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(["Allposts"]);
      tarePaper.play();
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
      dispatch(setConfirmBox({ message: "", status: false }));
      if (location.pathname.startsWith("/view")) {
        navigate(-1);
      }
    },
  });

  // Comment deleting mutation
  const { mutate: delComment, isLoading: isCommentDeleting } = useMutation(
    deleteComtApi,
    {
      onSuccess: (data) => {
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
        dispatch(setConfirmBox({ message: "", status: false }));
      },
    }
  );

  return { delPost, delComment, isPostDeleting, isCommentDeleting };
}
export default useDeleteHandlers;
