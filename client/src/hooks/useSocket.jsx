import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";

let socket = null; // Singleton socket instance
const BASE_URL = import.meta.env.VITE_BASE_URL;

const useSocket = () => {
  const { isLogin, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get("Id");

  useEffect(() => {
    if (isLogin && user?.id && !socket) {
      socket = io(BASE_URL, {
        query: {
          connectedUserId: user.id,
          activeConversationId: conversationId,
        },
        withCredentials: true,
        autoConnect: false,
      }).connect();
      socket.emit("register", user.id);
    }

    return () => {
      if (!isLogin && socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [isLogin, user, dispatch, BASE_URL]);

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  };

  return { socket, disconnectSocket };
};

export default useSocket;
