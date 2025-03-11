import { format } from "date-fns";
import React, { memo } from "react";

function FormatedTime({ date, className, content, formate }) {
  return (
    <span className={`${className}  text-opacity-30  dark:text-opacity-40 `}>
      {content}{" "}
      {date ? format(new Date(date), formate || "dd/MMM/YYY") + "" : ""}
    </span>
  );
}

export default memo(FormatedTime);
