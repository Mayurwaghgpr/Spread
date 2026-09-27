import { memo, useCallback, useEffect } from "react";
import { Outlet, useSearchParams } from "react-router-dom";
import ConversationLog from "./ConversationLog";
import { useDispatch, useSelector } from "react-redux";
import {
  pushMessage,
  setConversationLogData,
} from "../../store/slices/messangerSlice";
import useSocket from "../../hooks/useSocket";

function Messenger() {
  const { isLogin, user } = useSelector((state) => state.auth);
  const { conversationLogData } = useSelector((state) => state.messanger);
  const dispatch = useDispatch();

  const { socket } = useSocket();
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get("Id");

  const handleNewMessage = useCallback(
    (msg) => {
      const logs = Array.isArray(conversationLogData) ? conversationLogData : [];
      const filterLog = logs.filter((log) => log.id !== msg.conversationId);
      const logWithNewMessage = logs.find((log) => log.id === msg.conversationId);

      if (msg.senderId !== user?.id && msg.conversationId === conversationId) {
        dispatch(pushMessage(msg));
      }

      if (logWithNewMessage) {
        dispatch(
          setConversationLogData([
            {
              ...logWithNewMessage,
              lastMessage: "Encrypted message",
              updatedAt: msg.createdAt || new Date().toISOString(),
            },
            ...filterLog,
          ])
        );
      }
    },
    [dispatch, user?.id, conversationLogData, conversationId]
  );

  useEffect(() => {
    if (isLogin && user?.id && socket) {
      socket.on("newMessage", handleNewMessage);
      return () => {
        socket?.off("newMessage", handleNewMessage);
      };
    }
  }, [isLogin, user?.id, socket, handleNewMessage]);

  return (
    <main className="h-screen w-full border-inherit bg-transparent">
      <div className="flex h-full w-full border-inherit overflow-hidden bg-transparent">
        <ConversationLog />
        <Outlet />
      </div>
    </main>
  );
}

export default memo(Messenger);
