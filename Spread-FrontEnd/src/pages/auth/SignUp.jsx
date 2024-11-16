import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setIsLogin } from "../../redux/slices/authSlice.js";
import { setToast } from "../../redux/slices/uiSlice.js";
import { useMutation, useQueryClient } from "react-query";
import { RegisterUser } from "../../Apis/authapi.jsx";
import CommonInput from "../../component/otherUtilityComp/commonInput.jsx";
import { passwordRegex, emailRegex } from "../../utils/regex.js";
import OAuth from "./OAuth.jsx";
import { v4 as uuidv4 } from "uuid";
function SignUp() {
  const [validation, setValidation] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isLoading, isError, error, mutate } = useMutation(RegisterUser, {
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
      Iname: "username",
      labelname: "User Name",
      className: "mb-3 w-full flex flex-col gap-2 border-inherit",
    },
    {
      id: uuidv4(),
      type: "email",
      Iname: "email",
      labelname: "Email",
      className: "mb-3 w-full flex flex-col gap-2 border-inherit",
    },
    {
      id: uuidv4(),
      type: "password",
      Iname: "password",
      labelname: "Password",
      className: "mb-3 w-full flex flex-col gap-2 border-inherit",
      autocomplete: "new-password",
    },
  ];

  return (
    <section className="sm:flex animate-fedin.2s relative justify-start z-50   h-[47rem]   items-center flex-col top-0 left-0 bottom-0 right-0 overflow-scroll  bg-[#ffff] dark:bg-[#222222]  dark:*:border-[#383838]">
      {(isError || validation) && (
        <div className="text-red-500 my-4 w-full flex justify-center bg-red-100 py-2">
          {error?.response?.data.message || validation}
        </div>
      )}

      <button
        onClick={() => navigate("/")}
        className=" text-3xl absolute top-0 p-4 right-3"
        aria-label="Close"
      >
        <i className="bi bi-x-lg"></i>
      </button>

      <div className="flex flex-col justify-between gap-3 p-7 min-w-[300px] sm:w-[500px] h-full rounded-xl bg-white dark:bg-inherit *:border-inherit ">
        <header className="text-2xl mt-2 text-center flex justify-center items-center">
          {"Spread"}
        </header>

        <div className="flex flex-col justify- w-full px-5 *:border-inherit">
          <h1 className="text-2xl py-5 text-center font-medium">
            Create an account
          </h1>
          <form
            onSubmit={signUp}
            className="flex flex-col py-2 w-full items-center justify-start text-sm *:border-inherit "
          >
            {signUpInputs.map((input) => (
              <CommonInput
                key={input.id}
                className={input.className}
                type={input.type}
                labelname={input.labelname}
                Iname={input.Iname}
                disabled={isLoading}
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
                className="bg-gray-800 text-white p-3 w-full text-center rounded-lg"
                disabled={isLoading}
              >
                {isLoading ? "Signing Up..." : "Sign Up"}
              </button>
            </div>
            <div className="mb-3 w-full text-center flex items-center  *:border-inherit">
              <hr className="flex-1" />
              <p className="mx-2">or</p>
              <hr className="flex-1" />
            </div>
            <div className="mb-4 w-full flex flex-col gap-3  *:border-inherit ">
              <OAuth
                className={"border "}
                service={"google"}
                icon={<i className="bi bi-google"></i>}
              />
              <OAuth
                className={"border"}
                service={"github"}
                icon={<i className="bi bi-github"></i>}
                disabled={true}
              />
            </div>
            <footer className="text-center">
              <small>
                Already have an account?{" "}
                <Link to="/signin" replace={true} className="text-blue-500">
                  Sign In
                </Link>
              </small>
            </footer>
          </form>
        </div>
      </div>
    </section>
  );
}

export default SignUp;
