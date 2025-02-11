import { formatDate, formatDuration, formatters } from "date-fns";
import React from "react";
import {
  BsArrow90DegLeft,
  BsArrowLeft,
  BsPencilSquare,
  BsPlus,
  BsPlusSquare,
  BsSearch,
} from "react-icons/bs";
import FormatedTime from "../../component/UtilityComp/FormatedTime";
import { TbWriting } from "react-icons/tb";
import { IoPersonAddOutline } from "react-icons/io5";
const users = [
  {
    id: 1,
    name: "Mayur Wagh",
    username: "mayur_dev",
    profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
    lastMessage: "Hey, how are you?",
    timestamp: "10:30 AM",
    unreadCount: 2,
    online: true,
  },
  {
    id: 2,
    name: "Priya Sharma",
    username: "priya_s",
    profileImage: "https://randomuser.me/api/portraits/women/2.jpg",
    lastMessage: "Let's catch up later!",
    timestamp: "9:45 AM",
    unreadCount: 1,
    online: false,
  },
  {
    id: 3,
    name: "Rahul Verma",
    username: "rahulv",
    profileImage: "https://randomuser.me/api/portraits/men/3.jpg",
    lastMessage: "Check this out!",
    timestamp: "Yesterday",
    unreadCount: 0,
    online: true,
  },
  {
    id: 4,
    name: "Sneha Kapoor",
    username: "sneha_kapoor",
    profileImage: "https://randomuser.me/api/portraits/women/4.jpg",
    lastMessage: "Good night! 😊",
    timestamp: "Yesterday",
    unreadCount: 3,
    online: false,
  },
  {
    id: 5,
    name: "Amit Patil",
    username: "amitp",
    profileImage: "https://randomuser.me/api/portraits/men/5.jpg",
    lastMessage: "See you soon!",
    timestamp: "2 days ago",
    unreadCount: 0,
    online: false,
  },
  {
    id: 6,
    name: "Neha Gupta",
    username: "neha_g",
    profileImage: "https://randomuser.me/api/portraits/women/6.jpg",
    lastMessage: "Let's meet at 5 PM.",
    timestamp: "3 days ago",
    unreadCount: 5,
    online: true,
  },
  {
    id: 7,
    name: "Vikram Singh",
    username: "vikram_s",
    profileImage: "https://randomuser.me/api/portraits/men/7.jpg",
    lastMessage: "I sent you the file.",
    timestamp: "4 days ago",
    unreadCount: 0,
    online: false,
  },
  {
    id: 8,
    name: "Anjali Mehta",
    username: "anjali_mehta",
    profileImage: "https://randomuser.me/api/portraits/women/8.jpg",
    lastMessage: "Thanks for your help!",
    timestamp: "5 days ago",
    unreadCount: 2,
    online: true,
  },
  {
    id: 9,
    name: "Rohan Joshi",
    username: "rohanj",
    profileImage: "https://randomuser.me/api/portraits/men/9.jpg",
    lastMessage: "Call me when you are free.",
    timestamp: "6 days ago",
    unreadCount: 0,
    online: false,
  },
  {
    id: 10,
    name: "Simran Kaur",
    username: "simran_k",
    profileImage: "https://randomuser.me/api/portraits/women/10.jpg",
    lastMessage: "Missed your call, call me back.",
    timestamp: "1 week ago",
    unreadCount: 1,
    online: false,
  },
  {
    id: 11,
    name: "Rajesh Pandey",
    username: "rajesh_p",
    profileImage: "https://randomuser.me/api/portraits/men/11.jpg",
    lastMessage: "Can we reschedule?",
    timestamp: "2 weeks ago",
    unreadCount: 4,
    online: true,
  },
  {
    id: 12,
    name: "Kavita Rao",
    username: "kavita_rao",
    profileImage: "https://randomuser.me/api/portraits/women/12.jpg",
    lastMessage: "I'll get back to you.",
    timestamp: "3 weeks ago",
    unreadCount: 0,
    online: false,
  },
];
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

function Messanger() {
  return (
    <section className="h-screen w-full border-inherit ">
      <div className=" fixed w-full flex  mt-[3.1rem] sm:mt-[4rem] h-full border-y border-inherit ">
        <aside className=" border-r sm:w-[40%] sm:min-w-fit w-full  h-full border-inherit">
          <div>
            <button className=" border-inherit p-4 text-2xl font-bold">
              <BsArrowLeft className="" />
            </button>
          </div>
          <div className="px-5 border-inherit">
            <header className=" flex flex-col gap-7 border-inherit">
              <div className="flex text-lg font-bold justify-between border-inherit">
                {" "}
                <h1>Messages</h1>
                <button className="">
                  {" "}
                  <IoPersonAddOutline />
                </button>
              </div>
              <div className=" flex gap-3 items-center border p-1  rounded-lg border-inherit">
                <div className="p-2">
                  {" "}
                  <BsSearch className="text-[#383838]" />
                </div>

                <input
                  className="  p-1 w-full outline-none  placeholder:text-[#383838] bg-inherit border-inherit "
                  type="search"
                  placeholder="Search"
                  name=""
                  id=""
                />
              </div>
            </header>
            <div className="flex flex-col items-start max-h-screen  gap-7 py-6 px-4 overflow-y-auto no-scrollbar scroll-smooth ">
              {users.map((user) => (
                <div key={user.id} className=" flex items-center gap-3  ">
                  <div>
                    <div className="w-10 h-10">
                      <img
                        className=" w-full h-full object-cover object-center rounded-full"
                        src={user.profileImage}
                        alt={user.name}
                      />
                    </div>
                  </div>
                  <div>
                    {" "}
                    <h2>{user.name}</h2>
                    <div className="flex  items-center text-xs text-black dark:text-opacity-40 dark:text-white text-opacity-40 gap-2">
                      {" "}
                      <p className=" ">{user.lastMessage}</p>
                      {/* <FormatedTime date={user.timestamp} />
                       */}
                      <span>{user.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
        <div className="relative w-full max-h-screen sm:flex flex-col justify-between hidden p-3 overflow-y-auto">
          {messages.map((message) => {
            return (
              <div
                className={`w-fit p-2 text-sm rounded-full my-3 ${
                  message.senderId === 1
                    ? "ml-auto bg-sky-400 text-white"
                    : "mr-auto bg-gray-300 text-black"
                }`}
                key={message.id}
              >
                {message.message}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Messanger;
