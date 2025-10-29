import { memo } from "react";
import { NavLink } from "react-router-dom";

function LinkBtn({ className = "", stub, action, children, ...props }) {
  return (
    <NavLink
      onClick={action}
      to={stub || "#"}
      className={({ isActive }) =>
        `${isActive ? "opacity-100 underline underline-offset-[1.5rem]" : "opacity-50"} hover:opacity-100 flex gap-2 transition-all duration-200 bg-inherit text-inherit border-inherit ${className}`
      }
      {...props}
    >
      {children}
    </NavLink>
  );
}

export default memo(LinkBtn);
