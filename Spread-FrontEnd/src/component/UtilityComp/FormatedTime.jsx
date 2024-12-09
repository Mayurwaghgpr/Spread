import { format } from "date-fns";
import React from "react";

function FormatedTime({ date, className, content }) {
  return (
    <span className={`${className}`}>
      {content} {date ? format(new Date(date), "MMM,yyy") + "" : ""}
    </span>
  );
}

export default FormatedTime;
