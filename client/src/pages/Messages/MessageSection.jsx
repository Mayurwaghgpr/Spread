import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatApi from "../../Apis/ChatApi";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "react-query";
import useSocket from "../../hooks/useSocket";
import { v4 as uuidv4 } from "uuid";
import MessageBubble from "./components/MessageBubble";
import Spinner from "../../component/loaders/Spinner";
import ProfileImage from "../../component/ProfileImage";
import {
  addMessage,
  popMessage,
  pushMessage,
} from "../../redux/slices/messangerSlice";
import Ibutton from "../../component/buttons/Ibutton";
import useIcons from "../../hooks/useIcons";
import { IoAttach } from "react-icons/io5";
import CommonInput from "../../component/inputComponents/CommonInput";
import { debounce } from "../../utils/debounce";
import FedInBtn from "../../component/buttons/FedInBtn";

function MessageSection() {
  const { isLogin, user } = useSelector((state) => state.auth);
  const { messages, selectedConversation } = useSelector(
    (state) => state.messanger
  );
  const [typingUsers, setTypingUsers] = useState([]);
  const [message, setMessage] = useState("");
  const containerRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const prevMessagesCount = useRef(0);
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get("Id");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getMessage } = ChatApi();
  const { socket } = useSocket();

  const icons = useIcons();
  const conversationData = useMemo(() => {
    if (selectedConversation?.conversationType === "private") {
      const appositeMember = selectedConversation?.members.find(
        (m) => m.id != user.id
      );
      return {
        id: selectedConversation.id,
        image: appositeMember?.userImage || " ",
        groupName: appositeMember?.displayName || "Unknown",
      };
    }
    return selectedConversation || { groupName: "Unknown", image: "" };
  }, [selectedConversation, user?.id]);

  const { isLoading } = useQuery(["messages", conversationId], {
    queryFn: () => getMessage({ conversationId }),
    onSuccess: (data) => {
      dispatch(addMessage(data));
    },
    refetchOnWindowFocus: false,
  });

  const handleUserTyping = useCallback(
    ({ conversationId: convId, senderId, image, typing }) => {
      if (convId === conversationId) {
        setTypingUsers((prev) => [
          ...prev.filter((evn) => evn.senderId !== senderId),
          { senderId, image, typing },
        ]);
      }
    },
    [conversationId]
  );

  // const handleNewMessage = useCallback(
  //   (msg) => {
  //     if (msg.senderId !== user?.id) {
  //       dispatch(pushMessage(msg));
  //       setTypingUsers((prev) =>
  //         prev.filter((evn) => evn.senderId !== msg.senderId)
  //       );
  //     }
  //   },
  //   [dispatch, user?.id]
  // );

  const handleError = useCallback(() => dispatch(popMessage()), [dispatch]);

  useEffect(() => {
    if (isLogin && user?.id && conversationId) {
      socket?.emit("joinConversation", conversationId);
      socket?.on("userIsTyping", handleUserTyping);
      // socket?.on("newMessage", handleNewMessage);
      socket?.on("ErrorSendMessage", handleError);
    }

    return () => {
      socket?.off("userIsTyping", handleUserTyping);
      // socket?.off("newMessage", handleNewMessage);
      socket?.off("ErrorSendMessage", handleError);
    };
  }, [
    isLogin,
    user?.id,
    socket,
    conversationId,
    handleUserTyping,
    // handleNewMessage,
    handleError,
  ]);

  const handleSend = useCallback(() => {
    if (!message.trim()) return;
    const messageObj = {
      id: uuidv4(),
      content: message,
      senderId: user?.id,
      conversationId,
    };
    dispatch(pushMessage(messageObj));
    socket?.emit("sendMessage", messageObj);
    setMessage("");
  }, [message, socket, user?.id, conversationId, dispatch]);
  const sendTypingStatus = useMemo(
    () =>
      debounce((isTyping) => {
        socket?.emit("IamTyping", {
          conversationId,
          senderId: user?.id,
          image:
            conversationData.conversationType === "group"
              ? user?.userImage
              : null,
          typing: isTyping,
        });
      }, 500),
    [
      socket,
      conversationId,
      user?.id,
      user?.userImage,
      conversationData.conversationType,
    ]
  );

  const handleInput = useCallback(
    (e) => {
      setMessage(e.target.value);
      setMessage(e.target.value);
      sendTypingStatus(true);

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      typingTimeoutRef.current = setTimeout(() => {
        sendTypingStatus(false);
      }, 2000);
    },
    [conversationId, socket, user?.id, user?.userImage]
  );

  useEffect(() => {
    if (prevMessagesCount.current !== messages.length) {
      containerRef.current?.scrollTo(0, containerRef.current.scrollHeight);
      prevMessagesCount.current = messages.length;
    }
  }, [messages.length]);

  const isUsersTyping = useMemo(
    () => typingUsers.some((env) => env.senderId !== user?.id && env.typing),
    [typingUsers, user?.id]
  );
  return (
    <div
      className={`relative ${conversationId ? "sm:visible" : "hidden"} grid grid-cols-10 grid-rows-12 w-full h-screen  border-inherit  bg-inherit`}
    >
      <header className="flex justify-between col-span-full  bg-[#fff9f3] dark:bg-black z-20 w-full h-fit py-2 px-7 border-b border-inherit shadow-md">
        <div className="flex justify-start items-center gap-3 w-[80%]">
          <ProfileImage
            onClick={() => navigate(`info?Id=${conversationId}`)}
            className="max-w-10 max-h-10 w-full h-full min-w-fit"
            image={conversationData?.image}
          />
          <div className="flex flex-col items-start justify-center gap-1 overflow-hidden overflow-ellipsis text-nowrap">
            <h1>{conversationData?.groupName}</h1>
            <ul className="flex justify-start items-center gap-2 text-xs opacity-50">
              {conversationData?.members?.some((m) => m.id === user.id) && (
                <li>You</li>
              )}
              {conversationData?.members?.map((member) => (
                <li key={member.id}>{member.username}</li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      <div
        ref={containerRef}
        className="sm:flex flex-col justify-start w-full h-full col-span-full row-start-2 row-span-full  scroll-smooth p-5  border-inherit no-scroll  overflow-y-auto"
      >
        {!isLoading &&
          messages?.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              userId={user.id}
            />
          ))}
        <div className="w-full min-h-16">
          {isUsersTyping && (
            <div className="flex gap-1 my-4">
              {typingUsers.map(
                (usr, idx) =>
                  usr.senderId !== user.id &&
                  usr?.image && (
                    <ProfileImage
                      key={usr.senderId}
                      className="w-6 h-6"
                      image={usr?.image}
                    />
                  )
              )}
              <div className=" relative flex items-center justify-center py-2 px-2 text-sm mt-2 ml-2 bg-[#fffefe]  dark:shadow-white rounded-xl rounded-tl-none">
                <div
                  class="absolute left-[-5px] top-0 -z-[1] w-0 h-0 
                border-t-transparent 
                border-b-[10px] border-b-transparent 
                border-r-[10px] border-r-inherit"
                ></div>
                <span className="typingLoader"></span>
              </div>
            </div>
          )}
        </div>
        {isLoading && (
          <Spinner className="w-10 h-10 bg-black p-1 dark:bg-white m-auto" />
        )}
      </div>
      <div className="flex justify-center items-center col-span-full w-full h-fit border-t sm:px-5 px-2 pt-2 pb-5 border-inherit bg-inherit">
        <div className="relative flex justify-center items-baseline gap-3 p-2  w-4/5 rounded-lg bg-white border dark:bg-opacity-10 border-inherit ">
          <div className="flex justify-start items-center sm:gap-3  w-full border-inherit">
            <div className="flex justify-start items-center gap-2 w-fit border-inherit ">
              <FedInBtn
                className={"sm:text-xl  rounded-full p-2 rouded border"}
              >
                <IoAttach />
              </FedInBtn>
              <FedInBtn className={"sm:text-xl rounded-full p-2 border "}>
                {icons["smile"]}
              </FedInBtn>
            </div>
            <CommonInput
              className="relative px-2 w-full h-full border-inherit border-0  bg-inherit outline-none peer"
              onChange={handleInput}
              value={message}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Start Writting..."
            >
              <div className="absolute w-full bottom-0  transition-transform duration-300 border-t  border-black dark:border-inherit scale-0 peer-focus:scale-100 "></div>
            </CommonInput>
          </div>
          <FedInBtn
            className="flex justify-center items-center text-xl min-w-fit rounded-full p-2"
            action={handleSend}
          >
            {icons["sendO"]}
          </FedInBtn>
        </div>
      </div>
      <Outlet
        context={{
          isGroup: selectedConversation?.conversationType === "group",
          conversationData,
        }}
      />
    </div>
  );
}

export default memo(MessageSection);
