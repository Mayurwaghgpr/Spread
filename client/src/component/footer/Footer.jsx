import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className=" w-full border-inherit h-fit">
      <div className="flex  items-center h-full  w-full   pr-4">
        <div className="flex sm:justify-center gap-10 sm:flex-row flex-col justify-start p-4  sm:items-center w-full">
          <p className="sm:text-sm text-xs ">
            &copy; 2024 Spread | Developed by Mayur Wagh
          </p>
          <div className=" flex w-fit gap-5 text-xl *:transition-all *:duration-200 ease-linear ">
            <Link
              className=" hover:scale-110"
              to="https://github.com/Mayurwaghgpr/Spread"
              target="_blank"
            >
              <i className="bi bi-github "></i>
            </Link>
            <Link
              className=" hover:scale-110"
              to="https://www.linkedin.com/in/mayur-wagh-751b8a24b/"
              target="_blank"
            >
              {" "}
              <i className="bi bi-linkedin"></i>
            </Link>
            <Link
              className=" hover:scale-110"
              to="https://x.com/mayurwagh152064 "
              target="_blank"
            >
              {" "}
              <i className="bi bi-twitter-x"></i>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
