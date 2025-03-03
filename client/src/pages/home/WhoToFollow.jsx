import React from "react";
import FollowPeopleLoader from "../../component/loaders/FollowPeopleLoader";
import PeoplesList from "../../component/PeoplesList";
import Follow from "../../component/buttons/follow";
import { useNavigate } from "react-router-dom";

function WhoToFollow({ className, homeData, FechingPreps }) {
  const navigate = useNavigate();
  return (
    <div className={className}>
      <h1 className=" text-start w-full text-xl font-bold"> Follow people </h1>
      {!FechingPreps ? (
        <ul className="py-3 w-full flex flex-wrap gap-3">
          {homeData?.userSuggetion?.map((el, index) => (
            <PeoplesList
              key={el.id}
              action={() => navigate(`/profile/@${el?.username}/${el?.id}`)}
              people={el}
              index={index}
            >
              {" "}
              <Follow
                People={el}
                className="text-black min-h-8 min-w-[6.7rem] border p-1 flex justify-center items-center transition-all px-5 duration-100 bg-white hover:bg-gray-300 rounded-full"
              />
            </PeoplesList>
          ))}
        </ul>
      ) : (
        <FollowPeopleLoader
          items={4}
          className={"flex h-8 w-full gap-2 my-4  "}
        />
      )}
      <button className="w-full self-center p-1 transition-all ease-in-out duration-300">
        See More
      </button>
    </div>
  );
}

export default WhoToFollow;
