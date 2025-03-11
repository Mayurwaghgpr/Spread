import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import userImageSrc from "../utils/userImageSrc";

const ProfileImage = ({ className, image, children, alt, title, ...props }) => {
  return (
    <button
      {...props}
      name="profileBtn"
      type="button"
      className={` ${className} flex justify-center items-center`}
    >
      <img
        className="cursor-pointer h-full w-full object-cover object-top rounded-full "
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
