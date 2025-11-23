import { memo } from "react";

const TopicsSkeletonLoader = ({ count }) =>
  [...Array(count)].map((_, idx) => (
    <li
      key={idx}
      style={{ width: Math.random() * 60 + 40 + "px", height: "20px" }}
      className="border animate-pulse duration-75 text-sm rounded-2xl  bg-gray-300  dark:bg-gray-300/50 px-2 py-0.5   "
    ></li>
  ));

export default memo(TopicsSkeletonLoader);
