import React, { forwardRef, memo } from "react";

const CommonInput = forwardRef(function CommonInput(
  { className, type, Iname, labelname, disabled, ...props },
  ref
) {
  return (
    <div className={className}>
      <label htmlFor={Iname} className=" w-full">
        {labelname}
      </label>
      <input
        ref={ref}
        type={type}
        id={Iname}
        name={Iname}
        className={`p-3 border border-inherit bg-inherit outline-none  rounded-lg `}
        // placeholder={Iname}
        disabled={disabled}
        {...props}
      />
    </div>
  );
});

export default memo(CommonInput);
