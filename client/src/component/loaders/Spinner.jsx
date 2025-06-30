import React, { memo } from "react";

function Spinner({ className }) {
  return (
    <div className={`loader bg-black dark:bg-white ${className}`}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

export default memo(Spinner);
