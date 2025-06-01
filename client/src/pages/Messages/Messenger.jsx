import React, { memo, useCallback, useEffect } from "react";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
import MessageLog from "./MessageLog";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessage,
  pushMessage,
  setMessageLogData,
} from "../../redux/slices/messangerSlice";
import useSocket from "../../hooks/useSocket";
import NewConversation from "./NewConversation";

function Messenger() {
  const { isLogin, user } = useSelector((state) => state.auth);
  const { openNewConverstionBox, messageLogData } = useSelector(
    (state) => state.messanger
  );
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
    <section className="h-screen w-full border-inherit">
      <div className="fixed w-full flex h-full border-y border-inherit">
        {openNewConverstionBox && <NewConversation />}
        <MessageLog />
        <Outlet />
      </div>
    </section>
  );
}

export default memo(Messenger);
