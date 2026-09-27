import { useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import useIcons from "../../hooks/useIcons";

function TaskBar() {
  const location = useLocation();
  const icons = useIcons();

  const navLinks = useMemo(
    () => [
      {
        id: "home",
        label: "Home",
        iconDefault: icons.homeO,
        iconActive: icons.homeFi,
        stub: "/",
        exact: true,
      },
      {
        id: "search",
        label: "Search & Explore",
        iconDefault: icons.searchO,
        iconActive: icons.search,
        stub: "/search",
      },
      {
        id: "write",
        label: "Write Story",
        iconDefault: icons.fetherO,
        iconActive: icons.fetherFi,
        stub: "/write",
        isAction: true,
      },
      {
        id: "saved",
        label: "Saved Stories",
        iconDefault: icons.libraryO,
        iconActive: icons.libraryFi,
        stub: "/saved",
      },
    ],
    [icons]
  );

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 z-40 flex justify-center items-center w-full border-t border-stone-200/80 dark:border-stone-800/80 bg-stone-50/95 dark:bg-stone-950/95 backdrop-blur-xl sm:hidden py-1 safe-area-bottom"
    >
      <div className="flex justify-around items-center w-full max-w-md px-2">
        {navLinks.map((link) => {
          const isActive = link.exact
            ? location.pathname === link.stub
            : location.pathname.startsWith(link.stub);

          if (link.isAction) {
            return (
              <NavLink
                key={link.id}
                to={link.stub}
                aria-label={link.label}
                title={link.label}
                className="flex items-center justify-center w-12 h-12 rounded-full spread-btn-primary shadow-md hover:scale-105 transition-all text-xl cursor-pointer"
              >
                <span className="w-5 h-5 flex items-center justify-center">
                  {isActive ? link.iconActive : link.iconDefault}
                </span>
              </NavLink>
            );
          }

          return (
            <NavLink
              key={link.id}
              to={link.stub}
              aria-label={link.label}
              title={link.label}
              className={`flex flex-col items-center justify-center min-w-[3rem] h-12 rounded-2xl transition-all cursor-pointer ${
                isActive
                  ? "text-stone-900 dark:text-stone-100 font-bold"
                  : "text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
              }`}
            >
              <span className="text-xl flex items-center justify-center">
                {isActive ? link.iconActive : link.iconDefault}
              </span>
              <span className="text-[10px] tracking-tight mt-0.5 font-medium">
                {link.label.split(" ")[0]}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

export default TaskBar;
