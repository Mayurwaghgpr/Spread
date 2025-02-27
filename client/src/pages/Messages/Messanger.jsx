import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import MessageLog from "./MessageLog";
const BASE_URL = import.meta.env.VITE_BASE_URL;

function Messanger() {
  const navigate = useNavigate();

  return (
    <section className="h-screen w-full border-inherit ">
      <div className=" fixed w-full flex h-full border-y border-inherit ">
        <MessageLog />
        <div className="relative w-full max-h-screen sm:flex flex-col justify-between hidden  border-inherit">
          <Outlet />
        </div>
      </div>
    </section>
  );
}

export default Messanger;
