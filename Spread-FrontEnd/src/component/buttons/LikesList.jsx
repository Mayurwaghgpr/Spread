import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { BsHandThumbsUp } from "react-icons/bs";
import { MdCelebration, MdOutlineCelebration } from "react-icons/md";
import { IoHappyOutline } from "react-icons/io5";
// import { LuThumbsUp } from "react-icons/lu";
import { PiHandsClappingLight } from "react-icons/pi";
import { MdAutoAwesome } from "react-icons/md";
function LikesList({ setShowList }) {
  return (
    <div className="absolute *:transition-all *:duration-300  flex justify-start text-2xl items-center shadow-xl z-10 -top-11  -left-10 bg-[#e8e4df] dark:bg-[#191818] gap-2 p-2 rounded-full">
      <div
        onClick={() => setShowList("")}
        className=" before:hidden  hover:before:flex before:justify-center before:items-center before:h-4 before:text-[.6rem] before:px-1  before:content-['like'] before:bg-black dark:before:bg-white dark:before:text-black  before:text-white before:bg-opacity-50 before:absolute before:-top-7  before:rounded-lg  hover:-translate-y-5 cursor-pointer hover:scale-125 bg-white dark:bg-[#191818] rounded-full p-2"
      >
        <BsHandThumbsUp />
      </div>
      <div
        onClick={() => setShowList("")}
        className=" before:hidden  hover:before:flex before:justify-center before:items-center before:h-4 before:text-[.6rem] before:px-1  before:content-['cheer'] before:bg-black dark:before:bg-white dark:before:text-black  before:text-white before:bg-opacity-50 before:absolute before:-top-7  before:rounded-lg  hover:-translate-y-5 cursor-pointer hover:scale-125 bg-white dark:bg-[#191818] rounded-full p-2"
      >
        <PiHandsClappingLight />
      </div>
      <div
        onClick={() => setShowList("")}
        className=" before:hidden hover:before:flex before:justify-center before:items-center before:h-4  before:text-[.6rem] before:px-1  before:content-['celebration'] before:bg-black dark:before:bg-white dark:before:text-black before:text-white before:bg-opacity-50 before:absolute before:-top-7  before:rounded-lg  hover:-translate-y-5 cursor-pointer hover:scale-125 bg-white dark:bg-[#191818] rounded-full p-2"
      >
        <MdOutlineCelebration />
      </div>
      <div
        onClick={() => setShowList("")}
        className=" before:hidden hover:before:flex before:justify-center before:items-center  before:h-4  before:text-[.6rem] before:px-1  before:content-['appriciate'] before:bg-black dark:before:bg-white dark:before:text-black before:text-white before:bg-opacity-50 before:absolute before:-top-7  before:rounded-lg  hover:-translate-y-5 cursor-pointer hover:scale-125 bg-white dark:bg-[#191818] rounded-full p-2"
      >
        <MdAutoAwesome />
      </div>
      <div
        onClick={() => setShowList("")}
        className=" before:hidden hover:before:flex before:justify-center before:items-center  before:h-4  before:text-[.6rem] before:px-1  before:content-['smile'] before:bg-black dark:before:bg-white dark:before:text-black before:text-white before:bg-opacity-50 before:absolute before:-top-7  before:rounded-lg  hover:-translate-y-5 cursor-pointer hover:scale-125 bg-white dark:bg-[#191818] rounded-full p-2"
      >
        <IoHappyOutline />
      </div>
    </div>
  );
}

export default LikesList;
