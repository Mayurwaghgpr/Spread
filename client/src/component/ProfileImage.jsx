import React, { memo } from "react";

const ProfileImage = ({ className, image, children, alt, title, ...props }) => {
  return (
    <div
      {...props}
      name="profileBtn"
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
    </div>
  );
};

export default memo(ProfileImage);
