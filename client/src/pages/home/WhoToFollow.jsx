import React from "react";
import FollowPeopleLoader from "../../component/loaders/FollowPeopleLoader";
import PeoplesList from "../../component/PeoplesList";
import Follow from "../../component/buttons/follow";
import { Link, useNavigate } from "react-router-dom";

function WhoToFollow({ className, homeData, isLoadingHome }) {
  const navigate = useNavigate();
  return (
    <div className={className}>
      <h1 className=" text-start  text-xl font-bold"> Follow people </h1>
      {!isLoadingHome ? (
        <ul className="flex flex-wrap gap-5 py-3 w-full">
          {homeData?.userSuggetion?.map((el, index) => (
            <PeoplesList
              key={el.id}
              action={() => navigate(`/profile/@${el?.username}/${el?.id}`)}
              people={el}
              index={index}
              className="flex justify-between w-full"
            >
              {" "}
              <Follow
                People={el}
                className="text-black min-h-4 text-sm border p-1 flex justify-center items-center transition-all px-5 duration-100 bg-white hover:bg-gray-300 rounded-full"
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
      <Link
        to={"/find_peoples"}
        className="w-full self-center p-1 transition-all ease-in-out duration-300"
      >
        See More
      </Link>
    </div>
  );
}

export default WhoToFollow;
