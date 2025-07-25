import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setIsLogin } from "../../store/slices/authSlice.js";
import { setToast } from "../../store/slices/uiSlice.js";
import { useMutation, useQueryClient } from "react-query";
import useAuthApi from "../../services/useAuthApi.jsx";
import CommonInput from "../../component/inputComponents/CommonInput.jsx";
import { passwordRegex, emailRegex } from "../../utils/regex.js";
import OAuth from "./OAuth.jsx";
import { v4 as uuidv4 } from "uuid";
import EyeBtn from "../../component/buttons/EyeBtn.jsx";
import AuthFormWrapper from "./AuthFormWrapper.jsx";
import Ibutton from "../../component/buttons/Ibutton.jsx";
import Divider from "./components/Divider.jsx";
import CommenAuthBtn from "./components/CommenAuthBtn.jsx";

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
      dispatch(setToast({ message: "Signed up successfuly", type: "error" }));
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data.message || "Registration failed";
      dispatch(setToast({ message: errorMessage, type: "error" }));
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
      heading={"Create your account"}
    >
      <div className="mb-4 w-full flex text-nowrap  gap-3  *:border-inherit ">
        <OAuth
          className={
            "border bg-black text-white dark:bg-white dark:text-black "
          }
          service={"google"}
        />
        <OAuth
          className={"border bg-black text-white dark:bg-white dark:text-black"}
          service={"github"}
          disabled={true}
        />
      </div>
      <Divider text="or" className="mb-4  border-inherit" />
      {signUpInputs.map((input) => (
        <CommonInput
          key={input.id}
          className="mb-3 w-full flex flex-col gap-2 border  border-inherit bg-inherit "
          type={input.type}
          label={input.labelname}
          name={input.Iname}
          disabled={isLoading}
        >
          {input.comp}
        </CommonInput>
      ))}
      <div className="flex justify-start items-center gap-2 w-full text-nowrap ">
        <span className=" opacity-45">Read Me</span>
        <CommonInput
          className={"flex justify-start items-center gap-4 w-fit text-sm  "}
          type={"checkbox"}
          name={"readme"}
        />
      </div>
      <CommenAuthBtn type="submit" disabled={isLoading}>
        {isLoading ? "Signing Up..." : "Sign Up"}
      </CommenAuthBtn>
    </AuthFormWrapper>
  );
}

export default SignUp;
