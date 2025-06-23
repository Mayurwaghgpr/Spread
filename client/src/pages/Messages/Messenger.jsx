import React, { memo, useCallback, useEffect } from "react";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
import MessageLog from "./MessageLog";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessage,
  pushMessage,
  setMessageLogData,
} from "../../store/slices/messangerSlice";
import useSocket from "../../hooks/useSocket";

function Messenger() {
  const { isLogin, user } = useSelector((state) => state.auth);
  const { messageLogData } = useSelector((state) => state.messanger);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { socket } = useSocket();
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get("Id");

  const handleNewMessage = useCallback(
    (msg) => {
      const filterLog = messageLogData.filter(
        (log) => log.id !== msg.conversationId
      );
      const logWithNewMessage = messageLogData.find(
        (log) => log.id === msg.conversationId
      );
      if (msg.senderId !== user?.id && msg.conversationId === conversationId) {
        dispatch(pushMessage(msg));
      }
      if (!logWithNewMessage) return;
      dispatch(
        setMessageLogData([
          ...(logWithNewMessage
            ? [{ ...logWithNewMessage, lastMessage: msg.content }]
            : []),
          ...filterLog,
        ])
      );
    },
    [dispatch, user?.id, messageLogData]
  );

  useEffect(() => {
    if (isLogin && user?.id && socket) {
      // Listen for new messages
      socket.on("newMessage", handleNewMessage);

      // Cleanup when unmounting or user logs out
      return () => {
        socket?.off("newMessage", handleNewMessage);
      };
    }
  }, [isLogin, user?.id, socket, handleNewMessage]);
  return (
    <section className="h-screen w-full border-inherit">
      <div className="fixed w-full flex h-full border-y border-inherit">
        <MessageLog />
        {/* This Outlet will render the chat window or conversation details */}
        <div className="flex-1 overflow-y-auto">
          {conversationId ? (
            <Outlet />
          ) : (
            <div className="flex flex-col justify-center items-start gap-3 w-[80%] p-32 pt-0 h-full ">
              <h1 className="text-3xl font-bold ">
                Select a conversation to start chatting
              </h1>
              <p className=" text-gray-500 dark:text-gray-400">
                You can create a new conversation by clicking on the +Icon
                button or chose from existing conversations on the left.
              </p>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-700 transition-colors"
                onClick={() => navigate("new/c")}
              >
                Start New Conversation
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default memo(Messenger);
