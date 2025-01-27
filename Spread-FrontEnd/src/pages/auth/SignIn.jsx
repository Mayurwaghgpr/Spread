import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setIsLogin, setUser } from "../../redux/slices/authSlice";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { LoginUser } from "../../Apis/authapi";
import CommonInput from "../../component/UtilityComp/commonInput";
import OAuth from "./OAuth";
import EyeBtn from "../../component/buttons/EyeBtn";

function SignIn() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [passVisible, setpassVisible] = useState(false);
  const userRef = useRef();

  const { isLogin } = useSelector((state) => state.auth);

  const { isLoading, isSuccess, isError, mutate, error } = useMutation(
    (loginInfo) => LoginUser(loginInfo),
    {
      onSuccess: (response) => {
        const { AccessToken, user } = response;
        if (AccessToken) {
          dispatch(setIsLogin(true));
          queryClient.invalidateQueries({ queryKey: ["loggedInUser"] });
          // dispatch(setUser(user));

          localStorage.setItem("AccessToken", true);
          // localStorage.setItem("userAccount", JSON.stringify(user));
          navigate("/", { replace: true });
        }
      },
    }
  );

  function handleLogin(e) {
    e.preventDefault();
    const fromData = new FormData(e.target);
    const obj = Object.fromEntries(fromData);

    mutate(obj);
  }

  const emailimputCred = {
    className: "mb-4 flex flex-col gap-2 border rounded-lg p-1 ",
    type: "email",
    name: "email",
    labelname: "Email address",
  };

  const passInputCred = {
    className: "mb-4 flex flex-col gap-2 border rounded-lg p-1 ",
    type: "password",
    name: "password",
    labelname: "Password",
    comp: <EyeBtn />,
  };

  if (!isLogin) {
    return (
      <section
        className={`sm:flex relative animate-fedin.2s justify-evenly z-50 items-center h-screen flex-col   top-0 left-0 bottom-0 right-0 bg-[#fff9f3] dark:bg-black   dark:*:border-[#383838] `}
      >
        {isError && (
          <div className="text-red-500 my-4 w-full flex justify-center  bg-red-100 py-2 ">
            {error?.response?.data.message}!
          </div>
        )}
        <button
          onClick={() => navigate(-1)}
          className=" text-3xl absolute  top-0 p-5   right-3 text-shadow text-decoration-none"
          aria-label="Close"
        >
          <i className="bi bi-x-lg"></i>
        </button>

        <div
          className={`flex flex-col justify-between items-center p-8 h-full  min-w-[300px] sm:w-[500px]  transition-all duration-300 delay-150  *:border-inherit `}
        >
          <header className="text-2xl  text-center flex justify-center items-center">
            {"Spread"}
          </header>
          <div className="flex w-full h-full  flex-col justify-center px-5  *:border-inherit">
            <form
              onSubmit={handleLogin}
              className="flex flex-col  justify-center w-full gap-2  border-inheri text-sm  *:border-inherit"
            >
              <h1 className="text-2xl text-center font-medium my-4">Welcome</h1>
              <CommonInput
                ref={userRef}
                className={`${emailimputCred.className} `}
                type={emailimputCred.type}
                name={emailimputCred.name}
                labelname={emailimputCred.labelname}
                disabled={isLoading}
                required
              />
              {passVisible && (
                <CommonInput
                  className={passInputCred.className}
                  type={passInputCred.type}
                  name={passInputCred.name}
                  labelname={passInputCred.labelname}
                  disabled={isLoading}
                  required
                  comp={passInputCred.comp}
                />
              )}
              <div className="mb-4 min-w-[200px] flex justify-between">
                {passVisible && (
                  <small>
                    <Link
                      to="/ForgotPass"
                      onClick={(e) => e.stopPropagation()}
                      state={{ email: userRef.current?.value }}
                    >
                      Forgot Password?
                    </Link>
                  </small>
                )}
              </div>
              <div className="mb-4">
                {passVisible && (
                  <button
                    type="submit"
                    className={` bg-white text-black p-3 w-full  rounded-lg ${
                      isLoading && "cursor-wait "
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Signin"}
                  </button>
                )}
              </div>
            </form>
            {!passVisible && (
              <button
                onClick={(e) => {
                  setpassVisible(true);
                }}
                type="button"
                className={` bg-black text-white dark:bg-white dark:text-black p-3 w-full   rounded-lg ${
                  isLoading && "cursor-wait bg-opacity-40"
                }`}
                disabled={userRef.current?.value}
              >
                Continue
              </button>
            )}

            <div className="mb-3 w-full text-center text-xl flex items-center  *:border-inherit">
              <hr className="flex-1" />
              <p className="mx-2">or</p>
              <hr className="flex-1" />
            </div>
            <div className="mb-4 w-full flex flex-col gap-3  *:border-inherit ">
              <OAuth
                className={
                  "border bg-black text-white dark:bg-white dark:text-black"
                }
                service={"google"}
                icon={<i className="bi bi-google"></i>}
              />
              <OAuth
                className={"bg-black text-white dark:bg-white dark:text-black"}
                service={"github"}
                icon={<i className="bi bi-github"></i>}
              />
            </div>
            <footer className="text-center">
              <small>
                Don't have an Account?{" "}
                <Link
                  to={"/auth/signup"}
                  replace={true}
                  className="text-blue-500"
                >
                  Sign Up
                </Link>
              </small>
            </footer>
          </div>
        </div>
      </section>
    );
  }

  return null;
}

export default SignIn;
