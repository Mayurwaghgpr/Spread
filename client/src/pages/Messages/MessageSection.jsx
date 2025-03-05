import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { BsCameraVideo, BsCheck2All } from "react-icons/bs";
import { IoAttachOutline, IoCallOutline } from "react-icons/io5";
import { MdMic } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessage,
  popMessage,
  pushMessage,
} from "../../redux/slices/chatSlice";
import ChatApi from "../../Apis/ChatApi";
import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "react-query";
import FormatedTime from "../../component/utilityComp/FormatedTime";
import useSocket from "../../hooks/useSocket";
import { v4 as uuidv4 } from "uuid";
import MessageBubble from "./components/MessageBubble";
import Spinner from "../../component/loaders/Spinner";
function MessageSection() {
  const { isLogin, user } = useSelector((state) => state.auth);
  const { messages } = useSelector((state) => state.chat);
  const [isUserTyping, setUseTyping] = useState({});
  const [message, setMessage] = useState();
  const { getMessage } = ChatApi();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get("Id");
  const { socket } = useSocket();
  const messagesEndRef = useRef(null);

  const { isLoading } = useQuery(["messages", conversationId], {
    queryFn: () => getMessage(conversationId),
    onSuccess: (data) => {
      // console.log(data);
      dispatch(addMessage(data));
    },
  });

  useEffect(() => {
    if (isLogin && user?.id) {
      socket?.emit("joinConversation", conversationId);

      // socket.on("userIsTyping", ({ senderId }) => {
      //   console.log(senderId);
      //   setUseTyping({ senderId });
      // });
      const handleNewMessage = (msg) => dispatch(addMessage(msg));
      const handleError = () => dispatch(popMessage());
      socket?.on("newMessage", handleNewMessage);
      socket?.on("ErrorSendMessage", handleError);
    }

    return () => {
      socket?.off("newMessage", handleNewMessage);
      socket?.off("ErrorSendMessage", handleError);
    };
  }, []);

  const handleSend = useCallback(async () => {
    const messageObj = {
      id: uuidv4(),
      content: message,
      senderId: user?.id,
      conversationId,
      createdAt: new Date().toString(),
    };
    dispatch(pushMessage(messageObj));
    socket?.emit("sendMessage", messageObj);
    setMessage("");
  }, [message]);

  // console.log(user);
  // console.log(messages);
  const handleInput = useCallback(
    function (e) {
      // socket.emit("IamTyping", { conversationId, senderId: user?.id });
      setMessage(e.target.value);
    },
    [message]
  );

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messagesEndRef.current]);

  return (
    <div className="relative w-full sm:flex flex-col justify-between hidden border-inherit overflow-y-auto">
      <div className="sticky top-0 bg-[#fff9f3] dark:bg-black z-20 flex justify-end w-full  py-5 px-7 border-b border-inherit  shadow-md">
        <div className="flex items-center font-thin justify-center gap-4  text-2xl">
          {" "}
          <button>
            {" "}
            <BsCameraVideo />
          </button>
          <button>
            <IoCallOutline />
          </button>
        </div>
      </div>

      <div className=" sm:flex flex-col justify-end scroll-smooth no-scroll px-3 pt-5 pb-20 drop-shadow-xl ">
        {messages?.map((message) => {
          return (
            <MessageBubble
              key={message.id}
              message={message}
              userId={user.id}
            />
          );
        })}
        {isUserTyping?.senderId && isUserTyping?.senderId !== user.id && (
          <p
            className={` flex flex-col gap-1 w-fit p-2 text-sm rounded-2xl  my-3 mr-auto bg-[#fffefe] items-end text-black dark:shadow-white rounded-bl-none`}
          >
            <span className="dotloader"></span>
          </p>
        )}
        {isLoading && (
          <div className="flex justify-center items-center w-full h-full ">
            <Spinner className={"w-10 h-10 bg-black p-1 dark:bg-white"} />
          </div>
        )}
      </div>
      <div className=" sticky flex justify-center items-center gap-3 bottom-3 p-3 z-10 border-inherit  ">
        <div className="flex border rounded-full bg-white dark:bg-black  overflow-hidden w-1/2 border-inherit">
          <button className="text-2xl p-2">
            <IoAttachOutline />
          </button>
          <input
            onChange={handleInput}
            className=" w-full h-full  p-3 outline-none bg-inherit placeholder:font-thin"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            type="text"
            name=""
            value={message}
            id=""
            placeholder="start typing..."
          />
        </div>
        <div className="flex justify-center items-center gap-3">
          <button
            onClick={handleSend}
            className="text-2xl font-light bg-[#fff9f3] p-2 rounded-full dark:bg-black"
          >
            <div className="">
              <AiOutlineSend />
            </div>
          </button>
          <button className="text-2xl font-light bg-[#fff9f3] p-2 rounded-full dark:bg-black">
            <MdMic />
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(MessageSection);
