import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../redux/slices/chatSlice";
import { connectSocket } from "../utils/socketIo";

const useSocket = () => {
  const { isLogin, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const socketRef = useRef(null);

  useEffect(() => {
    if (isLogin && user?.id) {
      if (!socketRef.current) {
        socketRef.current = connectSocket();
      }
      const socket = socketRef.current;
      return () => {
        // socket.disconnect();
      };
    }
  }, [isLogin, user, dispatch]);
  const disconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };

  return { socket: socketRef.current, disconnectSocket };
};

export default useSocket;
