import React, { memo, useCallback, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import MessageLog from "./MessageLog";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, pushMessage } from "../../redux/slices/messangerSlice";
import useSocket from "../../hooks/useSocket";
import NewConversation from "./NewConversation";

function Messanger() {
  const { isLogin, user } = useSelector((state) => state.auth);
  const { openNewConverstionBox } = useSelector((state) => state.messanger);
  const dispatch = useDispatch();
  const { socket } = useSocket();
  const handleNewMessage = useCallback(
    (msg) => {
      if (msg.senderId !== user?.id) {
        dispatch(pushMessage(msg));
      }
    },
    [dispatch, user?.id]
  );
  useEffect(() => {
    if (isLogin && user?.id && socket) {
      socket?.emit("register", user.id);
      // Listen for new messages
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
        {openNewConverstionBox && <NewConversation />}
        <MessageLog />
        <Outlet />
      </div>
    </section>
  );
}

export default memo(Messanger);
