import React, { memo } from "react";

function Spinner({ className }) {
  return (
    <div className={`loader ${className}`}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

export default memo(Spinner);
