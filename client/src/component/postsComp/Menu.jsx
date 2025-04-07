import { memo, useRef } from "react";
import { useDispatch } from "react-redux";
// import { useLocation, useNavigate } from "react-router-dom";
import useClickOutside from "../../hooks/useClickOutside";
import Ibutton from "../buttons/Ibutton";
import useIcons from "../../hooks/useIcons";

function Menu({ content, items, className }) {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  // const location = useLocation();
  const menuRef = useRef(null);
  const icons = useIcons();

  const { menuId, setMenuId } = useClickOutside(menuRef);

  return (
    items.length > 0 && (
      <div
        ref={menuRef}
        className="sm:relative flex justify-center items-center border-inherit "
      >
        <Ibutton
          className={"rounded-full py-1 "}
          action={() =>
            setMenuId((prev) => (prev === null ? content?.id : null))
          }
        >
          {icons["ThreeDot"]}
        </Ibutton>

        {menuId === content?.id && (
          <div
            onClick={() => setMenuId("")}
            className={`transition-all delay-300   fixed sm:absolute flex justify-center items-end border-inherit sm:-left-10 left-0 right-0 sm:top-5 top-0 bottom-0 z-10 sm:w-fit sm:h-fit h-auto`}
          >
            <ul
              onClick={(e) => e.stopPropagation()}
              className={`${className} flex flex-col gap-1  transition-all duration-200 ${menuId === content?.id ? "sm:animate-none sm:opacity-100 sm:translate-y-0 sm:pointer-events-auto animate-slide-in-bottom" : "sm:-translate-y-5 sm:opacity-0 sm:pointer-events-none animate-slide-out-bottom "} z-10 border border-inherit text-sm h-fit bg-[#e8e4df] dark:bg-[#0f0f0f] sm:rounded-lg rounded-xl m-1  sm:shadow-md`}
            >
              {items
                .filter((itm) => itm)
                .map((item) => (
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
    )
  );
}

export default memo(Menu);
