import React, { forwardRef, memo } from "react";

const CommonInput = forwardRef(function CommonInput(
  { className, type, Iname, labelname, disabled, comp, ...props },
  ref
) {
  return (
    <div ref={ref} className={className}>
      <label htmlFor={Iname} className="w-full">
        {labelname}
      </label>
      <div className="flex bg-inherit w-full border-inherit overflow-hidden border-b">
        <input
          ref={ref}
          type={type}
          id={Iname}
          name={Iname}
          className={`p-2 bg-inherit border-inherit  outline-none w-full `}
          // placeholder={Iname}
          disabled={disabled}
          {...props}
        />
        {comp}
      </div>
    </div>
  );
});

export default memo(CommonInput);
