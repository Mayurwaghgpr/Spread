import React, { useEffect } from "react";
import PeoplesList from "./PeoplesList";
import { useDispatch, useSelector } from "react-redux";
import { setFollowInfo } from "../redux/slices/profileSlice";
import { createPortal } from "react-dom";
import { useQuery } from "react-query";
import userApi from "../Apis/userApi";
import FollowPeopleLoader from "./loaders/FollowPeopleLoader";

function ProfileinfoCard({ className }) {
  const dispatch = useDispatch();
  const { fetchFollowInfo } = userApi();
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
      className={`flex justify-end items-center bg-black z-50 bg-opacity-20 fixed top-0 sm:py-3 left-0  bottom-0 right-0 ${className}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`dark:bg-[#222222] animate-slide-in-right bg-white rounded-xl sm:mx-2 h-full sm:w-[500px] w-full overflow-hidden `}
      >
        <div className="relative w-full h-16 p-6 text-center text-2xl">
          <h1>{FollowInfo.Info}</h1>
          <span
            onClick={() => dispatch(setFollowInfo(""))}
            className="absolute sm:hidden block top-0 right-0 p-4"
          >
            <i className="bi bi-x-lg"></i>
          </span>
        </div>
        <div className="relative h-full p-5 drop-shadow-2xl">
          {!isLoading ? (
            data?.length ? (
              <ul className="flex w-full flex-col items-start px-2 gap-3 min-h-full">
                {data.map((followings, idx) => (
                  <PeoplesList
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
