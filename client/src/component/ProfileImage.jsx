import React, { memo } from "react";

const ProfileImage = ({ className, image, children, alt, title, ...props }) => {
  return (
    <div
      {...props}
      name="profileBtn"
      className={` ${className} cursor-pointer flex justify-center items-center hover:opacity-90  ${
        !image
          ? "dark:bg-white bg-black bg-opacity-30 dark:bg-opacity-30 animate-pulse"
          : ""
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
