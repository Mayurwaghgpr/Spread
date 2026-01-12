import React from "react";
import Ibutton from "../buttons/Ibutton";
import useIcons from "../../hooks/useIcons";
const SearchBar = ({ className, inputAction, btnAction, ...props }) => {
  const icons = useIcons();
  return (
    <div className={`flex justify-center items-center  ${className}`}>
      <input
        className=" p-2 w-full outline-none bg-inherit"
        placeholder="Search"
        type="search"
        onChange={inputAction}
        {...props}
      />
      <Ibutton className={"p-1 rounded-full"} action={inputAction}>
        {icons["search"]}
      </Ibutton>
    </div>
  );
};

export default SearchBar;
