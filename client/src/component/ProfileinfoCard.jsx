import React, { useEffect } from "react";
import PeoplesList from "./PeoplesList";
import { useDispatch, useSelector } from "react-redux";
import { setFollowInfo } from "../redux/slices/profileSlice";
import { createPortal } from "react-dom";
import { useQuery } from "react-query";
import FollowPeopleLoader from "./loaders/FollowPeopleLoader";
import useProfileApi from "../Apis/ProfileApis";
import Follow from "./buttons/follow";
import { useNavigate } from "react-router-dom";

function ProfileinfoCard({ className }) {
  const dispatch = useDispatch();
  const { fetchFollowInfo } = useProfileApi();
  const { userProfile, FollowInfo } = useSelector((state) => state.profile);
  const navigate = useNavigate();
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
        className={`flex flex-col justify-start gap-10 sm:w-1/3 w-full sm:h-full h-[80%] p-8 bg-light dark:bg-dark border dark:border-[#383838] sm:animate-slide-in-right animate-slide-in-bottom  sm:rounded-xl  overflow-hidden `}
      >
        <h1 className="text-2xl ">{FollowInfo.Info}</h1>
        <div className="relative h-full drop-shadow-sm">
          {!isLoading ? (
            data?.length ? (
              <ul className="flex flex-col items-start w-full   gap-4 min-h-full">
                {data.map((followings, idx) => (
                  <PeoplesList
                    className={
                      " flex justify-between items-center w-full text-nowrap"
                    }
                    key={`${followings.id}-${idx}`} // Ensure unique key
                    people={followings}
                    index={idx}
                    action={() =>
                      navigate(
                        `/profile/@${followings?.username}/${followings?.id}`
                      )
                    }
                  >
                    {" "}
                    <Follow
                      People={followings}
                      className="text-black min-h-8 min-w-[6.7rem] border p-1 flex justify-center items-center transition-all px-5 duration-100 bg-white hover:bg-gray-300 rounded-full"
                    />
                  </PeoplesList>
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
