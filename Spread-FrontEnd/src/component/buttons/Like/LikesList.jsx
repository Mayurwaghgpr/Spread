import React, { memo } from "react";

import useLikeIcons from "./useLikeIcons";
function LikesList({ mutate, post }) {
  const likeIconObj = useLikeIcons();
  return (
    <div className="absolute hidden *:transition-all *:duration-300  group-hover:flex justify-start *:text-xl sm:text-xl items-center shadow-xl z-10 -top-12  -left-1/2 bg-[#e8e4df] dark:bg-[#191818] gap-2 p-2 rounded-full">
      <button
        name="like"
        onMouseOut={(e) => e.stopPropagation()}
        onClick={mutate}
        className=" before:hidden hover:before:flex before:justify-center before:items-center before:h-4 before:text-[.6rem] before:px-1  before:content-['like'] before:bg-black dark:before:bg-white dark:before:text-black  before:text-white before:bg-opacity-50 before:absolute before:-top-7  before:rounded-lg  hover:-translate-y-5 cursor-pointer hover:scale-150 bg-white dark:bg-[#191818] rounded-full p-2"
      >
        {likeIconObj.like}
      </button>
      <button
        name="cheer"
        onMouseOut={(e) => e.stopPropagation()}
        onClick={mutate}
        className=" before:hidden  hover:before:flex before:justify-center before:items-center before:h-4 before:text-[.6rem] before:px-1  before:content-['cheer'] before:bg-black dark:before:bg-white dark:before:text-black  before:text-white before:bg-opacity-50 before:absolute before:-top-7  before:rounded-lg  hover:-translate-y-5 cursor-pointer hover:scale-150 bg-white dark:bg-[#191818] rounded-full p-2"
      >
        {likeIconObj.cheer}
      </button>
      <button
        name="celebration"
        onMouseOut={(e) => e.stopPropagation()}
        onClick={mutate}
        className=" before:hidden hover:before:flex before:justify-center before:items-center before:h-4  before:text-[.6rem] before:px-1  before:content-['celebration'] before:bg-black dark:before:bg-white dark:before:text-black before:text-white before:bg-opacity-50 before:absolute before:-top-7  before:rounded-lg  hover:-translate-y-5 cursor-pointer hover:scale-150 bg-white dark:bg-[#191818] rounded-full p-2"
      >
        {likeIconObj.celebration}
      </button>
      <button
        name="appreciate"
        onMouseOut={(e) => e.stopPropagation()}
        onClick={mutate}
        className=" before:hidden hover:before:flex before:justify-center before:items-center  before:h-4  before:text-[.6rem] before:px-1  before:content-['appriciate'] before:bg-black dark:before:bg-white dark:before:text-black before:text-white before:bg-opacity-50 before:absolute before:-top-7  before:rounded-lg  hover:-translate-y-5 cursor-pointer hover:scale-150 bg-white dark:bg-[#191818] rounded-full p-2"
      >
        {likeIconObj.appreciate}
      </button>
      <button
        name="helpfull"
        onMouseOut={(e) => e.stopPropagation()}
        onClick={mutate}
        className=" before:hidden hover:before:flex before:justify-center before:items-center  before:h-4  before:text-[.6rem] before:px-1  before:content-['helpfull'] before:bg-black dark:before:bg-white dark:before:text-black before:text-white before:bg-opacity-50 before:absolute before:-top-7  before:rounded-lg  hover:-translate-y-5 cursor-pointer hover:scale-150 bg-white dark:bg-[#191818] rounded-full p-2"
      >
        {likeIconObj.helpfull}
      </button>
      <button
        name="smile"
        onMouseOut={(e) => e.stopPropagation()}
        onClick={mutate}
        className=" before:hidden hover:before:flex before:justify-center before:items-center  before:h-4  before:text-[.6rem] before:px-1  before:content-['smile'] before:bg-black dark:before:bg-white dark:before:text-black before:text-white before:bg-opacity-50 before:absolute before:-top-7  before:rounded-lg  hover:-translate-y-5 cursor-pointer hover:scale-150 bg-white dark:bg-[#191818] rounded-full p-2"
      >
        {likeIconObj.smile}
      </button>
    </div>
  );
}

export default memo(LikesList);
