import React, { memo, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import MessageLog from "./MessageLog";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../../redux/slices/chatSlice";
import useSocket from "../../hooks/useSocket";

function Messanger() {
  const { isLogin, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { socket } = useSocket();

  useEffect(() => {
    if (isLogin && user?.id && socket) {
      socket?.emit("register", user.id);
      // Listen for new messages
      const handleNewMessage = (msg) => dispatch(addMessage(msg));
      socket.on("newMessage", handleNewMessage);

      // Cleanup when unmounting or user logs out
      return () => {
        socket?.off("newMessage", handleNewMessage);
      };
    }
  }, [isLogin && user?.id, socket]);

  return (
    <section className="h-screen w-full border-inherit">
      <div className="fixed w-full flex h-full border-y border-inherit">
        <MessageLog />

        <Outlet />
      </div>
    </section>
  );
}

export default memo(Messanger);
