import React, { useState } from "react";
import Theme from "./Theme";
import { useSelector } from "react-redux";

function General() {
  return (
    <section className="flex flex-col  bg-inherit px-3">
      {" "}
      <div className=" flex gap-10  bg-inherit items-center">
        <h1 className="" htmlFor="">
          {" "}
          Theme
        </h1>

        <Theme
          className={
            " animate-slide-in-top  bg-inherit border p-2 rounded-lg flex flex-col gap-2 text-sm  border-inherit absolute top-10 w-fit  "
          }
        />
      </div>
    </section>
  );
}

export default General;
