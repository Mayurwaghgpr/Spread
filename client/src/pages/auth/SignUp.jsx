import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setIsLogin } from "../../store/slices/authSlice.js";
import { setToast } from "../../store/slices/uiSlice.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthApi from "../../services/useAuthApi.jsx";
import CommonInput from "../../components/inputComponents/CommonInput.jsx";
import { passwordRegex, emailRegex } from "../../utils/functions/regex.js";
import OAuth from "./OAuth.jsx";
import EyeBtn from "../../components/buttons/EyeBtn.jsx";
import AuthFormWrapper from "./AuthFormWrapper.jsx";
import Divider from "./components/Divider.jsx";
import CommenAuthBtn from "./components/CommenAuthBtn.jsx";
import { useUsernameAvailability } from "../../hooks/useUsernameAvailability.js";
import { CheckCircle, AlertCircle } from "lucide-react";
import Spinner from "../../components/loaders/Spinner.jsx";

function SignUp() {
  const [validation, setValidation] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    username,
    status: usernameStatus,
    message: usernameMessage,
    suggestions,
    handleUsernameChange,
    selectSuggestion,
    isAvailable: isUsernameAvailable,
    isLoading: isCheckingUsername,
  } = useUsernameAvailability("");

  const isSuccess = usernameStatus === "available";
  const isErrorStatus = usernameStatus === "taken" || usernameStatus === "invalid";

  const { registerUser } = useAuthApi();
  const {
    isPending: isLoading,
    isError,
    error,
    mutate,
  } = useMutation({
    mutationFn: registerUser,
    onSuccess: (response) => {
      const { AccessToken } = response;
      dispatch(setIsLogin(true));
      queryClient.invalidateQueries({ queryKey: ["loggedInUser"] });
      localStorage.setItem("AccessToken", AccessToken);
      navigate("/", { replace: true });
      dispatch(setToast({ message: "Account created successfully ✨", type: "success" }));
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      dispatch(setToast({ message: errorMessage, type: "error" }));
    },
  });

  const signUp = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const signUpInfo = Object.fromEntries(formData);
    const { password, email } = signUpInfo;

    if (!emailRegex.test(email)) {
      setValidation("Please enter a valid email address.");
      return;
    }

    if (username && !isUsernameAvailable) {
      setValidation("Please choose a valid and available username.");
      return;
    }

    if (!passwordRegex.test(password)) {
      setValidation(
        "Password must be at least 8 characters long, contain uppercase, lowercase, number, and special character."
      );
      return;
    }
    setValidation("");
    mutate({ ...signUpInfo, username });
  };

  return (
    <AuthFormWrapper
      onSubmit={signUp}
      isError={isError}
      validation={validation}
      error={error}
      formType="signup"
      heading="Create your Account"
    >
      {/* OAuth Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 w-full">
        <OAuth service="google" />
        <OAuth service="github" disabled={true} />
      </div>

      <Divider text="or" className="my-2 border-inherit text-[11px]" />

      {/* Name Input - Independent from Username */}
      <CommonInput
        className="flex justify-start items-center gap-2 border border-inherit rounded-xl w-full px-3 py-1 bg-light dark:bg-dark text-xs sm:text-sm focus-within:ring-2 focus-within:ring-stone-400 dark:focus-within:ring-stone-600 transition-all mb-2"
        type="text"
        name="displayName"
        label="Full Name"
        placeholder="Enter your name"
        disabled={isLoading}
        required
      />

      {/* Username Field with Live Verification (Identical to ProfileEditor) */}
      <div className="mb-2 space-y-1 w-full border-inherit">
        <div className="relative border-inherit">
          <CommonInput
            className={`w-full px-3 py-1 bg-inherit border-2 rounded-xl transition-all duration-200 ${isErrorStatus
              ? "border-red-500 focus:border-red-500"
              : isSuccess
                ? "border-green-500 focus:border-green-500"
                : "border-inherit focus:border-blue-500"
              }`}
            type="text"
            name="username"
            label="User Name"
            disabled={isLoading}
            onChange={(e) => handleUsernameChange(e.target.value)}
            maxLength={15}
            value={username}
            placeholder="Enter your username"
            aria-invalid={isErrorStatus}
            aria-describedby={isErrorStatus ? "username-error" : undefined}
          />

          {/* Loading/Status Icons positioned identical to ProfileEditor */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 border-inherit pointer-events-none">
            {isCheckingUsername && <Spinner className="w-4 h-4 text-blue-500" />}
            {isSuccess && <CheckCircle className="w-4 h-4 text-green-500" />}
            {isErrorStatus && <AlertCircle className="w-4 h-4 text-red-500" />}
          </div>
        </div>

        {/* Error Message formatting identical to ProfileEditor */}
        {isErrorStatus && usernameMessage && (
          <p
            id="username-error"
            className="text-red-500 text-xs flex items-center gap-1.5 pt-0.5"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            {usernameMessage}
          </p>
        )}

        {/* Available Success Message */}
        {isSuccess && usernameMessage && (
          <p className="text-green-500 text-xs flex items-center gap-1.5 pt-0.5">
            <CheckCircle className="w-3.5 h-3.5" />
            {usernameMessage}
          </p>
        )}

        {/* Clickable Handle Suggestions */}
        {suggestions.length > 0 && (
          <div className="pt-1 px-1 space-y-1">
            <span className="text-[10px] text-stone-500 font-medium block">
              Suggested handles:
            </span>
            <div className="flex flex-wrap gap-1">
              {suggestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => selectSuggestion(item)}
                  className="spread-pill text-[10px] px-2 py-0.5 font-semibold text-stone-800 dark:text-stone-200 hover:scale-105 transition-transform cursor-pointer"
                >
                  @{item}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Email Input */}
      <CommonInput
        className="flex justify-start items-center gap-2 border border-inherit rounded-xl w-full px-3 py-1 bg-light dark:bg-dark text-xs sm:text-sm focus-within:ring-2 focus-within:ring-stone-400 dark:focus-within:ring-stone-600 transition-all mb-2"
        type="email"
        name="email"
        label="Email"
        placeholder="Enter your email"
        disabled={isLoading}
        required
      />

      {/* Password Input */}
      <CommonInput
        className="flex justify-between items-center gap-2 border border-inherit rounded-xl w-full px-3 py-1 bg-light dark:bg-dark text-xs sm:text-sm focus-within:ring-2 focus-within:ring-stone-400 dark:focus-within:ring-stone-600 transition-all mb-2"
        type="password"
        name="password"
        label="Password"
        placeholder="Enter password"
        disabled={isLoading}
        required
        autoComplete="new-password"
      >
        <EyeBtn />
      </CommonInput>
      {/* Submit Button */}
      <div className="pt-1 w-full space-y-2">
        <CommenAuthBtn
          type="submit"
          className="spread-btn-primary w-full py-2 text-xs sm:text-sm font-bold rounded-full shadow-md transition-all hover:scale-[1.02]"
          disabled={isLoading || (username.length > 0 && !isUsernameAvailable)}
        >
          {isLoading ? "Signing Up..." : "Sign Up"}
        </CommenAuthBtn>
      </div>
    </AuthFormWrapper>
  );
}

export default SignUp;
