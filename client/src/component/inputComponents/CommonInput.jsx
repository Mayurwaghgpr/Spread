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
        <label htmlFor={Iname} className=" cursor-pointer">
          {labelname}
        </label>
      )}
      <div className={className}>
        <input
          ref={ref}
          type={type}
          id={Iname}
          name={Iname}
          className={`${IClassName} p-2 bg-inherit border-inherit w-full h-full `}
          placeholder={placeholder}
          disabled={disabled}
          {...props}
        />
        {comp}
      </div>
    </>
  );
});

export default memo(CommonInput);
