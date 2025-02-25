import React, { memo } from "react";

const TopicsSkeletonLoader = ({ items }) => (
  <>
    <li className="border w-7  h-6 animate-pulse duration-75 text-sm rounded-2xl border-gray-200 bg-gray-200 px-2 py-0.5 dark:text-black dark:border-sky-500/15 dark:bg-sky-500/10"></li>
    <li className="border w-12  h-6 animate-pulse duration-75 text-sm rounded-2xl border-gray-200 bg-gray-200 px-2 py-0.5 dark:text-black dark:border-sky-500/15 dark:bg-sky-500/10"></li>{" "}
    <li className="border w-20  h-6 animate-pulse duration-75 text-sm rounded-2xl border-gray-200 bg-gray-200 px-2 py-0.5 dark:text-black dark:border-sky-500/15 dark:bg-sky-500/10"></li>
    <li className="border w-14  h-6 animate-pulse duration-75 text-sm rounded-2xl border-gray-200 bg-gray-200 px-2 py-0.5 dark:text-black dark:border-sky-500/15 dark:bg-sky-500/10"></li>{" "}
    <li className="border w-16  h-6 animate-pulse duration-75 text-sm rounded-2xl border-gray-200 bg-gray-200 px-2 py-0.5 dark:text-black dark:border-sky-500/15 dark:bg-sky-500/10"></li>{" "}
    <li className="border w-20  h-6 animate-pulse duration-75 text-sm rounded-2xl border-gray-200 bg-gray-200 px-2 py-0.5 dark:text-black dark:border-sky-500/15 dark:bg-sky-500/10"></li>
    <li className="border w-14  h-6 animate-pulse duration-75 text-sm rounded-2xl border-gray-200 bg-gray-200 px-2 py-0.5 dark:text-black dark:border-sky-500/15 dark:bg-sky-500/10"></li>
    <li className="border w-12  h-6 animate-pulse duration-75 text-sm rounded-2xl border-gray-200 bg-gray-200 px-2 py-0.5 dark:text-black dark:border-sky-500/15 dark:bg-sky-500/10"></li>
  </>
);

export default memo(TopicsSkeletonLoader);
