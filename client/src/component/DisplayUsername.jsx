import React from "react";

function DisplayUsername({ username, className = "" }) {
  return (
    <span
      className={`text-sm font-semibold text-gray-800 dark:text-gray-200 ${className}`}
      title={username}
    >
      {username}
    </span>
  );
}

export default DisplayUsername;
