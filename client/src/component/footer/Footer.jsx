import React from "react";
import { Link } from "react-router-dom";
import useIcons from "../../hooks/useIcons";

function Footer() {
  const icons = useIcons();
  return (
    <footer className="relative bg-gradient-to-r from-amber-900 via-orange-900 to-red-900 text-white py-16 px-4 overflow-hidden">
      <div className=" bg-[radial-gradient(circle_at_50%_50%,rgba(255,249,243,0.1)_0%,transparent_50%)] z-0"></div>
      <div className="relative max-w-6xl mx-auto text-center">
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
            Join the Creative Revolution
          </h3>
          <p className="text-orange-100 max-w-2xl mx-auto">
            Where ideas meet inspiration, and creativity knows no bounds.
          </p>
        </div>
        <div className="border-t border-orange-700 pt-8">
          <p className="text-orange-200">
            &copy; 2024 Spread. Empowering creators worldwide| Developed by
            Mayur Wagh
          </p>
        </div>
      </div>
      <div className=" flex w-fit gap-5 text-xl *:transition-all *:duration-200 ease-linear z-20 ">
        <Link
          className=" hover:scale-110 "
          to="https://github.com/Mayurwaghgpr/Spread"
          target="_blank"
        >
          {icons["github"]}
        </Link>
        <Link
          className=" hover:scale-110"
          to="https://www.linkedin.com/in/mayur-wagh-751b8a24b/"
          target="_blank"
        >
          {" "}
          {icons["linkedLine"]}
        </Link>
        <Link
          className=" hover:scale-110"
          to="https://x.com/mayurwagh152064 "
          target="_blank"
        >
          {" "}
          {icons["XCom"]}
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
