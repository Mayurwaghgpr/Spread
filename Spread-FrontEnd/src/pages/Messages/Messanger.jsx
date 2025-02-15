import React from "react";
import { useNavigate } from "react-router-dom";
import MessageSection from "./MessageSection";
import MessageLog from "./MessageLog";

function Messanger() {
  const navigate = useNavigate();
  return (
    <section className="h-screen w-full border-inherit ">
      <div className=" fixed w-full flex  mt-[3.1rem] sm:mt-[4rem] h-full border-y border-inherit ">
        <MessageLog />
        <MessageSection />
      </div>
    </section>
  );
}

export default Messanger;
