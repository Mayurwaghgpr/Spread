import React, { memo } from "react";

const ProfileImage = ({ className, image, children, alt, title, ...props }) => {
  return (
    <button
      {...props}
      name="profileBtn"
      type="button"
      className={` ${className} cursor-pointer flex justify-center items-center `}
    >
      <img
        className=" w-full h-full  object-cover object-top rounded-full "
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
