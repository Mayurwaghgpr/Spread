import { memo } from "react";

const TopicsSkeletonLoader = ({ count }) =>
  [...Array(count)].map((_, idx) => (
    <li
      key={idx}
      style={{ width: Math.random() * 60 + 40 + "px", height: "20px" }}
      className="border animate-pulse duration-75 text-sm rounded-2xl border-gray-200 bg-gray-300  dark:bg-gray-300/50 px-2 py-0.5  dark:border-gray-500/50 "
    ></li>
  ));

export default memo(TopicsSkeletonLoader);
