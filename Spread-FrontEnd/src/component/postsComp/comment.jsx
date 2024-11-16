import React, { memo, useEffect } from "react";
import { useSelector } from "react-redux";

function Comment({ setOpenComments }) {
  const { isLogin, user } = useSelector((state) => state.auth);
  return (
    <section
      onClick={({ target }) => setOpenComments(false)}
      className="flex justify-end  w-full right-1 bg-black bg-opacity-10 shadow h-full fixed top-0 z-40 "
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white h-full w-[430px] p-5 overflow-auto"
      >
        <h1 className="text-xl">Comments</h1>
        <div className=" w-full shadow-xl  p-1 rounded-xl">
          <div className="flex p-3 justify-start items-center gap-3 text-sm">
            <span className="w-10 h-10 rounded-full ">
              {" "}
              <img
                className="w-full h-full object-cover object-top rounded-full"
                src={`${import.meta.env.VITE_BASE_URL}/${user?.userImage}`}
                alt={user.username}
              />
            </span>
            <p>{user.username}</p>
          </div>
          <div className="w-full">
            {" "}
            <textarea
              className="w-full h-32 bg-slate-50 rounded-lg outline-none p-3 placeholder:text-center resize-none"
              placeholder="What are your thoughts?"
            ></textarea>
          </div>
          <div className=" flex justify-end p-4 gap-3">
            <span>
              <button className=" border border-inherit py-1 px-2 rounded-full">
                cancle
              </button>
            </span>
            <span>
              <button className=" bg-sky-200  py-1 px-5  rounded-full">
                <i class="bi bi-send-fill"></i>
              </button>
            </span>
          </div>
        </div>
        <section></section>
      </div>
    </section>
  );
}

export default memo(Comment);
