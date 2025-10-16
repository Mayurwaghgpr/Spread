import { Link } from "react-router-dom";
import useIcons from "../../hooks/useIcons";
import { memo } from "react";

const AIBtn = memo(({ className, state }) => {
  const icons = useIcons();
  return (
    <Link
      to="/analysis"
      state={state}
      title="AI Analysis"
      aria-label="AI Analysis"
      onClick={(e) => {
        e.stopPropagation();
      }}
      tabIndex={-1}
      role="button"
      className={`border-inherit border  sm:text-xl text-lg flex justify-center  cursor-pointer ${className}`}
    >
      AI
      {icons["glitter"]}
    </Link>
  );
});

export default AIBtn;
