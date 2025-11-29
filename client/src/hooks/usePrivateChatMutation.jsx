import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ChatApi from "../services/ChatApi";
import { selectConversation } from "../store/slices/messangerSlice";
import { setToast } from "../store/slices/uiSlice";

function usePrivateChatMutation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { startPrivateChat } = ChatApi();

  const { mutate: privateChatMutaion, isLoading: isPrivateChatLoading } =
    useMutation({
      mutationFn: (chatUserId) => startPrivateChat(chatUserId),
      onSuccess: (data) => {
        const { newPrivateConversation, message } = data;
        localStorage.setItem(
          "conversationMeta",
          JSON.stringify(newPrivateConversation)
        );
        dispatch(selectConversation(newPrivateConversation));

        navigate(`/messages/c?Id=${newPrivateConversation.id}`, {
          replace: true,
        });
        dispatch(setToast({ message: message, type: "success" }));
      },
      onError: () => {
        const errorMessage =
          error?.response?.data?.message || "Failed to start conversation";
        dispatch(setToast({ message: errorMessage, type: "error" }));
      },
    });
  return { privateChatMutaion, isPrivateChatLoading };
}

export default usePrivateChatMutation;
