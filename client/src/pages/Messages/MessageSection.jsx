import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { useSearchParams } from "react-router-dom";
import { useQuery } from "react-query";
import useSocket from "../../hooks/useSocket";
import { v4 as uuidv4 } from "uuid";
import MessageBubble from "./components/MessageBubble";
import Spinner from "../../component/loaders/Spinner";
import ProfileImage from "../../component/ProfileImage";

function MessageSection() {
  const { isLogin, user } = useSelector((state) => state.auth);
  const { messages } = useSelector((state) => state.chat);
  const { selectedConversation } = useSelector((state) => state.messanger);
  const [typingUsers, setTypingUsers] = useState([]);
  const [message, setMessage] = useState("");
  const { getMessage } = ChatApi();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get("Id");
  const { socket } = useSocket();
  const containerRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { isLoading } = useQuery(["messages", conversationId], {
    queryFn: () => getMessage({ conversationId }),
    onSuccess: (data) => {
      // console.log(data);
      dispatch(addMessage(data));
    },
  });

  //Set both function so they can be accesible inside cleanUp function in useEffect
  const handleUserTyping = useCallback(
    ({ senderId, image, typing }) => {
      setTypingUsers([
        ...typingUsers.filter((evn) => evn.senderId !== senderId),
        { senderId, image, typing },
      ]);
    },
    [dispatch]
  );

  const handleNewMessage = useCallback(
    (msg) => {
      if (msg.senderId !== user?.id) {
        //Only push incomming message because current user message in already pushed optimisticaly
        dispatch(pushMessage(msg));
        setTypingUsers([
          ...typingUsers.filter((evn) => evn.senderId !== msg.senderId),
        ]);
      }
    },
    [dispatch]
  );
  const handleError = useCallback(() => dispatch(popMessage()), [dispatch]);

  useEffect(() => {
    if (isLogin && user?.id) {
      socket?.emit("joinConversation", conversationId);

      socket?.on("userIsTyping", handleUserTyping);
      socket?.on("newMessage", handleNewMessage);
      socket?.on("ErrorSendMessage", handleError);
    }

    return () => {
      socket?.off("userIsTyping", handleUserTyping);
      socket?.off("newMessage", handleNewMessage);
      socket?.off("ErrorSendMessage", handleError);
    };
  }, [isLogin, user?.id, socket, conversationId]);

  const handleSend = useCallback(async () => {
    if (!message.trim()) return;
    const messageObj = {
      id: uuidv4(),
      content: message,
      senderId: user?.id,
      conversationId,
      createdAt: new Date().toISOString(),
    };
    dispatch(pushMessage(messageObj)); //Optimisticaly pushing message
    socket?.emit("sendMessage", messageObj);
    setMessage("");
  }, [message, socket, user?.id, conversationId]);

  const handleInput = useCallback(
    (e) => {
      setMessage(e.target.value);
      socket?.emit("IamTyping", {
        conversationId,
        senderId: user?.id,
        image: user?.userImage,
        typing: true,
      });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      typingTimeoutRef.current = setTimeout(() => {
        socket?.emit("IamTyping", {
          conversationId,
          senderId: user?.id,
          typing: false,
        });
      }, 2000);
    },
    [conversationId, socket, user?.id]
  );

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  // Setting apposit member name and userImage as groupName and image if conversation is private (one-to-one)
  const conversationData = useMemo(() => {
    if (selectedConversation?.conversationType === "private") {
      const appositeMember = selectedConversation?.members.find(
        (member) => member.id !== user?.id
      );
      return {
        image: appositeMember?.userImage,
        groupName: appositeMember?.displayName,
      };
    }
    return selectedConversation; //Here returnning the converstion as it is group conversation
  }, [selectedConversation, user?.id]);

  const isUsersTyping = useMemo(
    () => typingUsers.some((env) => env.senderId !== user.id && env.typing),
    [typingUsers]
  );
  return (
    <div
      ref={containerRef}
      className="relative w-full sm:flex flex-col justify-between hidden border-inherit overflow-y-auto"
    >
      <div className="sticky top-0 bg-[#fff9f3] dark:bg-black z-20 flex justify-between w-full  py-5 px-7 border-b border-inherit  shadow-md">
        <div className="flex justify-start items-center gap-3 w-[80%]">
          <ProfileImage
            className={"w-10 h-10 min-w-fit"}
            image={conversationData?.image}
          />
          <div className="flex flex-col items-start justify-center gap-1  overflow-hidden  overflow-ellipsis text-nowrap ">
            <h1>{conversationData?.groupName}</h1>
            {selectedConversation?.conversationType === "group" && (
              <ul className="flex items-center gap-1 text-xs  text-black text-opacity-50 dark:bg-white dark:text-opacity-50">
                {selectedConversation?.members.map((member) => (
                  <li className="text-ellipsis" key={member.id}>
                    {member.username},
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
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
        {isUsersTyping && (
          <div className="w-fit flex gap-1  justify-start items-start  my-3 ">
            <div className="flex justify-start items-center -space-x-3">
              {typingUsers.map(
                (usr, idx) =>
                  usr.senderId !== user.id && (
                    <ProfileImage
                      style={{ zIndex: 10 - idx }}
                      key={usr.senderId}
                      className={"w-5 h-5 z-50"}
                      image={usr?.image}
                    />
                  )
              )}
            </div>
            <div
              className={` flex items-center justify-center py-2 px-2 h-fit animate-pop text-sm rounded-2xl  mr-auto bg-[#fffefe]  text-black dark:shadow-white rounded-tl-none`}
            >
              <span className="typingLoader"></span>
            </div>
          </div>
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
