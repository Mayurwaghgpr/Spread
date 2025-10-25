import React from "react";

function DisplayUsername({ username, className = "" }) {
  return (
    <span
      className={`text-sm font-semibold text-gray-800 dark:text-gray-200 ${className}  ${
        !username
          ? " h-4 dark:bg-white bg-black bg-opacity-30 dark:bg-opacity-30  opacity-50 animate-pulse rounded-xl "
          : ""
      }`}
      title={username}
    >
      {username}
    </span>
  );
}

export default DisplayUsername;
