import React, { useState } from "react";

function EyeBtn() {
  const [showPass, setShowPass] = useState(false);
  return (
    <button
      onClick={(e) => {
        setShowPass((prev) => !prev);
        let input = e.currentTarget.previousSibling;
        input.type == "password"
          ? (input.type = "text")
          : (input.type = "password");
      }}
      className="p-1"
      type="button"
    >
      <i className={`bi bi-${showPass ? "eye-slash" : "eye"} `}></i>
    </button>
  );
}

export default EyeBtn;
