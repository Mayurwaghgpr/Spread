import React, { memo } from "react";

import useIcons from "../../../hooks/useIcons";
function LikesList({ mutate, post }) {
  const icons = useIcons();
  return (
    <div className="absolute hidden *:transition-all *:duration-300  group-hover:flex justify-start *:text-xl sm:text-xl items-center shadow-xl z-10 -top-12  -left-1/2 bg-[#e8e4df] dark:bg-[#191818] gap-2 p-2 rounded-full">
      <button
        name="like"
        onMouseOut={(e) => e.stopPropagation()}
        onClick={mutate}
        className=" before:hidden hover:before:flex before:justify-center before:items-center before:h-4 before:text-[.6rem] before:px-1  before:content-['like'] before:bg-black dark:before:bg-white dark:before:text-black  before:text-white before:bg-opacity-50 before:absolute before:-top-7  before:rounded-lg  hover:-translate-y-5 cursor-pointer hover:scale-150 bg-white dark:bg-[#191818] rounded-full p-2"
      >
        {icons.like}
      </button>
      <button
        name="cheer"
        onMouseOut={(e) => e.stopPropagation()}
        onClick={mutate}
        className=" before:hidden  hover:before:flex before:justify-center before:items-center before:h-4 before:text-[.6rem] before:px-1  before:content-['cheer'] before:bg-black dark:before:bg-white dark:before:text-black  before:text-white before:bg-opacity-50 before:absolute before:-top-7  before:rounded-lg  hover:-translate-y-5 cursor-pointer hover:scale-150 bg-white dark:bg-[#191818] rounded-full p-2"
      >
        {icons.cheer}
      </button>
      <button
        name="celebration"
        onMouseOut={(e) => e.stopPropagation()}
        onClick={mutate}
        className=" before:hidden hover:before:flex before:justify-center before:items-center before:h-4  before:text-[.6rem] before:px-1  before:content-['celebration'] before:bg-black dark:before:bg-white dark:before:text-black before:text-white before:bg-opacity-50 before:absolute before:-top-7  before:rounded-lg  hover:-translate-y-5 cursor-pointer hover:scale-150 bg-white dark:bg-[#191818] rounded-full p-2"
      >
        {icons.celebration}
      </button>
      <button
        name="appreciate"
        onMouseOut={(e) => e.stopPropagation()}
        onClick={mutate}
        className=" before:hidden hover:before:flex before:justify-center before:items-center  before:h-4  before:text-[.6rem] before:px-1  before:content-['appriciate'] before:bg-black dark:before:bg-white dark:before:text-black before:text-white before:bg-opacity-50 before:absolute before:-top-7  before:rounded-lg  hover:-translate-y-5 cursor-pointer hover:scale-150 bg-white dark:bg-[#191818] rounded-full p-2"
      >
        {icons.appreciate}
      </button>
      <button
        name="helpfull"
        onMouseOut={(e) => e.stopPropagation()}
        onClick={mutate}
        className=" before:hidden hover:before:flex before:justify-center before:items-center  before:h-4  before:text-[.6rem] before:px-1  before:content-['helpfull'] before:bg-black dark:before:bg-white dark:before:text-black before:text-white before:bg-opacity-50 before:absolute before:-top-7  before:rounded-lg  hover:-translate-y-5 cursor-pointer hover:scale-150 bg-white dark:bg-[#191818] rounded-full p-2"
      >
        {icons.helpfull}
      </button>
      <button
        name="smile"
        onMouseOut={(e) => e.stopPropagation()}
        onClick={mutate}
        className=" before:hidden hover:before:flex before:justify-center before:items-center  before:h-4  before:text-[.6rem] before:px-1  before:content-['smile'] before:bg-black dark:before:bg-white dark:before:text-black before:text-white before:bg-opacity-50 before:absolute before:-top-7  before:rounded-lg  hover:-translate-y-5 cursor-pointer hover:scale-150 bg-white dark:bg-[#191818] rounded-full p-2"
      >
        {icons.smile}
      </button>
    </div>
  );
}

export default memo(LikesList);
