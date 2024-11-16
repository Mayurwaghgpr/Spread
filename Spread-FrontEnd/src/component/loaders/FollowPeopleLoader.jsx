import React, { memo } from "react";

const FollowPeopleLoader = ({ items, className }) => (
  <ul className={` w-full `}>
    {[...Array(items)].map((_, index) => (
      <li key={index} className={`${className}`}>
        <div className="h-full w-14 rounded-full bg-slate-300 animate-pulse"></div>
        <h1 className="h-full w-full bg-slate-300 animate-pulse rounded-full"></h1>
        <div className="h-full w-24 bg-slate-300 animate-pulse rounded-full"></div>
      </li>
    ))}
  </ul>
);

export default memo(FollowPeopleLoader);
