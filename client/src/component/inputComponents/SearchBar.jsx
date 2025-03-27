import React from "react";
import Ibutton from "../buttons/Ibutton";
import useIcons from "../../hooks/useIcons";
const SearchBar = ({ className, inputAction, btnAction, ...props }) => {
  const icons = useIcons();
  return (
    <div className={className}>
      <input
        className="p-2 w-full outline-none bg-inherit"
        placeholder="Search"
        type="search"
        onChange={inputAction}
        {...props}
      />
      <Ibutton action={inputAction} innerText={icons["search"]} />
    </div>
  );
};

export default SearchBar;
