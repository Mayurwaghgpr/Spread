import React from "react";
import TopicsSkeletonLoader from "../loaders/TopicsSkeletonLoader";
import PeoplesList from "../PeoplesList";
import FollowPeopleLoader from "../loaders/FollowPeopleLoader";

function Aside({
  FechingPreps,
  isLoadingPreps,
  PrepsData,
  className,
  handleTopicClick,
}) {
  return (
    <aside className={`${className}`}>
      <div className="flex flex-col w-full p-6 items-center text-start gap-2 border rounded-xl border-inherit">
        <h1 className="font-normal text-start w-full sm:text-sm lg:text-md xl:text-lg">
          Suggested topics
        </h1>
        <div className="flex justify-center items-start w-full flex-col">
          <ul className="flex justify-start flex-wrap gap-2">
            {PrepsData?.topics?.map(({ topic }, index) => (
              <li
                key={index}
                className="text-[14px] font-normal rounded-full dark:bg-gray-600 bg-gray-100 px-3 py-1"
              >
                <button
                  className="t-btn"
                  onClick={() => handleTopicClick(topic)}
                  aria-label={`Select topic ${topic}`}
                >
                  <span>{topic}</span>
                </button>
              </li>
            ))}
            {FechingPreps && <TopicsSkeletonLoader />}
          </ul>
        </div>
      </div>
      <div className="sticky flex flex-col justify-start min-h-[23rem] top-16 border rounded-xl p-5 border-inherit">
        <div className="h-full text-sm">
          <h1 className="font-normal text-start w-full sm:text-sm lg:text-md xl:text-lg">
            Follow People
          </h1>
          {!FechingPreps ? (
            <ul className="py-3 w-full flex flex-wrap gap-3">
              {PrepsData?.AllSpreadUsers?.map((el, index) => (
                <PeoplesList key={el.id} people={el} index={index} />
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
      </div>
    </aside>
  );
}

export default Aside;
