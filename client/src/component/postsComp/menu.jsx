import { useCallback } from "react";
import { memo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { useLocation, useNavigate } from "react-router-dom";
import useClickOutside from "../../hooks/useClickOutside";
import { setConfirmBox } from "../../redux/slices/uiSlice";

function Menu({ content, MENU_ITEMS }) {
  // const [isIntersect, setIsIntersect] = useState(false);
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  // const location = useLocation();
  const menuRef = useRef(null);
  const {} = useSelector((state) => state.ui);
  // const queryClient = useQueryClient();
  // const { DeletecontentApi } = contentsApis();

  const { menuId, setMenuId } = useClickOutside(menuRef);

  // useEffect(() => {
  //   if (!menuRef.current || menuId !== content?.id) return;

  //   const buttonRect = menuRef.current.getBoundingClientRect();
  //   const menuHeight = menuRef.current.children[1]?.offsetHeight || 0;

  //   // Check if menu overflows at the bottom
  //   const willOverflow = buttonRect.bottom + menuHeight > window.innerHeight;

  //   setIsIntersect(!willOverflow); // If it overflows, position it above
  // }, [content, menuId]);

  return (
    <div
      ref={menuRef}
      className="sm:relative flex justify-center items-center border-inherit "
    >
      <button
        aria-label="Menu"
        onClick={() =>
          setMenuId((prev) => (prev === null ? content?.id : null))
        }
      >
        <i className="bi bi-three-dots-vertical"></i>
      </button>

      <div
        onClick={() => setMenuId("")}
        className={`transition-all  delay-300 ${menuId === content?.id ? "pointer-events-auto" : " pointer-events-none"} fixed sm:absolute flex justify-center border-inherit items-end  sm:-left-10 left-0 right-0 top-0 bottom-0 z-10 sm:w-fit sm:h-fit h-screen  `}
      >
        <ul
          onClick={(e) => e.stopPropagation()}
          className={` transition-all duration-200 ${menuId === content?.id ? "sm:animate-none sm:opacity-100 sm:translate-y-0 sm:pointer-events-auto animate-slide-in-bottom" : "sm:-translate-y-5 sm:opacity-0 sm:pointer-events-none animate-slide-out-bottom  "} sm:absolute z-10 border-inherit text-sm   flex flex-col gap-1 sm:h-fit h-1/2 sm:top-5 sm:w-36 w-full mt-2 sm:p-2 p-6  bg-[#e8e4df] dark:bg-[#0f0f0f] sm:rounded-lg rounded-xl m-1 border sm:shadow-md`}
        >
          {MENU_ITEMS.filter((itm) => itm).map((item) => (
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
    </div>
  );
}

export default memo(Menu);
