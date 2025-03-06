import React from "react";
import { IoClose } from "react-icons/io5";

const SelectedGroupMemberList = ({ users, handleGroupConfig, hashMap }) => {
  return (
    <div className="text-start w-full border-inherit h-full">
      {" "}
      <small className="text-xs"> Members</small>
      <div className="flex justify-start border border-inherit p-5  transition-all duration-200 rounded-lg items-center drop-shadow-lg gap-3 w-full h-fit px-5 overflow-auto scroll-smooth">
        {users?.map((user) => {
          return (
            hashMap[user.id] && (
              <div className="relative w-10 h-10 animate-fedin.2s ">
                <img
                  className="h-full w-full object-cover object-top rounded-full "
                  src={user.userImage}
                  alt={user.username}
                />
                <button
                  onClick={() => handleGroupConfig(user.id)}
                  className="absolute top-0 right-0 z-10 text-sm  bg-gray-200 bg-opacity-50 backdrop-blur-sm rounded-full"
                >
                  <IoClose />
                </button>
              </div>
            )
          );
        })}
      </div>
    </div>
  );
};

export default SelectedGroupMemberList;
