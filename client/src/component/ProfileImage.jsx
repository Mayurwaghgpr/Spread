import React, { memo } from "react";

const ProfileImage = ({ className, image, children, alt, title, ...props }) => {
  return (
    <div
      {...props}
      name="profileBtn"
      className={` ${className} rounded-full cursor-pointer flex justify-center items-center hover:opacity-90  ${
        !image ? "bg-gray-300 dark:bg-gray-700 animate-pulse" : ""
      } `}
    >
      <img
        className=" w-full h-full  object-cover object-top rounded-full "
        src={image}
        title={title}
        alt={alt}
        loading="lazy"
      />
      {children}
    </div>
  );
};

export default memo(ProfileImage);
