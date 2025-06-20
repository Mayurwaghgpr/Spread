import React, { memo } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

function LinkBtn({ className = "", stub, action, children, ...props }) {
  return (
    <NavLink
      onClick={action}
      to={stub || "#"}
      isActive={(match, location) => {
        // Handle both exact path matches and paths with query parameters
        const pathWithoutParams = location.pathname;
        const isPathMatch =
          stub === pathWithoutParams ||
          (stub === "/" && pathWithoutParams === "") ||
          (stub !== "/" && pathWithoutParams.startsWith(stub));
        return isPathMatch;
      }}
      className={({ isActive }) =>
        `${isActive ? "opacity-100 underline underline-offset-[1.5rem]" : "opacity-50"} hover:opacity-100 flex gap-2 transition-all duration-200 bg-inherit text-inherit border-inherit ${className}`
      }
      {...props}
    >
      {children}
    </NavLink>
  );
}

LinkBtn.propTypes = {
  /** Additional class names to apply to the NavLink */
  className: PropTypes.string,
  /** URL path for the link (required) */
  stub: PropTypes.string.isRequired,
  /** Optional click handler function */
  action: PropTypes.func,
  /** Link content */
  children: PropTypes.node.isRequired,
};

export default memo(LinkBtn);
