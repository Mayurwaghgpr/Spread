import React from "react";
import { useMutation } from "react-query";
import { forgotPassword } from "../../Apis/authapi";
import { useLocation, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
import CommonInput from "../../component/otherUtilityComp/commonInput";
import { useDispatch } from "react-redux";
import { setToast } from "../../redux/slices/uiSlice";
function ForgotPass() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
    console.log(obj);
    mutate(obj);
  };
  return (
    <section
      className={`sm:flex relative justify-evenly z-50 items-center h-screen flex-col   top-0 left-0 bottom-0 right-0 text-black  bg-[#ffff] border-inherit`}
    >
      {isError && (
        <div className="text-red-500 my-4 w-full flex justify-center  bg-red-100 py-2 ">
          {error?.response?.data?.message}!
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
        className={`flex flex-col justify-between items-center p-8   min-w-[300px] sm:w-[500px] h-full  transition-all duration-300 delay-150`}
      >
        <header className="text-2xl  text-center flex justify-center items-center">
          {"{...Spread}"}
        </header>
        <div className="flex w-full h-full  flex-col justify-center  px-5">
          <form
            onSubmit={handlerforgot}
            className="flex flex-col  py-4 justify-evenly w-full  "
          >
            <div className="relative flex flex-col gap-3 my-4 break-words justify-center text-center px-10">
              {" "}
              <h1 className="text-2xl text-center font-medium  ">
                Reset your password
              </h1>
              <p className="text-sm ">
                Enter yout email address and you will get mail to reset your
                password{" "}
              </p>
            </div>

            <CommonInput
              className={"mb-4 flex flex-col gap-2  text-sm"}
              type={"email"}
              name={"email"}
              labelname={"Email address "}
              disabled={isLoading}
              required={true}
              defaultValue={location.state?.email}
            />

            <div className="mb-4">
              <button
                type="submit"
                className={`bg-gray-400 min-w-[200px] text-white p-3 w-full  rounded-lg ${
                  isLoading && "cursor-wait bg-blue-100"
                }`}
                disabled={isLoading}
              >
                {isLoading ? "submit." : "submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ForgotPass;
