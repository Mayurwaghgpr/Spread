import React, { forwardRef, memo } from "react";

const CommonInput = forwardRef(
  (
    {
      label,
      type = "text",
      name,
      value,
      onChange,
      placeholder = "",
      className = "",
      required = false,
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full border-inherit bg-inherit">
        {label && (
          <label
            htmlFor={name}
            className="block mb-1 text-sm font-medium opacity-45"
          >
            {label}
          </label>
        )}
        <div
          className={`relative flex items-center justify-between border-inherit bg-inherit  ${className}`}
        >
          <input
            ref={ref}
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={`px-3 py-2 w-full border-inherit bg-inherit outline-none `}
            {...props}
          />
          {children}
        </div>
      </div>
    );
  }
);

export default memo(CommonInput);
