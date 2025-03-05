import { format } from "date-fns";
import React, { memo } from "react";

function FormatedTime({ date, className, content }) {
  return (
    <span className={`${className}  text-opacity-30  dark:text-opacity-40 `}>
      {content} {date ? format(new Date(date), "MMM,yyy") + "" : ""}
    </span>
  );
}

export default memo(FormatedTime);
