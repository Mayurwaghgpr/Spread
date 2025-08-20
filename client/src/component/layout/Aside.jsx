import React from "react";
import TopicsSkeletonLoader from "../loaders/TopicsSkeletonLoader";
import { Link } from "react-router-dom";
import WhoToFollow from "../../pages/home/WhoToFollow";
import { useSelector } from "react-redux";

function Aside({ className, handleTopicClick }) {
  const { topics, isLoadingHome } = useSelector((state) => state.common);

  return (
    <aside className={`${className}`}>
      <div className="  flex flex-col w-full items-center text-start gap-2 border-inherit ">
        <h1 className=" text-start w-full text-xl font-medium">
          Suggested topics
        </h1>
        <div className="flex justify-center items-start w-full flex-col">
          <ul className="flex justify-start flex-wrap gap-2">
            {topics?.map(({ topic }, index) => (
              <li
                key={index}
                className="rounded-full dark:bg-gray-600 bg-gray-100 px-3 py-1"
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
            {isLoadingHome && <TopicsSkeletonLoader count={10} />}
          </ul>
        </div>
      </div>

      <WhoToFollow
        className={
          " flex flex-col justify-start items-start gap-5 text-sm  border-inherit "
        }
      />
      <small className=" text-[#383838]">
        <Link className="" to="">
          Terms of Service
        </Link>
        <Link className="" to="">
          {" "}
          Privacy Policy
        </Link>{" "}
        © 2024 Spread
      </small>
    </aside>
  );
}

export default Aside;
