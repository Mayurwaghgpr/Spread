import React, { memo } from "react";

const ProfileImage = ({ className, image, children, alt, title, ...props }) => {
  return (
    <button
      {...props}
      name="profileBtn"
      className={` ${className} rounded-full cursor-pointer flex justify-center items-center hover:opacity-90  `}
    >
      <img
        className=" w-full h-full object-cover object-top rounded-full "
        src={image}
        title={title}
        alt={alt}
        loading="lazy"
      />
      {children}
    </button>
  );
};

export default memo(ProfileImage);
