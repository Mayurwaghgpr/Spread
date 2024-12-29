import { useDispatch, useSelector } from "react-redux";
import { setConfirmBox, setToast } from "../../redux/slices/uiSlice";
import { createPortal } from "react-dom";
import { useCallback } from "react";
import { useMutation, useQueryClient } from "react-query";
import PostsApis from "../../Apis/PostsApis";
import { useNavigate } from "react-router-dom";
import Spinner from "../../component/loaders/Spinner";
function ConfirmationBox() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { DeletePostApi } = PostsApis();
  const navigate = useNavigate();
  const { confirmBox } = useSelector((state) => state.ui);
  const { mutate: deleteMutation, isLoading } = useMutation(DeletePostApi, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(["Allposts"]);
      dispatch(setToast({ message: `${data.message} ✨`, type: "success" }));
    },
    onError: () => {
      dispatch(
        setToast({
          message: "Failed to delete post. Please try again.",
          type: "error",
        })
      );
    },
    onSettled: () => {
      dispatch(setConfirmBox({ message: "", status: false }));
      if (location.pathname.startsWith("/view")) {
        navigate(-1);
      }
    },
  });

  const handleConfirm = useCallback(() => {
    if (confirmBox.type === "delete") {
      deleteMutation(confirmBox.id);
    }
    // Logic for confirming action
  }, [confirmBox.status]);

  const handleCancel = useCallback(() => {
    // Logic for cancelling action
    dispatch(setConfirmBox({ message: "", status: false }));
  }, [confirmBox.status]);

  return (
    confirmBox.status &&
    createPortal(
      <div className="flex  justify-center z-50  transition-transform delay-700 items-center fixed top-0 bottom-0 left-0 right-0  bg-opacity-10 backdrop-blur-[1px] bg-black  border-inherit ">
        <div className="p-3  flex flex-col justify-between bg-white dark:bg-[#222222]  text-inherit  h-[20rem] z-50  border border-inherit  sm:w-1/2 rounded-lg ">
          <div className="text-lg flex justify-end">
            <button className="" onClick={handleCancel}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
          <div className="flex justify-center items-center flex-col px-5 ">
            <div>
              {" "}
              <h1 className=" capitalize text-xl font-bold ">
                {confirmBox.title}
              </h1>
            </div>

            <div className=" text-wrap  m-auto">
              {" "}
              <p className="text-sm">{confirmBox?.message}</p>
            </div>
          </div>
          <div className="flex capitalize sm:flex-row flex-col-reverse  sm:justify-end gap-3 mb-0 w-full sm:items-end ">
            <button
              onClick={handleCancel}
              name="cancel"
              className=" p-2 rounded-3xl"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              name={confirmBox.type}
              className="p-2 px-5 rounded-3xl  bg-white text-black"
              disabled={isLoading}
            >
              {isLoading ? <Spinner className={"w-5 h-5"} /> : confirmBox?.type}
            </button>
          </div>
        </div>
      </div>,
      document.getElementById("portal")
    )
  );
}

export default ConfirmationBox;
