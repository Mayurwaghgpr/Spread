import { format } from "date-fns";
import React from "react";

function FormatedTime({ date, className }) {
  return (
    <span className={`${className}`}>
      {date ? format(new Date(date), "EE") + "" : ""}
    </span>
  );
}

export default FormatedTime;
