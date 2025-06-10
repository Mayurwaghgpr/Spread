import { forwardRef, memo } from "react";
import useIcons from "../../hooks/useIcons";
import Ibutton from "../buttons/Ibutton";
import FedInBtn from "../buttons/FedInBtn";

const Menu = forwardRef(function (
  { content, items, className, menuId, setMenuId },
  ref
) {
  const icons = useIcons();
  if (!content || !items.length || items.length === 0) return null;
  return (
    <div
      ref={ref}
      className="relative flex justify-center items-center border-inherit"
    >
      {" "}
      <FedInBtn
        action={() => setMenuId((prev) => (prev === null ? content?.id : null))}
      >
        {icons["ThreeDot"]}
      </FedInBtn>
      {menuId === content?.id && (
        <div
          onClick={() => setMenuId("")}
          className={`fixed sm:absolute flex justify-center items-end border-inherit sm:left-auto left-0 right-0 sm:top-5 top-0 bottom-0 z-10 sm:w-fit sm:h-fit h-auto transition-all delay-300`}
        >
          <ul
            onClick={(e) => e.stopPropagation()}
            className={`${className} flex flex-col gap-1 transition-all duration-200 ${menuId === content?.id ? "sm:animate-none sm:opacity-100 sm:translate-y-0 sm:pointer-events-auto animate-slide-in-bottom" : "sm:-translate-y-5 sm:opacity-0 sm:pointer-events-none animate-slide-out-bottom "} z-10 border border-inherit text-sm h-fit bg-light dark:bg-dark sm:rounded-lg rounded-xl m-1  sm:shadow-md`}
          >
            {items.map((item) => (
              <li
                key={item.id}
                className="flex gap-2 text-nowrap items-center sm:px-3 sm:py-1 p-3  hover:bg-gray-400 hover:bg-opacity-10 rounded-md cursor-pointer"
                onClick={() => item.action(content.id)}
              >
                {item.icon}
                {item.itemName}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});
export default memo(Menu);
