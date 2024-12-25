import React from "react";

import { Link } from "react-router-dom";
import Follow from "../../../component/buttons/follow";
import { useDispatch, useSelector } from "react-redux";
import { setFollowInfo } from "../../../redux/slices/profileSlice";
import userImageSrc from "../../../utils/userImageSrc";
import { LuMessageSquarePlus, LuMessagesSquare } from "react-icons/lu";
import FormatedTime from "../../../component/UtilityComp/FormatedTime";

const ProfileHeader = React.memo(({ profileId }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { userProfile } = useSelector((state) => state.profile);

  const { userImageurl, IsuserFromOAth } = userImageSrc(userProfile);
  return (
    <div className="relative select-none flex flex-col border-b p-2 w-full justify-start  items-basline gap-10 dark:bg-inherit dark:border-[#383838] px-4">
      <div className="flex justify-start items-start  gap-9">
        <div className=" flex flex-col gap-5 ">
          <img
            className=" sm:w-[9rem] min-siz-[5rem]  items-center  cursor-pointer rounded-full   object-cover object-top "
            src={userImageurl}
            alt={userProfile?.username}
          />
          <div className=" w-full">
            <h1 className="sm:text-4xl text-nowrap text-lg  font-medium">
              {userProfile?.username}
            </h1>
            <span className="text-black text-xs dark:text-white text-opacity-70 dark:text-opacity-70 ">
              {userProfile.pronouns}
            </span>
          </div>
        </div>

        <div className="flex sm:flex-row flex-col  justify-between w-full  gap-2   h-full sm:text-lg text-xs ">
          <div className="flex flex-col gap-1 justify-start w-full ">
            <div className="px-2">
              <Link
                to="/profileEditor"
                className="  text-end text-xs w-fit   rounded-lg transition-colors duration-300 text-blue-600  "
              >
                Edite profile
              </Link>
            </div>
            <div className="flex justify-start items-center">{}</div>
            <div className=" flex sm:text-lg gap-4 justify-start ">
              <button
                onClick={() =>
                  dispatch(
                    setFollowInfo({
                      Info: "Followers",
                      count: userProfile?.Followers?.length,
                    })
                  )
                }
                className="flex   justify-start  items-start h-full gap-1 "
              >
                <span>{userProfile?.Followers?.length}</span>
                <h1>Followers</h1>
              </button>
              <button
                onClick={() =>
                  dispatch(
                    setFollowInfo({
                      Info: "Following",
                      count: userProfile?.Following?.length,
                    })
                  )
                }
                className="flex   justify-start  items-start h-full  gap-1   "
              >
                <span>{userProfile?.Following?.length}</span>
                <h1>Following</h1>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex   justify-start  items-center text-sm  w-full  ">
        <p className=" h-full w-full break-words ">{userProfile?.userInfo}</p>
      </div>
      <div className="flex flex-col items-start gap-4 border-inherit text-xl h-full sm:w-fit *:transition-all *:duration-300 ease-linear">
        <FormatedTime
          content={
            <div className="">
              <i className="bi bi-calendar text-[.7rem] "></i>{" "}
              <span>Joined</span>
            </div>
          }
          className={
            "relative text-xs w-fit flex justify-center items-center gap-1  self-start"
          }
          date={user.createdAt}
        />

        {profileId !== user.id && (
          <div className="flex justify-start text-xs sm:text-sm items-center gap-4 w-full border-inherit">
            <Follow
              People={userProfile}
              className={`p-3 py-1 flex border border-inherit w-full  sm:min-w-32 sm:h-9 justify-center items-center rounded-xl bg-gray-200 hover:bg-gray-300 dark:bg-gray-500 dark:hover:bg-gray-700`}
            />
            <button className="flex items-center justify-center gap-2 w-full sm:h-9 bg-gray-200 hover:bg-gray-300 dark:bg-gray-500 dark:hover:bg-gray-700 px-3 py-1   rounded-xl  ">
              {/* <i className="bi bi-envelope"></i>
               */}
              <LuMessagesSquare />
              Message
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

export default ProfileHeader;
