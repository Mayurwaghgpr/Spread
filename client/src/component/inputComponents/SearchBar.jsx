import React from "react";

const SearchBar = ({ className, inputAction, btnAction, ...props }) => {
  return (
    <div className={className}>
      <input
        className="p-2 w-full outline-none bg-inherit"
        placeholder="Search"
        type="search"
        onChange={inputAction}
        {...props}
      />
      <button onClick={btnAction} className="">
        <i className="bi bi-search"></i>
      </button>
    </div>
  );
};

export default SearchBar;
