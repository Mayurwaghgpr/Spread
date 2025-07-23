import React from "react";
import { useNavigate } from "react-router-dom";
import useIcons from "../../hooks/useIcons";

function PostBtn({ className, content, disabled }) {
  const navigat = useNavigate();
  const icons = useIcons();

  return (
    <div className={className}>
      {" "}
      <button
        onClick={() => navigat("/write/publish")}
        className="w-full h-full"
        disabled={disabled}
      >
        {icons["sendFi"]}
        {content}
      </button>
    </div>
  );
}

export default PostBtn;
