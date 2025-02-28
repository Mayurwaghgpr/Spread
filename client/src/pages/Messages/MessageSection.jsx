import React, { memo, useCallback, useEffect, useState } from "react";
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

// const messages = [
//   {
//     id: 1,
//     senderId: 1,
//     receiverId: 2,
//     message: "Hey Priya! How are you?",
//     timestamp: "2024-02-11T10:30:00Z",
//   },
//   {
//     id: 2,
//     senderId: 2,
//     receiverId: 1,
//     message: "Hey Mayur! I'm good, how about you?",
//     timestamp: "2024-02-11T10:31:00Z",
//   },
//   {
//     id: 3,
//     senderId: 1,
//     receiverId: 2,
//     message: "I'm doing great! What are you up to?",
//     timestamp: "2024-02-11T10:32:00Z",
//   },
//   {
//     id: 4,
//     senderId: 2,
//     receiverId: 1,
//     message: "Just working on a project. You?",
//     timestamp: "2024-02-11T10:33:00Z",
//   },
//   {
//     id: 5,
//     senderId: 1,
//     receiverId: 2,
//     message: "Building a chat app!",
//     timestamp: "2024-02-11T10:34:00Z",
//   },
//   {
//     id: 6,
//     senderId: 2,
//     receiverId: 1,
//     message: "That sounds cool! Need any help?",
//     timestamp: "2024-02-11T10:35:00Z",
//   },
//   {
//     id: 7,
//     senderId: 1,
//     receiverId: 2,
//     message: "Yeah, actually. I'm implementing real-time messaging.",
//     timestamp: "2024-02-11T10:36:00Z",
//   },
//   {
//     id: 8,
//     senderId: 2,
//     receiverId: 1,
//     message: "WebSockets might be useful. Have you tried them?",
//     timestamp: "2024-02-11T10:37:00Z",
//   },
//   {
//     id: 9,
//     senderId: 1,
//     receiverId: 2,
//     message: "Not yet, but I'll check it out. Thanks for the tip!",
//     timestamp: "2024-02-11T10:38:00Z",
//   },
//   {
//     id: 10,
//     senderId: 2,
//     receiverId: 1,
//     message: "No problem! Let me know if you need any help.",
//     timestamp: "2024-02-11T10:39:00Z",
//   },
//   {
//     id: 11,
//     senderId: 1,
//     receiverId: 2,
//     message: "Will do! By the way, how’s your project going?",
//     timestamp: "2024-02-11T10:40:00Z",
//   },
//   {
//     id: 12,
//     senderId: 2,
//     receiverId: 1,
//     message: "It's going well. Just debugging some issues.",
//     timestamp: "2024-02-11T10:41:00Z",
//   },
//   {
//     id: 13,
//     senderId: 1,
//     receiverId: 2,
//     message: "Need any help with that?",
//     timestamp: "2024-02-11T10:42:00Z",
//   },
//   {
//     id: 14,
//     senderId: 2,
//     receiverId: 1,
//     message: "Not right now, but I’ll ask if I do!",
//     timestamp: "2024-02-11T10:43:00Z",
//   },
//   {
//     id: 15,
//     senderId: 1,
//     receiverId: 2,
//     message: "Sounds good! Keep me posted.",
//     timestamp: "2024-02-11T10:44:00Z",
//   },
// ];

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

  useQuery(["messages", conversationId], {
    queryFn: () => getMessage({ conversationId }),
    onSuccess: (data) => {
      // console.log(data);
      dispatch(addMessage(data));
    },
  });

  useEffect(() => {
    if (isLogin && user?.id) {
      socket?.emit("joinConversation", conversationId);
      socket?.on("newMessage", (data) => {
        console.log(data);
        dispatch(pushMessage(data));
      });
      // socket.on("userIsTyping", ({ senderId }) => {
      //   console.log(senderId);
      //   setUseTyping({ senderId });
      // });
      socket?.on("ErrorSendMessage", () => {
        dispatch(popMessage());
      });
    }
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
  return (
    <div className="relative w-full sm:flex flex-col justify-between hidden border-inherit overflow-y-auto">
      <div className="sticky top-0 bg-[#fff9f3] dark:bg-black z-20 flex justify-end w-full  py-5 px-7  shadow-md">
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
        {/* <div className="m-auto flex flex-col w-20">
          {messages.map((data, idx) => {
            return <p key={idx}>{data.message}</p>;
          })}
        </div> */}
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
