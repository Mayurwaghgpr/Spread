import { memo } from "react";

function Spinner({ className = "w-6 h-6" }) {
  return (
    <div className={`loader bg-oplight dark:bg-txtprimary ${className}`}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

export default memo(Spinner);
