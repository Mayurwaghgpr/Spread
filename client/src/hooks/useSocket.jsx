import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connectSocket } from "../utils/socketIo";

let socket = null; // Singleton socket instance

const useSocket = () => {
  const { isLogin, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLogin && user?.id && !socket) {
      socket = connectSocket();
      socket.emit("register", user.id);
    }

    return () => {
      if (!isLogin && socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [isLogin, user, dispatch]);

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  };

  return { socket, disconnectSocket };
};

export default useSocket;
