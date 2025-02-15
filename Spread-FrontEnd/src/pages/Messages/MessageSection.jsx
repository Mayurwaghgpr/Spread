import { formatDate } from "date-fns";
import React, { useState } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { BsCameraVideo, BsCheck2All } from "react-icons/bs";
import { IoAttachOutline, IoCallOutline } from "react-icons/io5";
import { MdMic } from "react-icons/md";
const messages = [
  {
    id: 1,
    senderId: 1,
    receiverId: 2,
    message: "Hey Priya! How are you?",
    timestamp: "2024-02-11T10:30:00Z",
  },
  {
    id: 2,
    senderId: 2,
    receiverId: 1,
    message: "Hey Mayur! I'm good, how about you?",
    timestamp: "2024-02-11T10:31:00Z",
  },
  {
    id: 3,
    senderId: 1,
    receiverId: 2,
    message: "I'm doing great! What are you up to?",
    timestamp: "2024-02-11T10:32:00Z",
  },
  {
    id: 4,
    senderId: 2,
    receiverId: 1,
    message: "Just working on a project. You?",
    timestamp: "2024-02-11T10:33:00Z",
  },
  {
    id: 5,
    senderId: 1,
    receiverId: 2,
    message: "Building a chat app!",
    timestamp: "2024-02-11T10:34:00Z",
  },
  {
    id: 6,
    senderId: 2,
    receiverId: 1,
    message: "That sounds cool! Need any help?",
    timestamp: "2024-02-11T10:35:00Z",
  },
  {
    id: 7,
    senderId: 1,
    receiverId: 2,
    message: "Yeah, actually. I'm implementing real-time messaging.",
    timestamp: "2024-02-11T10:36:00Z",
  },
  {
    id: 8,
    senderId: 2,
    receiverId: 1,
    message: "WebSockets might be useful. Have you tried them?",
    timestamp: "2024-02-11T10:37:00Z",
  },
  {
    id: 9,
    senderId: 1,
    receiverId: 2,
    message: "Not yet, but I'll check it out. Thanks for the tip!",
    timestamp: "2024-02-11T10:38:00Z",
  },
  {
    id: 10,
    senderId: 2,
    receiverId: 1,
    message: "No problem! Let me know if you need any help.",
    timestamp: "2024-02-11T10:39:00Z",
  },
  {
    id: 11,
    senderId: 1,
    receiverId: 2,
    message: "Will do! By the way, how’s your project going?",
    timestamp: "2024-02-11T10:40:00Z",
  },
  {
    id: 12,
    senderId: 2,
    receiverId: 1,
    message: "It's going well. Just debugging some issues.",
    timestamp: "2024-02-11T10:41:00Z",
  },
  {
    id: 13,
    senderId: 1,
    receiverId: 2,
    message: "Need any help with that?",
    timestamp: "2024-02-11T10:42:00Z",
  },
  {
    id: 14,
    senderId: 2,
    receiverId: 1,
    message: "Not right now, but I’ll ask if I do!",
    timestamp: "2024-02-11T10:43:00Z",
  },
  {
    id: 15,
    senderId: 1,
    receiverId: 2,
    message: "Sounds good! Keep me posted.",
    timestamp: "2024-02-11T10:44:00Z",
  },
];

function MessageSection() {
  // const [messages, setMessage] = useState([]);
  return (
    <div className="relative w-full max-h-screen sm:flex flex-col justify-between hidden  border-inherit  ">
      <div className=" flex justify-end w-full  py-3 px-7  shadow-md">
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
      <div className=" sm:flex flex-col justify-between overflow-y-auto scroll-smooth no-scrollbar px-3 pt-5 pb-32 drop-shadow-xl">
        {messages.map((message) => {
          return (
            <p
              className={` flex flex-col gap-1 w-fit p-2 text-sm rounded-2xl  my-3  ${
                message.senderId === 1
                  ? "ml-auto bg-sky-400 text-white dark:shadow-sky-400 rounded-br-none "
                  : "mr-auto bg-[#fffefe]  items-end text-black dark:shadow-white rounded-bl-none"
              }  `}
              key={message.id}
            >
              <span>{message.message}</span>
              <span className={`   flex   items-center justify-between`}>
                {" "}
                {message.senderId === 1 && <BsCheck2All />}
                <small className="text-[.5rem] text-gray-500 text-opacity-60 ">
                  {formatDate(message.timestamp, "dd/mm/yyy")}
                </small>
              </span>
            </p>
          );
        })}
      </div>
      <div className=" sticky flex justify-center items-center gap-3 bottom-3 p-3 z-10 border-inherit  ">
        <div className="flex border rounded-full bg-white dark:bg-black  overflow-hidden w-1/2 border-inherit">
          <button className="text-2xl p-2">
            <IoAttachOutline />
          </button>
          <input
            className=" w-full h-full  p-3 outline-none bg-inherit"
            type="text"
            name=""
            id=""
            placeholder="start chat"
          />
        </div>
        <div className="flex justify-center items-center gap-3">
          <button className="text-2xl font-light bg-[#fff9f3] p-2 rounded-full dark:bg-black">
            <div class="">
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

export default MessageSection;
