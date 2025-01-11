import React from "react";
import FollowPeopleLoader from "../../component/loaders/FollowPeopleLoader";
import PeoplesList from "../../component/PeoplesList";

function WhoToFollow({ className, PrepsData, FechingPreps }) {
  return (
    <div className={className}>
      <h1 className=" text-start w-full text-xl font-bold"> Follow people </h1>
      {!FechingPreps ? (
        <ul className="py-3 w-full flex flex-wrap gap-3">
          {PrepsData?.AllSpreadUsers?.map((el, index) => (
            <PeoplesList
              className={`w-full`}
              key={el.id}
              people={el}
              index={index}
            />
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
