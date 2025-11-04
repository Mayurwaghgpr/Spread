import React from "react";
import ProfileImage from "../../../component/ProfileImage";
import Ibutton from "../../../component/buttons/Ibutton";
import useIcons from "../../../hooks/useIcons";

const SelectedGroupMemberList = ({
  users,
  handleGroupConfig,
  selectedMembers,
}) => {
  const icons = useIcons();
  return (
    <div className="text-start w-full border-inherit h-fit">
      {" "}
      <small className="text-xs"> Members</small>
      <div className="flex justify-start border border-inherit p-5  transition-all duration-200 rounded-lg items-center drop-shadow-lg gap-3 w-full h-fit px-5 overflow-auto scroll-smooth">
        {users?.map((user) => {
          return (
            selectedMembers[user.id] && (
              <ProfileImage
                className={"relative w-10 h-10 animate-fedin.2s"}
                image={user.userImage}
                alt={user.username}
              >
                <Ibutton
                  action={() => handleGroupConfig(user.id)}
                  className="absolute -top-1 -right-1 z-10 text-sm  bg-gray-200 bg-opacity-50 backdrop-blur-sm rounded-full"
                >
                  {icons["close"]}
                </Ibutton>
              </ProfileImage>
            )
          );
        })}
      </div>
    </div>
  );
};

export default SelectedGroupMemberList;
