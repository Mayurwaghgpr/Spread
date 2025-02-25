import React from "react";
import { Link, useNavigate, useNavigation } from "react-router-dom";

function PostBtn({ className, content, disabled }) {
  const navigat = useNavigate();

  return (
    <div className={className}>
      {" "}
      <button
        onClick={() => navigat("/write/publish")}
        className="w-full h-full"
        disabled={disabled}
      >
        {content}
      </button>
    </div>
  );
}

export default PostBtn;
