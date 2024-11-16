import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ResetPasswordApi } from "../../Apis/authapi";
import { useMutation } from "react-query";
import CommonInput from "../../component/otherUtilityComp/commonInput";
import { useDispatch } from "react-redux";
import { setToast } from "../../redux/slices/uiSlice";
function ResetPassword() {
  const param = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log("param" + param.token);
  const { data, mutate, isError, error, isLoading } = useMutation(
    (newPassword) => ResetPasswordApi(newPassword, param.token),
    {
      onSuccess: (data) => {
        dispatch(setToast({ message: data.success, type: "success" }));
        navigate("/signin", { replace: true });
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
    <main
      className={`sm:flex relative justify-evenly z-50 items-center h-screen flex-col   top-0 left-0 bottom-0 right-0 text-black  bg-[#ffff] border-inherit`}
    >
      {isError && (
        <div className="text-red-500 my-4 w-full flex justify-center  bg-red-100 py-2 ">
          {error?.response?.data.message}!
        </div>
      )}
      <button
        onClick={() => navigate("/")}
        className=" text-3xl absolute  top-0 p-5   right-3 text-shadow text-decoration-none"
        aria-label="Close"
      >
        <i className="bi bi-x-lg"></i>
      </button>

      <div
        className={`flex flex-col justify-between items-center p-8 h-full   min-w-[300px] sm:w-[500px]  transition-all duration-300 delay-150 `}
      >
        <header className="text-2xl  text-center flex justify-center items-center">
          {"{...Spread}"}
        </header>
        <div className="flex w-full h-full  flex-col justify-center px-5">
          <form
            onSubmit={handlerResetPass}
            className="flex flex-col  justify-center w-full  border-inheri text-sm"
          >
            <h1 className="text-2xl text-center font-medium my-4">
              Set new password
            </h1>

            <CommonInput
              className={"mb-4 flex flex-col gap-2 "}
              type={"password"}
              name={"password"}
              labelname={"Password"}
              disabled={isLoading}
              required
            />
            <div className="mb-4">
              <button
                type="submit"
                className={`bg-slate-400 min-w-[200px] text-white p-3 w-full  rounded-lg ${
                  isLoading && "cursor-wait bg-blue-100"
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Updating" : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default ResetPassword;
