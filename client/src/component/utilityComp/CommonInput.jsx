import React, { forwardRef, memo } from "react";

const CommonInput = forwardRef(function CommonInput(
  {
    className,
    type,
    Iname,
    labelname,
    placeholder,
    IClassName = "outline-none",
    disabled,
    comp,
    ...props
  },
  ref
) {
  return (
    <>
      {labelname && (
        <label htmlFor={Iname} className="w-full cursor-pointer">
          {labelname}
        </label>
      )}
      <div className={className}>
        <div className="flex bg-inherit w-full border-inherit overflow-hidden ">
          <input
            ref={ref}
            type={type}
            id={Iname}
            name={Iname}
            className={`${IClassName} p-2 bg-inherit border-inherit w-full `}
            placeholder={placeholder}
            disabled={disabled}
            {...props}
          />
          {comp}
        </div>
      </div>
    </>
  );
});

export default memo(CommonInput);
