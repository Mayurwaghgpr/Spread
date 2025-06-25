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
    <main className="h-full w-full border-inherit p-3">
      <div className="flex h-full w-full border rounded-lg border-inherit overflow-hidden">
        <MessageLog />
        {/* This Outlet will render the chat window or conversation details */}
        <div className="flex-1 overflow-y-auto border-inherit">
          <Outlet />
        </div>
      </div>
    </main>
  );
}

export default memo(Messenger);
