import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { PopupBox } from "./PopupBox";
import { setloginPop } from "../../redux/slices/authSlice";

function WelcomeLoginBox() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <PopupBox
      action={() => dispatch(setloginPop(false))}
      className={
        "flex flex-col justify-center gap-4 text-center  items-center p-10 border-inherit max-w-[25rem] min-h-[50%] shadow-lg"
      }
    >
      <h1 className="text-3xl font-semibold">Hey there!</h1>
      <p className="opacity-50 font-light">
        Let start exploring and sharing,Sign In or Sign Up,learn,analyze and
        more
      </p>{" "}
      <Link
        onClick={() => {
          dispatch(setloginPop(false));
        }}
        replace
        className={
          "text-white bg-black dark:bg-white dark:text-black py-2 text-center border-2 hover:opacity-60 border-inherit w-full rounded-full "
        }
        to={"/auth/signIn"}
      >
        Sign In
      </Link>
      <Link
        onClick={() => {
          dispatch(setloginPop(false));
        }}
        className={
          "  text-center py-2 border border-inherit  w-full rounded-full"
        }
        replace
        to={"/auth/signUp"}
      >
        Sign Up
      </Link>
    </PopupBox>
  );
}

export default WelcomeLoginBox;
