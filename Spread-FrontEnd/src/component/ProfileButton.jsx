import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import userImageSrc from "../utils/userImageSrc";
import { setManuOpen } from "../redux/slices/uiSlice";

const ProfileButton = ({ className }) => {
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
      onClick={() => dispatch(setManuOpen())}
      type="button"
      className={` ${className} flex justify-center h-[40px] w-[40px] items-center  text-sm font-semibold text-gray-900 rounded-full`}
      id="menu-button"
      disabled={deviceSize > 1023 ? true : false}
    >
      <img
        className="cursor-pointer object-cover object-top rounded-full w-full  h-full"
        src={userImageurl}
        title={user?.name}
        alt={user?.name}
      />
    </button>
  );
};

export default memo(ProfileButton);
