import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import userImageSrc from "../utils/userImageSrc";
import { setManuOpen } from "../redux/slices/uiSlice";

const ProfileButton = ({ className, ...props }) => {
  const { isLogin, user } = useSelector((state) => state.auth);
  const [deviceSize, setDeviceSize] = useState();
  const { userImageurl } = userImageSrc(user);
  const dispatch = useDispatch();
  useEffect(() => {
    const handleResize = () => {
      setDeviceSize(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <button
      {...props}
      type="button"
      className={` ${className} flex justify-center items-center  text-sm font-semibold text-gray-900 rounded-full`}
      id="menu-button"
      disabled={deviceSize > 639 ? true : false}
    >
      <img
        className="cursor-pointer h-full w-full object-cover object-top rounded-full "
        src={userImageurl}
        title={user?.name}
        alt={user?.name}
      />
    </button>
  );
};

export default memo(ProfileButton);
