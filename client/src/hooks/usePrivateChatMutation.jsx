import React from "react";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ChatApi from "../services/ChatApi";
import { selectConversation } from "../store/slices/messangerSlice";
import { setToast } from "../store/slices/uiSlice";

function usePrivateChatMutation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { startPrivateChate } = ChatApi();

  const { mutate: PrivateMutaion, isLoading: isPrivateLoading } = useMutation({
    mutationFn: (chatUserId) => startPrivateChate(chatUserId),
    onSuccess: (data) => {
      localStorage.setItem(
        "conversationMeta",
        JSON.stringify(data.newPrivateConversation)
      );
      dispatch(selectConversation(data.newPrivateConversation));

      navigate(`/messages/c?Id=${data.newPrivateConversation.id}`, {
        replace: true,
      });
      dispatch(setToast({ message: data.message, type: "success" }));
    },
    onError: () => {
      dispatch(
        setToast({ messge: "Fail to start conversation", type: "error" })
      );
    },
  });
  return { PrivateMutaion, isPrivateLoading };
}

export default usePrivateChatMutation;
