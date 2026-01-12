import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuthApi from "../../services/useAuthApi.jsx";
import { useMutation } from "react-query";
import CommonInput from "../../components/inputComponents/CommonInput.jsx";
import { useDispatch } from "react-redux";
import { setToast } from "../../store/slices/uiSlice.js";
import EyeBtn from "../../components/buttons/EyeBtn";
import AuthFormWrapper from "./AuthFormWrapper";
function ResetPassword() {
  const param = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { resetPasswordApi } = useAuthApi();
  console.log("param" + param.token);
  const { data, mutate, isError, error, isLoading } = useMutation(
    (newPassword) => resetPasswordApi(newPassword, param.token),
    {
      onSuccess: (data) => {
        dispatch(setToast({ message: data.success, type: "success" }));
        navigate("/auth/signin", { replace: true });
      },
    }
  );

  const handlerResetPass = (e) => {
    e.preventDefault();
    const formdata = new FormData(e.target);
    const obj = Object.fromEntries(formdata);
    console.log(obj);
    mutate(obj);
  };
  return (
    <AuthFormWrapper
      onSubmit={handlerResetPass}
      heading={"Set new password"}
      error={error}
      isError={isError}
    >
      <CommonInput
        className={
          "flex items-center justify-center gap-2 w-full border border-inherit rounded-lg bg-inherit "
        }
        type={"password"}
        name={"password"}
        label={"Password"}
        disabled={isLoading}
        required
      >
        <EyeBtn />
      </CommonInput>
      <div className="mb-4 w-full">
        <button
          type="submit"
          className={`bg-black text-white dark:bg-white dark:text-black p-3 w-full  rounded-lg ${
            isLoading && "cursor-wait bg-blue-100"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Updating" : "Update"}
        </button>
      </div>
    </AuthFormWrapper>
  );
}

export default ResetPassword;
