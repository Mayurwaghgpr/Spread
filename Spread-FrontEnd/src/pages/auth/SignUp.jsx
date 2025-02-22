import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setIsLogin } from "../../redux/slices/authSlice.js";
import { setToast } from "../../redux/slices/uiSlice.js";
import { useMutation, useQueryClient } from "react-query";
import useAuthApi from "../../Apis/useAuthApi.jsx";
import CommonInput from "../../component/UtilityComp/commonInput.jsx";
import { passwordRegex, emailRegex } from "../../utils/regex.js";
import OAuth from "./OAuth.jsx";
import { v4 as uuidv4 } from "uuid";
import EyeBtn from "../../component/buttons/EyeBtn.jsx";
import { BsGoogle } from "react-icons/bs";
import AuthFormWrapper from "./AuthFormWrapper.jsx";
function SignUp() {
  const [validation, setValidation] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { registerUser } = useAuthApi();
  const { isLoading, isError, error, mutate } = useMutation(registerUser, {
    onSuccess: (response) => {
      const { AccessToken } = response;
      dispatch(setIsLogin(true));
      queryClient.invalidateQueries({ queryKey: ["loggedInUser"] });
      localStorage.setItem("AccessToken", AccessToken);
      navigate("/", { replace: true });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data.message || "Registration failed";
      dispatch(setToast({ message: errorMessage }));
    },
  });

  const signUp = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const signUpInfo = Object.fromEntries(formData);
    const { password, email } = signUpInfo;

    if (!passwordRegex.test(password)) {
      setValidation(
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }
    if (!emailRegex.test(email)) {
      setValidation("Please enter a valid email address.");
      return;
    }
    mutate(signUpInfo);
  };

  const signUpInputs = [
    {
      id: uuidv4(),
      type: "text",
      Iname: "displayName",
      labelname: "Name",
      className: "mb-3 w-full flex flex-col gap-2 border-inherit",
    },
    {
      id: uuidv4(),
      type: "email",
      Iname: "email",
      labelname: "Email",
    },
    {
      id: uuidv4(),
      type: "password",
      Iname: "password",
      labelname: "Password",

      className: "mb-3 w-full flex flex-col gap-2 border-inherit",
      autocomplete: "new-password",
      comp: <EyeBtn />,
    },
  ];

  return (
    <AuthFormWrapper
      onSubmit={signUp}
      isError={isError}
      validation={validation}
      error={error}
      formType={"signup"}
      heading={"Create Account"}
    >
      <div className="mb-4 w-full flex text-nowrap text-xs  gap-3  *:border-inherit ">
        <OAuth
          className={
            "border bg-black text-white dark:bg-white dark:text-black "
          }
          service={"google"}
          icon={<BsGoogle />}
        />
        <OAuth
          className={"border bg-black text-white dark:bg-white dark:text-black"}
          service={"github"}
          icon={<i className="bi bi-github"></i>}
          disabled={true}
        />
      </div>
      <div className="mb-3 w-full text-center text-xl flex items-center  *:border-inherit">
        <hr className="flex-1" />
        <p className="mx-2">or</p>
        <hr className="flex-1" />
      </div>
      {signUpInputs.map((input) => (
        <CommonInput
          key={input.id}
          className="mb-3 w-full flex flex-col gap-2 border p-1 rounded-lg  border-inherit "
          type={input.type}
          labelname={input.labelname}
          Iname={input.Iname}
          disabled={isLoading}
          comp={input.comp}
        />
      ))}
      <div className="flex justify-start w-full">
        <CommonInput
          className={
            "mb-4 flex flex-row-reverse justify-start  items-center gap-2 text-sm"
          }
          type={"checkbox"}
          labelname={"RemberMe"}
          label={"RemberMe"}
        />
      </div>
      <div className="mb-4 w-full">
        <button
          type="submit"
          className=" bg-black text-white dark:bg-white dark:text-black  p-3 w-full text-center rounded-lg"
          disabled={isLoading}
        >
          {isLoading ? "Signing Up..." : "Sign Up"}
        </button>
      </div>
    </AuthFormWrapper>
  );
}

export default SignUp;
