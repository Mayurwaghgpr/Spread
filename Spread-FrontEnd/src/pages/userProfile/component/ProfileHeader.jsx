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
    <div className="relative flex flex-col border p-2 py-5   w-full justify-start rounded-lg  items-basline gap-10 dark:bg-inherit dark:border-[#383838] px-4">
      <div className="flex  gap-5 sm:gap-9">
        <div>
          <div className="sm:size-[7rem] siz-[5rem]  ">
            <img
              className=" w-full h-full items-center  cursor-pointer rounded-full   object-cover object-top "
              src={userImageurl}
              alt={userProfile?.username}
            />
          </div>
        </div>

        <div className="flex sm:flex-row flex-col  justify-between w-full  gap-4   h-full sm:text-lg text-xs ">
          <div className="flex flex-col gap-3 w-full ">
            <div className="flex justify-start items-center">
              <div className=" w-full">
                <h1 className="sm:text-4xl text-xl  font-medium">
                  {userProfile?.username}
                </h1>
                <span className="text-black dark:text-white text-opacity-70 dark:text-opacity-70 ">
                  {userProfile.pronouns}
                </span>
              </div>
            </div>
            <div className=" flex text-lg  gap-4 justify-start ">
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
          <div className="flex flex-col  justify  items-start text-sm  w-full  ">
            <p className=" h-full w-full break-words ">
              {userProfile?.userInfo}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col  items-center gap-4 text-xl h-full sm:w-fit *:transition-all *:duration-300 ease-linear">
        <FormatedTime
          content={
            <>
              <i className="bi bi-calendar3 "></i> Joined
            </>
          }
          className={"text-sm w-fit self-start"}
          date={user.createdAt}
        />

        {profileId === user.id ? (
          <Link
            to="/profileEditor"
            className="  text-end text-sm   rounded-lg transition-colors duration-300 text-blue-600 my-2 mx-4"
          >
            Edite profile
          </Link>
        ) : (
          <div className="flex justify-start items-center gap-4 w-full">
            <Follow
              People={userProfile}
              className={`p-3 py-1 flex border w-full min-w-32 h-9 justify-center items-center rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-500 dark:hover:bg-gray-700`}
            />
            <button className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-500 dark:hover:bg-gray-700 px-4 py-1   rounded-full  ">
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
