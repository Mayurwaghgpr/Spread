import React from "react";
import PeoplesList from "../../component/PeoplesList";
import Follow from "../../component/buttons/follow";
import { Link, useNavigate } from "react-router-dom";

function WhoToFollow({ className, homeData, isLoadingHome }) {
  const navigate = useNavigate();
  return (
    <div className={className}>
      <h1 className=" text-start  text-xl font-medium"> Follow people </h1>
      <ul className="flex flex-wrap gap-5 py-3 w-full">
        {(homeData?.userSuggetion?.length
          ? homeData.userSuggetion
          : Array(3).fill(null)
        ) // To added loading effect if there while fetching
          ?.map((el, index) => (
            <PeoplesList
              key={el?.id | index}
              action={() => navigate(`/profile/@${el?.username}/${el?.id}`)}
              people={el}
              index={index}
              className="flex justify-between w-full"
            >
              {" "}
              <Follow
                People={el}
                className="text-black min-h-4 text-sm border p-1 px-3 flex justify-center items-center transition-all  duration-100 bg-white hover:bg-gray-300 rounded-full"
              />
            </PeoplesList>
          ))}
      </ul>
      <Link
        to={"/suggetions/find_peoples"}
        className="w-full text-blue-500 self-center p-1 transition-all ease-in-out duration-300"
      >
        See More
      </Link>
    </div>
  );
}

export default WhoToFollow;
