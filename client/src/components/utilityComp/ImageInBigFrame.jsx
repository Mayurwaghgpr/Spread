import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
// import useIcons from "../../hooks/useIcons";
import CloseBtn from "../buttons/CloseBtn";
import { setOpenBigFrame } from "../../store/slices/uiSlice";

function ImageInBigFrame({ className, ...props }) {
  const { openBigFrame } = useSelector((state) => state.ui);
  // const icons = useIcons();
  const dispatch = useDispatch();

  if (!openBigFrame) {
    return null;
  }
  const handleBigFrame = () => {
    dispatch(setOpenBigFrame(null));
  };
  return createPortal(
    <div
      onClick={handleBigFrame}
      className=" fixed text-white animate-fedin.2s top-0 bottom-0 w-full h-full right-0 left-0  bg-black bg-opacity-60 backdrop-blur-sm  z-[200]"
    >
      <div className=" relative w-full ">
        <CloseBtn
          className={"absolute top-0 right-1 "}
          onClick={handleBigFrame}
        />
      </div>
      <div className="w-full h-full flex  justify-center items-center ">
        <img
          onClick={(e) => e.stopPropagation()}
          className={`${openBigFrame.className} ${className} ${openBigFrame["profile"] ? "rounded-full w-1/4 mb-10" : " w-[80%] h-3/4"}`}
          src={openBigFrame.src}
          alt={openBigFrame.alt}
          {...props}
        />
      </div>
    </div>,
    document.getElementById("portal")
  );
}

export default ImageInBigFrame;
