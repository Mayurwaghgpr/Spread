import { memo } from "react";

const TopicsSkeletonLoader = ({ count }) =>
  [...Array(count)].map((_, idx) => (
    <li
      style={{ width: Math.random() * 60 + 40 + "px", height: "20px" }}
      className="border animate-pulse duration-75 text-sm rounded-2xl border-gray-200 bg-gray-300 dark:bg-gray-700 px-2 py-0.5 dark:text-black dark:border-sky-500/15 "
    ></li>
  ));

export default memo(TopicsSkeletonLoader);
