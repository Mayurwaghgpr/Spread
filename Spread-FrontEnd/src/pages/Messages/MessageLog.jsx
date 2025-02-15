import React from "react";
import { BsArrowLeft, BsSearch } from "react-icons/bs";
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
function MessageLog() {
  return (
    <aside className=" border-r sm:w-[40%] sm:min-w-fit w-full  h-full border-inherit">
      <div>
        <button
          onClick={() => navigate(-1)}
          className=" border-inherit p-4 text-2xl font-bold"
        >
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
  );
}

export default MessageLog;
