import React from "react";
import { Link } from "react-router-dom";

function Page404(prop) {
  return (
    <div className=" w-full flex justify-center gap-5  items-center flex-col">
      <article className=" w-full flex justify-center  items-center">
        <img src="" alt="" />

        <h1 className=" first-letter:animate-bounce text-5xl  mt-[20%]">
          {prop.msg || "404"}
        </h1>
      </article>
      <span className=" bg-slate-300 px-3 py-2 rounded-lg">
        <Link to={-1}>GO Back</Link>
      </span>
    </div>
  );
}

export default Page404;
