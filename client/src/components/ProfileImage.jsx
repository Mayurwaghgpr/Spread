import React, { memo } from "react";

const ProfileImage = ({
  as,
  className = "",
  image,
  children,
  alt,
  title,
  ...props
}) => {
  const Component = as || (props.onClick ? "button" : "div");
  const isButton = Component === "button";
  const { disabled, ...restProps } = props;
  const elementProps = isButton ? props : restProps;

  return (
    <Component
      {...elementProps}
      {...(isButton
        ? {
            type: props.type || "button",
            name: props.name || "profileBtn",
          }
        : {})}
      className={`${className} rounded-full flex justify-center items-center ${
        props.onClick ? "cursor-pointer hover:opacity-90" : ""
      }`}
    >
      <img
        className="w-full h-full object-cover object-top rounded-full"
        src={image}
        title={title}
        alt={alt}
        loading="lazy"
      />
      {children}
    </Component>
  );
};

export default memo(ProfileImage);
