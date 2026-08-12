import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setIsLogin } from "../../store/slices/authSlice.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthApi from "../../services/useAuthApi.jsx";
import CommonInput from "../../components/inputComponents/CommonInput.jsx";
import OAuth from "./OAuth";
import EyeBtn from "../../components/buttons/EyeBtn";
import AuthFormWrapper from "./AuthFormWrapper";
import LoaderScreen from "../../components/loaders/loaderScreen";
import { setToast } from "../../store/slices/uiSlice.js";
import CommenAuthBtn from "./components/CommenAuthBtn.jsx";
import Divider from "./components/Divider.jsx";

function SignIn() {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { loginUser } = useAuthApi();

  const {
    isPending: isLoading,
    isError,
    mutate,
    error,
  } = useMutation({
    mutationFn: (loginInfo) => loginUser(loginInfo),
    onSuccess: (response) => {
      const { AccessToken } = response;
      if (AccessToken) {
        dispatch(setToast({ message: "Sign in successful ✨", type: "success" }));
        dispatch(setIsLogin(true));
        localStorage.setItem("AccessToken", AccessToken);
        queryClient.invalidateQueries({ queryKey: ["loggedInUser"] });
        navigate("/", { replace: true });
      }
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message || "Sign in failed. Please try again.";
      dispatch(setToast({ message: errorMessage, type: "error" }));
    },
  });

  const handleLogin = useCallback(
    (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const credentials = Object.fromEntries(formData);

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

  if (isLoading) {
    return <LoaderScreen message="Authenticating, please wait..." />;
  }

  return (
    <AuthFormWrapper
      isLoading={isLoading}
      onSubmit={handleLogin}
      heading="Sign In to Spread"
      error={error}
      isError={isError}
      formType="signin"
    >
      {/* OAuth Buttons */}
      <div className="flex flex-col gap-2.5 w-full">
        <OAuth service="google" />
        <OAuth service="github" />
      </div>

      <Divider text="or sign in with email" className="my-3 border-inherit text-xs" />

      {/* Email Input */}
      <CommonInput
        className="flex justify-start items-center gap-2 border border-inherit rounded-xl w-full px-3 py-1.5 bg-light dark:bg-dark text-xs sm:text-sm focus-within:ring-2 focus-within:ring-stone-400 dark:focus-within:ring-stone-600 transition-all"
        type="email"
        name="email"
        label="Email address"
        disabled={isLoading}
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        placeholder="you@example.com"
        autoFocus
      />

      {/* Password Input */}
      <div className="space-y-1">
        <CommonInput
          className="flex justify-between items-center gap-2 w-full px-3 py-1.5 border border-inherit rounded-xl bg-light dark:bg-dark text-xs sm:text-sm focus-within:ring-2 focus-within:ring-stone-400 dark:focus-within:ring-stone-600 transition-all"
          type="password"
          name="password"
          label="Password"
          disabled={isLoading}
          required
          autoComplete="current-password"
          placeholder="••••••••"
        >
          <EyeBtn />
        </CommonInput>

        <div className="flex justify-end pt-1">
          <Link
            to="/forgot/pass"
            state={{ email }}
            className="text-xs text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 font-medium transition-colors"
          >
            Forgot Password?
          </Link>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2 w-full">
        <CommenAuthBtn
          type="submit"
          className="spread-btn-primary w-full py-2.5 text-xs sm:text-sm font-bold rounded-full shadow-md transition-all hover:scale-[1.02]"
          disabled={isLoading}
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </CommenAuthBtn>
      </div>
    </AuthFormWrapper>
  );
}

export default SignIn;
