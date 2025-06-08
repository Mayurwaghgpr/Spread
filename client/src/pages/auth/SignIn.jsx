import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setIsLogin, setUser } from "../../store/slices/authSlice.js";
import { useMutation, useQuery, useQueryClient } from "react-query";
import useAuthApi from "../../services/useAuthApi.jsx";
import CommonInput from "../../component/inputComponents/CommonInput.jsx";
import OAuth from "./OAuth";
import EyeBtn from "../../component/buttons/EyeBtn";
import AuthFormWrapper from "./AuthFormWrapper";
import LoaderScreen from "../../component/loaders/loaderScreen";
import { setToast } from "../../store/slices/uiSlice.js";

function SignIn() {
  const [passVisible, setpassVisible] = useState(false);
  const { isLogin } = useSelector((state) => state.auth);
  const userRef = useRef();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { loginUser } = useAuthApi();

  const { isLoading, isSuccess, isError, mutate, error } = useMutation(
    (loginInfo) => loginUser(loginInfo),
    {
      onSuccess: (response) => {
        const { AccessToken, user } = response;
        if (AccessToken) {
          dispatch(
            setToast({ message: "Sign in successfull", type: "success" })
          );
          dispatch(setIsLogin(true));
          localStorage.setItem("AccessToken", true);
          queryClient.invalidateQueries({ queryKey: ["loggedInUser"] });

          // dispatch(setUser(user));
          // localStorage.setItem("userAccount", JSON.stringify(user));
          navigate("/", { replace: true });
        }
      },
      onError: () => {
        dispatch(setToast({ message: "Sign in successfull", type: "success" }));
      },
    }
  );

  function handleLogin(e) {
    e.preventDefault();
    const fromData = new FormData(e.target);
    const obj = Object.fromEntries(fromData);
    mutate(obj);
  }

  if (isLoading) {
    return <LoaderScreen message={"Authenticating please wait"} />;
  }
  if (!isLogin) {
    return (
      <AuthFormWrapper
        className
        onSubmit={handleLogin}
        heading={"Welcome"}
        error={error}
        isError={isError}
        formType={"signin"}
      >
        <CommonInput
          ref={userRef}
          className={`flex justify-start items-start gap-2 border w-full  p-1 bg-inherit`}
          type={"email"}
          name={"email"}
          label={"Email address"}
          disabled={isLoading}
          required
        />
        {passVisible && (
          <CommonInput
            className={
              " flex justify-center items-start gap-2 w-full  p-1  border bg-inherit"
            }
            type={"password"}
            name={"password"}
            label={"Password"}
            disabled={isLoading}
            required
          >
            <EyeBtn />
          </CommonInput>
        )}
        {passVisible && (
          <div className=" flex justify-between mb-4 w-full">
            <small>
              <Link
                to="/forgot/pass"
                onClick={(e) => e.stopPropagation()}
                state={{ email: userRef.current?.value }}
                className=""
              >
                Forgot Password?
              </Link>
            </small>
          </div>
        )}
        <div className="mb-4 w-full">
          {passVisible && (
            <button
              type="submit"
              className={` bg-black text-white  dark:bg-white dark:text-black p-3 w-full  rounded-lg ${
                isLoading && "cursor-wait "
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Signin"}
            </button>
          )}
        </div>
        {!passVisible && (
          <button
            onClick={(e) => {
              setpassVisible(true);
            }}
            type="button"
            className={` bg-black text-white dark:bg-white dark:text-black p-3 w-full   rounded-lg ${
              isLoading && "cursor-wait bg-opacity-40"
            }`}
            disabled={!userRef?.current?.value.trim()}
          >
            Continue
          </button>
        )}

        {!passVisible && (
          <>
            {" "}
            <div className=" w-full text-center text-xl flex items-center  *:border-inherit">
              <hr className="flex-1" />
              <p className="mx-2">or</p>
              <hr className="flex-1" />
            </div>
            <div className="mb-4 w-full flex justify-center items-center text-nowrap gap-3 sm:text-sm  text-xs  *:border-inherit ">
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
          </>
        )}
      </AuthFormWrapper>
    );
  }

  return null;
}

export default SignIn;
