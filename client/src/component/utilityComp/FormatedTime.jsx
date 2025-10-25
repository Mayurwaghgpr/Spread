import { format } from "date-fns";
import React, { memo } from "react";

function FormatedTime({ date, className, content, formate }) {
  return (
    <span className={`${className}  opacity-50 `}>
      {content}{" "}
      {date ? format(new Date(date), formate || "dd-MM-yyyy") + "" : ""}
    </span>
  );
}

export default memo(FormatedTime);
