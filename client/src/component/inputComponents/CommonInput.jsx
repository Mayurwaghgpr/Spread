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
    children,
    ...props
  },
  ref
) {
  return (
    <div className={className}>
      {labelname && (
        <label htmlFor={Iname} className="w-fit cursor-pointer">
          {labelname}
        </label>
      )}
      <div
        className={`flex border rounded-lg bg-inherit border-inherit w-full ${IClassName}`}
      >
        <input
          ref={ref}
          type={type}
          id={Iname}
          name={Iname}
          className={`peer p-2  bg-inherit border-inherit w-full h-full outline-none `}
          placeholder={placeholder}
          disabled={disabled}
          {...props}
        />
        {children}
      </div>
    </div>
  );
});

export default memo(CommonInput);
