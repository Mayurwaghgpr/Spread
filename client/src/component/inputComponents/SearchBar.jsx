import React from "react";

const SearchBar = ({ className, inputAction, btnAction }) => {
  return (
    <div className={className}>
      <input
        className="p-2 w-full outline-none bg-inherit"
        placeholder="Search"
        type="search"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={inputAction}
      />
      <button onClick={btnAction} className="">
        <i className="bi bi-search"></i>
      </button>
    </div>
  );
};

export default SearchBar;
