import React from "react";

function Selector({ name, setOptions, options, className, defaultValue }) {
  return (
    <select
      name={name}
      defaultValue={defaultValue}
      onChange={(e) => setOptions(e)}
      className={className}
    >
      {options.map((option) => (
        <option
          className="w-full bg-inherit bg-red-600 text-inherit"
          key={option}
          value={option}
        >
          {option}
        </option>
      ))}
    </select>
  );
}

export default Selector;
