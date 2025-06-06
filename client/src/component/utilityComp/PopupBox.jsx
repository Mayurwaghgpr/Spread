import React from "react";

export const PopupBox = ({ children, className, heading, subText, action }) => {
  // const navigate = useNavigate();
  // const dispatch = useDispatch();
  return (
    <div
      onClick={action}
      className="fixed left-0 right-0 bottom-0 top-0  flex justify-center items-center  bg-black bg-opacity-20 backdrop-blur-[1px] z-50 border-inherit"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${className} bg-[#fff9f3]  dark:bg-[#191818]  border border-inherit rounded-lg shadow-lg `}
      >
        {children}
      </div>
    </div>
  );
};
