import { useMutation } from "@tanstack/react-query";
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
        sessionStorage.setItem(
          "conversationMeta",
          JSON.stringify(newPrivateConversation)
        );
        dispatch(selectConversation(newPrivateConversation));

        navigate(`/messages/c?Id=${newPrivateConversation.id}`, {
          replace: true,
        });
        dispatch(setToast({ message: message || "Conversation started", type: "success" }));
      },
      onError: (error) => {
        const errorMessage =
          error?.response?.data?.message || error?.message || "Failed to start conversation";
        dispatch(setToast({ message: errorMessage, type: "error" }));
      },
    });
  return { privateChatMutaion, isPrivateChatLoading };
}

export default usePrivateChatMutation;
