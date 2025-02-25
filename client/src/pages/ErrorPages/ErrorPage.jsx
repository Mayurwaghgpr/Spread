import React from "react";
import { Link, useNavigate } from "react-router-dom";

function ErrorPage({ message, statusCode, action }) {
  const navigate = useNavigate();
  return (
    <div className=" flex justify-start items-center flex-col gap-5 h-screen  w-full">
      <article className="flex flex-col justify-center items-center  w-full ">
        <img src="" alt="" />

        <h1 className="first-letter:animate-bounce text-5xl w-fit  mt-[20%]">
          {statusCode || "404"}
        </h1>
        <p>
          {message ||
            "An error occurred while loading content. Please try again later."}
        </p>
      </article>
      <span className=" bg-white text-black px-3 py-2 rounded-lg">
        {action || <button onClick={() => navigate(-1)}>GO Back</button>}
      </span>
    </div>
  );
}

export default ErrorPage;
