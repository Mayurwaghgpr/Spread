import React from "react";
import { Link } from "react-router-dom";

function PostBtn({ className, content }) {
  return (
    <div className={className}>
      {" "}
      <Link to={"/write/publish"} className="w-full h-full">
        {content}
      </Link>
    </div>
  );
}

export default PostBtn;
