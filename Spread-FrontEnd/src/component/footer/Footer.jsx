import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t pt-6 pb-3 w-full border-inherit h-fit">
      <div className="flex  items-center h-full  w-full pr-4">
        <div className="flex justify-center gap-10 items-center w-full">
          <p className="sm:text-sm text-xs ">
            &copy; 2024 Spread | Developed by Mayur Wagh
          </p>
          <div className=" flex w-fit gap-5 text-xl">
            <a href="https://github.com/Mayurwaghgpr" target="_blank">
              <i className="bi bi-github"></i>
            </a>
            <a
              href="https://www.linkedin.com/in/mayur-wagh-751b8a24b/"
              target="_blank"
            >
              {" "}
              <i className="bi bi-linkedin"></i>
            </a>
            <a href="https://x.com/mayurwagh152064 " target="_blank">
              {" "}
              <i className="bi bi-twitter-x"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
