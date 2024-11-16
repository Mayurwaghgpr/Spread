import React from "react";

function Selector({ setOptions, options, className }) {
  return (
    <select onChange={(e) => setOptions(e.target.value)} className={className}>
      {options.map((option) => (
        <option
          className="w-full bg-inherit bg-red-600 text-inherit"
          key={option.value}
          value={option.value}
        >
          {option.name}
        </option>
      ))}
    </select>
  );
}

export default Selector;
