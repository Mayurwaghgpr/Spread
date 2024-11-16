import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className=" border-t pt-6 pb-3 w-full border-inherit   h-16">
      <div className="flex  items-center  w-full pr-4">
        <div className="flex justify-center items-center w-full">
          <p className="sm:text-sm text-xs ">
            &copy; 2024 Spread | Developed by Mayur Wagh
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
