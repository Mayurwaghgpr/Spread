import React from "react";
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
    <section className="sm:flex w-full animate-fedin.2s relative justify-start z-50 h-screen   items-center flex-col top-0 left-0 bottom-0 right-0 overflow-scroll  bg-[#fff9f3] dark:bg-black  dark:*:border-[#383838]">
      {(isError || validation) && (
        <div className="text-red-500 my-4 w-full flex justify-center bg-red-100 py-2">
          {error?.response?.data.message || validation}
        </div>
      )}

      <button
        onClick={() => navigate(-1)}
        className=" text-3xl absolute top-0 p-4 right-3"
        aria-label="Close"
      >
        <i className="bi bi-x-lg"></i>
      </button>

      <div className="flex flex-col justify-between gap-3 p-7 min-w-[300px] sm:w-[500px] h-full rounded-xl  dark:bg-inherit *:border-inherit ">
        <header className="text-4xl mt-2 text-center flex justify-center items-center">
          {"Spread"}
        </header>

        <div className="flex flex-col justify-center h-full w-full px-5 *:border-inherit">
          <h1 className="text-2xl py-5 text-center font-medium">{heading}</h1>
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
