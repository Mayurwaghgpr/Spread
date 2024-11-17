import React, { forwardRef, memo } from "react";

const CommonInput = forwardRef(function CommonInput(
  { className, type, Iname, labelname, disabled, ...props },
  ref
) {
  return (
    <div ref={ref} className={className}>
      <label htmlFor={Iname} className="w-full">
        {labelname}
      </label>
      <input
        ref={ref}
        type={type}
        id={Iname}
        name={Iname}
        className={`p-3  bg-inherit outline-none w-full rounded-lg `}
        // placeholder={Iname}
        disabled={disabled}
        {...props}
      />
    </div>
  );
});

export default memo(CommonInput);
