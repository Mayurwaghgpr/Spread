import React from "react";

import { Link } from "react-router-dom";
import Follow from "../../../component/buttons/follow";
import { useDispatch, useSelector } from "react-redux";
import { setFollowInfo } from "../../../redux/slices/profileSlice";
import userImageSrc from "../../../utils/userImageSrc";

const ProfileHeader = React.memo(({ profileId }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { userProfile } = useSelector((state) => state.profile);

  const { userImageurl, IsuserFromOAth } = userImageSrc(userProfile);
  return (
    <div className="flex flex-col justify-evenly dark:bg-inherit  dark:*:border-[#383838] dark:border-[#383838]   ">
      <div className="flex w-full justify-start items-center flex-col gap-2 pt-3  ">
        <div className="relative flex  h-full border p-2 py-5  w-full justify-start rounded-lg  items-basline   gap-5 sm:gap-9 border-inherit px-4">
          <div>
            <div className="lg:min-w-[80px] lg:min-h-[80px] h-[70px] w-[70px]   ">
              <img
                className=" w-full h-full items-center  cursor-pointer rounded-full   object-cover object-top "
                src={userImageurl}
                alt={userProfile?.username}
              />
            </div>
          </div>

          <div className="flex sm:flex-row flex-col  justify-between w-full  gap-4   h-full sm:text-lg text-xs ">
            <div className="flex flex-col gap-3 w-full">
              <div className="flex justify-start items-center min-w-[60%]   ">
                <div className=" w-full">
                  <h1 className="lg:text-3xl  text-sm font-medium">
                    {userProfile?.username}
                  </h1>
                  <span className=" font-light sm:text-md text-xs">
                    {userProfile.pronouns}
                  </span>
                </div>
              </div>
              <div className=" flex  gap-4 justify-start ">
                <button
                  onClick={() =>
                    dispatch(
                      setFollowInfo({
                        Info: "Followers",
                        count: userProfile?.Followers.length,
                      })
                    )
                  }
                  className="flex   justify-start  items-start h-full gap-1 "
                >
                  <span>{userProfile?.Followers.length}</span>
                  <h1>Followers</h1>
                </button>
                <button
                  onClick={() =>
                    dispatch(
                      setFollowInfo({
                        Info: "Following",
                        count: userProfile?.Following.length,
                      })
                    )
                  }
                  className="flex   justify-start  items-start h-full  gap-1   "
                >
                  <span>{userProfile?.Following.length}</span>
                  <h1>Following</h1>
                </button>
              </div>
            </div>
            <div className="flex justify-start  items-center text-sm  w-full  ">
              <p className=" h-full w-full break-words ">
                {userProfile?.userInfo}
              </p>
            </div>
          </div>

          {profileId === user?.id && (
            <Link
              to="/profileEditor"
              className=" absolute top-0 right-0  text-end text-sm   rounded-lg transition-colors duration-300 text-blue-600 my-2 mx-4"
            >
              Edite profile
            </Link>
          )}
        </div>
      </div>
      <div className="px-3 flex justify-between items-center gap-4   py-4 text-sm  min-h-10 h-full font-light   ">
        {profileId !== user.id && (
          <Follow
            People={userProfile}
            className={`sm:w-[150px]  h-9 flex w-full  justify-center items-center      rounded-3xl bg-[#4FB4E3]`}
          />
        )}
        {profileId !== user.id && (
          <button className=" bg-[#4FB4E3] h-10 w-14  text-xl rounded-xl  ">
            <i className="bi bi-envelope"></i>
          </button>
        )}
      </div>
    </div>
  );
});

export default ProfileHeader;
