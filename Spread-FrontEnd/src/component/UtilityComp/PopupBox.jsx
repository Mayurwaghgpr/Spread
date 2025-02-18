import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setloginPop } from "../../redux/slices/authSlice";

export const PopupBox = ({ children, className, heading, subText }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <div
      onClick={() => dispatch(setloginPop(false))}
      className="fixed left-0 right-0 bottom-0 top-0 flex justify-center items-center p-4 bg-black bg-opacity-20 backdrop-blur-[1px] z-50 border-inherit"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${className} bg-[#fff9f3]  dark:bg-black  border border-inherit rounded-lg `}
      >
        <h1 className="text-3xl font-bold">{heading}</h1>
        <p className=" opacity-50">{subText}</p>
        {children}
      </div>
    </div>
  );
};
