import React from "react";
import { IoCloseOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";

function AuthFormWrapper({
  children,
  onSubmit,
  formType,
  validation,
  isError,
  error,
  heading,
}) {
  const navigate = useNavigate();
  return (
    <section className="sm:flex w-full animate-fedin.2s relative justify-start items-center flex-col z-50 h-screen  top-0 left-0 bottom-0 right-0 overflow-scroll  bg-[#fff9f3] dark:bg-black  dark:*:border-[#383838]">
      {(isError || validation) && (
        <div className=" flex justify-center w-full bg-red-100 py-2 text-red-500 border-y-2 border-red-600 ">
          {error?.response?.data.message || validation}
        </div>
      )}
      <div className="flex justify-end items-center w-full p-3 ">
        <button
          onClick={() => navigate(-1)}
          className="sm:text-4xl text-xl "
          aria-label="Close"
        >
          <IoCloseOutline />
        </button>
      </div>

      <div className="flex flex-col justify-between gap-3 p-7 min-w-[300px] sm:w-[500px] h-full rounded-xl  dark:bg-inherit *:border-inherit ">
        <header className=" flex justify-center items-center w-full self-end sm:text-4xl text-xl mx-auto text-center ">
          {"Spread"}
        </header>
        <div className="flex flex-col justify-center h-full w-full px-5 *:border-inherit">
          <h1 className="sm:text-2xl text-xl py-5 text-center font-medium">
            {heading}
          </h1>
          <form
            onSubmit={onSubmit}
            className="flex flex-col py-2 w-full gap-2 items-center justify-start  *:border-inherit  sm:text-sm  text-xs "
          >
            {children}
            {formType && (
              <footer className="text-center">
                <small>
                  {formType == "signup"
                    ? "Already have an account?"
                    : " Don't have an Account?"}
                  <Link
                    to={`/auth/${formType == "signup" ? "signin" : "signup"}`}
                    replace={true}
                    className="text-blue-500"
                  >
                    {formType == "signup" ? " Sign In" : " Sign Up"}
                  </Link>
                </small>
              </footer>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

export default AuthFormWrapper;
