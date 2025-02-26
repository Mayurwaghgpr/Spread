import React, { useEffect } from "react";
import PeoplesList from "./PeoplesList";
import { useDispatch, useSelector } from "react-redux";
import { setFollowInfo } from "../redux/slices/profileSlice";
import { createPortal } from "react-dom";
import { useQuery } from "react-query";
import FollowPeopleLoader from "./loaders/FollowPeopleLoader";
import useProfileApi from "../Apis/ProfileApis";

function ProfileinfoCard({ className }) {
  const dispatch = useDispatch();
  const { fetchFollowInfo } = useProfileApi();
  const { userProfile, FollowInfo } = useSelector((state) => state.profile);

  const { data, isLoading } = useQuery({
    queryFn: () =>
      fetchFollowInfo({
        FollowInfo: FollowInfo.Info,
        profileId: userProfile.id,
      }),
  });

  useEffect(() => {
    document.body.classList.add("overflow-hidden");

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  const variants = {
    hidden: { x: "100%" },
    visible: { x: "0%" },
    exit: { x: "100%" },
  };

  return createPortal(
    <div
      onClick={() => dispatch(setFollowInfo(""))}
      className={`flex justify-end items-end bg-black z-50 bg-opacity-20 fixed top-0 left-0  bottom-0 right-0 ${className}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`dark:bg-black border dark:border-[#383838] sm:animate-slide-in-right animate-slide-in-bottom bg-[#fff9f3] sm:rounded-xl  sm:h-full h-[80%] sm:w-1/3 w-full  px-6 overflow-hidden `}
      >
        <h1 className="text-2xl p-2 py-8">{FollowInfo.Info}</h1>
        <div className="relative h-full p-5 drop-shadow-sm">
          {!isLoading ? (
            data?.length ? (
              <ul className="flex w-full flex-col items-start px-2 gap-4 min-h-full">
                {data.map((followings, idx) => (
                  <PeoplesList
                    className={"text-nowrap"}
                    key={`${followings.id}-${idx}`} // Ensure unique key
                    people={followings}
                    index={idx}
                  />
                ))}
              </ul>
            ) : (
              <div className="flex h-full w-full justify-center items-center">
                <h1>No {FollowInfo.Info}</h1>
              </div>
            )
          ) : (
            [...Array(FollowInfo.count)].map((_, idx) => (
              <FollowPeopleLoader
                key={`loader-${idx}`} // Ensure unique key for loaders
                className="w-full h-10 flex justify-center items-center gap-4 my-3"
              />
            ))
          )}
        </div>
      </div>
    </div>,
    document.getElementById("portal")
  );
}

export default ProfileinfoCard;
