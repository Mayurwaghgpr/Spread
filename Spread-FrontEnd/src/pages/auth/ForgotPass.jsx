import React from "react";
import { useMutation } from "react-query";
import useAuth from "../../Apis/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
import CommonInput from "../../component/UtilityComp/commonInput";
import { useDispatch } from "react-redux";
import { setToast } from "../../redux/slices/uiSlice";
import AuthFormWrapper from "./AuthFormWrapper";
import LoaderScreen from "../../component/loaders/loaderScreen";

function ForgotPass() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { forgotPassword } = useAuth();

  const { data, mutate, isError, error, isLoading } = useMutation(
    (email) => forgotPassword(email),
    {
      onSuccess: (data) => {
        dispatch(setToast({ message: data.success, type: "success" }));
      },
      onError: (error) => {
        dispatch(setToast({ message: error.data, type: "error" }));
      },
    }
  );

  const handlerforgot = (e) => {
    e.preventDefault();
    const formdata = new FormData(e.target);
    const obj = Object.fromEntries(formdata);
    // console.log(obj);
    mutate(obj);
  };
  if (isLoading) {
    return <LoaderScreen message={"Authenticating please wait"} />;
  }
  return (
    <AuthFormWrapper onSubmit={handlerforgot} isError={isError} error={error}>
      <div className="relative flex flex-col gap-3 my-4 break-words justify-center text-center px-10 ">
        {" "}
        <h1 className="text-2xl text-center font-medium  ">
          Reset your password
        </h1>
        <p className="text-sm ">
          Enter yout email address and you will get mail to reset your password{" "}
        </p>
      </div>

      <CommonInput
        className={
          " flex flex-col gap-2 mb-4 w-full  text-sm border rounded-lg p-1"
        }
        type={"email"}
        name={"email"}
        labelname={"Email address "}
        disabled={isLoading}
        required={true}
        defaultValue={location.state?.email}
      />

      <div className="mb-4 w-full">
        <button
          type="submit"
          className={`bg-black text-white dark:bg-white dark:text-black border p-3 w-full  rounded-lg ${
            isLoading && "cursor-wait bg-blue-100"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "submitting..." : "submit"}
        </button>
      </div>
    </AuthFormWrapper>
  );
}

export default ForgotPass;
