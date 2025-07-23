import React from "react";
import { Link } from "react-router-dom";
import Follow from "../../../component/buttons/follow";
import { useDispatch, useSelector } from "react-redux";
import { setFollowInfo } from "../../../store/slices/profileSlice";
import userImageSrc from "../../../utils/userImageSrc";
import { LuMessagesSquare } from "react-icons/lu";
import FormatedTime from "../../../component/utilityComp/FormatedTime";
import ProfileImage from "../../../component/ProfileImage";
import useIcons from "../../../hooks/useIcons";
import usePrivateChatMutation from "../../../hooks/usePrivateChatMutation";
import AbbreviateNumber from "../../../utils/AbbreviateNumber";
import Ibutton from "../../../component/buttons/Ibutton";
import FedInBtn from "../../../component/buttons/FedInBtn";
import ImageInBigFrame from "../../../component/utilityComp/ImageInBigFrame";
import { setOpenBigFrame } from "../../../store/slices/uiSlice";

const ProfileHeader = React.memo(({ profileId }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { userProfile } = useSelector((state) => state.profile);
  const { userImageurl } = userImageSrc(userProfile);
  const icons = useIcons();
  const { PrivateMutaion, isPrivateLoading } = usePrivateChatMutation();

  const handleBigFrame = () => {
    dispatch(
      setOpenBigFrame({
        src: userImageurl,
        alt: userProfile?.username,
        profile: true,
      })
    );
  };
  return (
    <div className="relative select-none flex flex-col border-b p-2 w-full justify-start  items-basline gap-10 dark:bg-inherit border-inherit px-4">
      <div className="flex justify-start items-start gap-9 border-inherit">
        <div className=" flex  flex-col  items-center justify-center text-center gap-3 ">
          <ProfileImage
            onClick={handleBigFrame}
            className={"sm:w-32 sm:h-32 w-20 h-20"}
            image={userImageurl}
            alt={userProfile?.username}
            title={"user profile"}
          />

          <div className=" w-full">
            <h1 className="sm:text-3xl sm:hidden text-nowrap text-sm  font-medium">
              {userProfile?.displayName}
            </h1>
            <span className="text-black text-xs dark:text-white text-opacity-70 dark:text-opacity-70 ">
              {userProfile?.pronouns}
            </span>
          </div>
        </div>

        <div className="flex sm:flex-row flex-col  justify-between  gap-2   h-full ">
          <div className="flex flex-col gap-1 justify-start  p-4 w-full ">
            {/* <div className="flex justify-start items-center">{}</div> */}
            <h1 className="sm:text-4xl sm:block hidden text-nowrap text-lg  font-medium">
              {userProfile?.displayName}
            </h1>
            <div className="flex justify-start items-center gap-3 text-sm">
              <FedInBtn
                className={"no-underline "}
                action={() =>
                  dispatch(
                    setFollowInfo({
                      Info: "Followers",
                      count: userProfile?.Followers?.length,
                    })
                  )
                }
              >
                <AbbreviateNumber
                  rawNumber={userProfile?.Followers?.length || 0}
                />
                <span>Followers</span>
              </FedInBtn>
              <FedInBtn
                className={"no-underline"}
                action={() =>
                  dispatch(
                    setFollowInfo({
                      Info: "Following",
                      count: userProfile?.Following?.length,
                    })
                  )
                }
              >
                <AbbreviateNumber
                  rawNumber={userProfile?.Following?.length || 0}
                />
                <span> Following</span>
              </FedInBtn>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-start items-center text-sm  w-full  ">
        <p className=" h-full w-full break-words ">{userProfile?.userInfo}</p>
      </div>
      <div className="flex flex-col items-start gap-4 border-inherit text-xl h-full sm:w-fit *:transition-all *:duration-300 ease-linear">
        <FormatedTime
          content={
            <div className="flex justify-start items-center gap-2 text-sm no-underline">
              {icons["calender"]}
              <span>Joined</span>
            </div>
          }
          className={
            "relative text-xs w-fit text-black dark:text-white flex justify-center items-center gap-1  self-start"
          }
          date={user.createdAt}
        />

        {profileId !== user.id ? (
          <div className="flex justify-start items-center gap-4 w-full sm:text-sm text-xs text-black border-inherit">
            <Follow
              person={userProfile}
              className={`flex justify-center items-center w-full sm:min-w-32 sm:h-9 h-6 p-3 py-2 border border-inherit  rounded-xl `}
            />
            <Ibutton
              action={() => PrivateMutaion(userProfile?.id)}
              className="w-full bg-white px-3 py-2.5 rounded-xl border  "
            >
              <LuMessagesSquare />
            </Ibutton>
          </div>
        ) : (
          <div className="">
            <Link
              to="/profileEditor"
              className="text-end text-xs w-fit rounded-lg transition-colors duration-300 text-blue-600  "
            >
              Edite profile
            </Link>
          </div>
        )}
      </div>
    </div>
  );
});

export default ProfileHeader;
