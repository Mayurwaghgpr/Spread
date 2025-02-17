import axios from "axios";
import React, { useEffect, useState } from "react";
import { BsArrowLeft, BsSearch } from "react-icons/bs";
import { IoPersonAddOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ChatApi from "../../Apis/ChatApi";
import { setConversations } from "../../redux/slices/chatSlice";

function MessageLog() {
  const { conversations } = useSelector((state) => state.chat);
  const navigate = useNavigate();
  const { getconversations } = ChatApi();
  const dispatch = useDispatch();
  useEffect(() => {
    getconversations().then((data) => {
      console.log(data);
      dispatch(setConversations(data));
    });
  }, []);
  // console.log(conversations);
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
          {conversations.map((user) => (
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
                  <FormatedTime date={user.timestamp} />
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
