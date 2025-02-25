import React from "react";
import TopicsSkeletonLoader from "../loaders/TopicsSkeletonLoader";
import PeoplesList from "../PeoplesList";
import FollowPeopleLoader from "../loaders/FollowPeopleLoader";
import { Link } from "react-router-dom";
import WhoToFollow from "../../pages/home/WhoToFollow";

function Aside({
  FechingPreps,
  isLoadingPreps,
  homeData,
  className,
  handleTopicClick,
}) {
  return (
    <aside className={`${className}`}>
      <div className="flex flex-col w-full p-6 items-center text-start gap-2  border-inherit">
        <h1 className=" text-start w-full text-xl font-bold">
          Suggested topics
        </h1>
        <div className="flex justify-center items-start w-full flex-col">
          <ul className="flex justify-start flex-wrap gap-2">
            {homeData?.topics?.map(({ topic }, index) => (
              <li
                key={index}
                className=" rounded-full dark:bg-gray-600 bg-gray-100 px-3 py-1"
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
      <div className="sticky top-[4.3rem] gap-5 flex flex-col justify-start min-h-[23rem]   border-inherit">
        <WhoToFollow
          homeData={homeData}
          className={" text-sm  p-5  border-inherit"}
          FechingPreps={FechingPreps}
        />
        <footer className=" text-[#383838] px-6">
          <Link className="" to="">
            Terms of Service
          </Link>
          <Link className="" to="">
            {" "}
            Privacy Policy
          </Link>{" "}
          © 2024 Spread
        </footer>
      </div>
    </aside>
  );
}

export default Aside;
