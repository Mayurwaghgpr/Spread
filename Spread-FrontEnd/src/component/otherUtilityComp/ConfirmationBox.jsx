import { useDispatch, useSelector } from "react-redux";
import { setConfirmBox, setIsConfirm } from "../../redux/slices/uiSlice";
import { createPortal } from "react-dom";

function ConfirmationBox() {
  const dispatch = useDispatch();
  const { confirmBox, isConfirm } = useSelector((state) => state.ui);

  const handleConfirm = () => {
    // Logic for confirming action
    dispatch(setIsConfirm({ type: confirmBox.type, status: true }));
    dispatch(setConfirmBox({ message: "", status: false }));
  };

  const handleCancel = () => {
    // Logic for cancelling action
    dispatch(setIsConfirm(false));
    dispatch(setConfirmBox({ message: "", status: false }));
  };
  // console.log(confirmBox);
  return (
    confirmBox.status &&
    createPortal(
      <div className="flex justify-center z-[30]  transition-transform delay-700 items-center fixed top-0 bottom-0 left-0 right-0  bg-opacity-40 bg-black  border-inherit ">
        <div className="p-3  flex flex-col justify-between bg-white dark:bg-[#222222]  text-inherit  h-[20rem] z-50  border border-inherit  sm:w-1/2 rounded-lg ">
          <div className="text-lg flex justify-end">
            <button className="" onClick={handleCancel}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
          <div className=" w-full text-center">
            <h1 className=" uppercase text-2xl">{confirmBox.type}</h1>
            <p>{confirmBox?.message}</p>
          </div>
          <div className="flex justify-end gap-3 mb-0 w-full items-end ">
            <button
              onClick={handleCancel}
              name="cancel"
              className=" p-2 rounded-3xl"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              name="confirm"
              className="p-2 rounded-3xl bg-gray-500 dark:bg-gray-800"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>,
      document.getElementById("portal")
    )
  );
}

export default ConfirmationBox;
