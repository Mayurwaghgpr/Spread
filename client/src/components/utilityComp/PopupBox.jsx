import React from "react";

export const PopupBox = ({ children, className, heading, subText, action }) => {
  // const navigate = useNavigate();
  // const dispatch = useDispatch();
  return (
    <div
      onClick={action}
      className="fixed inset-0 p-3 sm:p-6 flex justify-center items-center bg-black/50 backdrop-blur-sm z-50 transition-all duration-200 animate-in fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${className} bg-[#fff9f3] dark:bg-[#191818] border border-inherit rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] sm:max-h-[90vh]`}
      >
        {children}
      </div>
    </div>
  );
};
