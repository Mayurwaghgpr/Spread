import React, { useCallback, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setIsLogin } from "../../store/slices/authSlice.js";
import { useMutation, useQueryClient } from "react-query";
import useAuthApi from "../../services/useAuthApi.jsx";
import CommonInput from "../../component/inputComponents/CommonInput.jsx";
import OAuth from "./OAuth";
import EyeBtn from "../../component/buttons/EyeBtn";
import AuthFormWrapper from "./AuthFormWrapper";
import LoaderScreen from "../../component/loaders/loaderScreen";
import { setToast } from "../../store/slices/uiSlice.js";
import { emailRegex } from "../../utils/regex.js";
import CommenAuthBtn from "./components/CommenAuthBtn.jsx";
import Divider from "./components/Divider.jsx";

function SignIn() {
  const [passVisible, setPassVisible] = useState(false);
  const [currentInputValue, setCurrentInputValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { isLogin } = useSelector((state) => state.auth);
  const userRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { loginUser } = useAuthApi();

  // Mutation for login
  const { isLoading, isError, mutate, error } = useMutation(
    (loginInfo) => loginUser(loginInfo),
    {
      onSuccess: (response) => {
        const { AccessToken, user } = response;
        if (AccessToken) {
          dispatch(
            setToast({ message: "Sign in successful", type: "success" })
          );
          dispatch(setIsLogin(true));
          localStorage.setItem("AccessToken", AccessToken); // Store actual token, not boolean
          queryClient.invalidateQueries({ queryKey: ["loggedInUser"] });
          navigate("/", { replace: true });
        }
      },
      onError: (error) => {
        const errorMessage =
          error?.response?.data?.message || "Sign in failed. Please try again.";
        dispatch(setToast({ message: errorMessage, type: "error" })); // Fixed: was showing success on error
      },
    }
  );
  // handleLogin function to manage form submission
  const handleLogin = useCallback(
    (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const credentials = Object.fromEntries(formData);

      // Basic validation
      if (!credentials.email || !credentials.password) {
        dispatch(
          setToast({ message: "Please fill in all fields", type: "error" })
        );
        return;
      }

      mutate(credentials);
    },
    [mutate, dispatch]
  );
  // handleFormChanges function to manage input changes
  const handleFormChanges = useCallback((e) => {
    const value = e.target.value;
    setCurrentInputValue(emailRegex.test(value) ? value : "");
  }, []);
  // handleContinue function to manage the continue button click
  const handleContinue = useCallback(
    (e) => {
      e.preventDefault();
      if (currentInputValue) {
        setPassVisible(true);
      }
    },
    [currentInputValue]
  );

  // Early returns for different states
  if (isLoading) {
    return <LoaderScreen message="Authenticating, please wait..." />;
  }

  return (
    //
    <AuthFormWrapper
      onSubmit={handleLogin}
      heading="SignIn to your account"
      error={error}
      isError={isError}
      formType="signin"
      onChange={handleFormChanges}
    >
      {/* Email Input */}
      <CommonInput
        ref={userRef}
        className="flex justify-start items-start gap-2 border w-full p-1 bg-inherit"
        type="email"
        name="email"
        label="Email address"
        disabled={isLoading}
        required
        autoComplete="email"
        autoFocus
      />
      {/* Password Input */}
      {passVisible && (
        <CommonInput
          className="flex justify-center items-start gap-2 w-full p-1 border bg-inherit "
          type={showPassword ? "text" : "password"}
          name="password"
          label="Password"
          disabled={isLoading}
          required
          autoComplete="current-password"
        >
          <EyeBtn />
        </CommonInput>
      )}

      {passVisible && (
        <div className="flex justify-between mb-4 w-full">
          <small>
            <Link
              to="/forgot/pass"
              onClick={(e) => e.stopPropagation()}
              state={{ email: currentInputValue }}
              className="text-blue-600 hover:text-blue-800 underline dark:text-blue-400 dark:hover:text-blue-300"
            >
              Forgot Password?
            </Link>
          </small>
        </div>
      )}

      <div className="mb-4 w-full">
        {passVisible ? (
          <CommenAuthBtn
            type="submit"
            className={`  ${
              isLoading ? "cursor-wait opacity-50" : "hover:opacity-90"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </CommenAuthBtn>
        ) : (
          <CommenAuthBtn
            onClick={handleContinue}
            disabled={!currentInputValue}
            className={`${
              !currentInputValue ? "cursor-not-allowed " : "hover:opacity-90"
            }`}
          >
            Continue
          </CommenAuthBtn>
        )}
      </div>
      <Divider text="or" className="mb-4" />

      {!passVisible && (
        <>
          <div className="mb-4 w-full flex justify-center items-center text-nowrap gap-3">
            <OAuth
              className="border bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity"
              service="google"
            />
            <OAuth
              className="bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity"
              service="github"
            />
          </div>
        </>
      )}
    </AuthFormWrapper>
  );
}

export default SignIn;
