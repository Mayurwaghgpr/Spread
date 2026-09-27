import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";

let socket = null; // Singleton socket instance
const BASE_URL = import.meta.env.VITE_BASE_URL;

const useSocket = () => {
  const { isLogin, user } = useSelector((state) => state.auth);
  const [socketInstance, setSocketInstance] = useState(socket);
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get("Id");
  useEffect(() => {
    if (isLogin && user?.id) {
      if (!socket) {
        const rawToken = localStorage.getItem("AccessToken");
        const token =
          rawToken && rawToken !== "null" && rawToken !== "undefined"
            ? rawToken
            : "";

        socket = io(BASE_URL, {
          auth: {
            token,
          },
          withCredentials: true,
          autoConnect: true,
        });

        socket.on("connect", () => {
          // Socket connected
        });

        socket.on("connect_error", (err) => {
          // Socket connection error
        });
      }
      setSocketInstance(socket);
    } else if (socket) {
      socket.disconnect();
      socket = null;
      setSocketInstance(null);
    }
  }, [isLogin, user?.id]);

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      socket = null;
      setSocketInstance(null);
    }
  };

  return { socket: socketInstance, disconnectSocket };
};

export default useSocket;
