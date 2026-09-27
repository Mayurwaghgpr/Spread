import { memo, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import LogoutBtn from "../buttons/LogoutBtn";
import ProfileImage from "../ProfileImage";
import userImageSrc from "../../utils/functions/userImageSrc";
import useIcons from "../../hooks/useIcons";

function DesktopTooltip({ isOpen, onClose }) {
  const { isLogin, user } = useSelector((state) => state.auth);
  const { userImageurl } = userImageSrc(user);
  const icons = useIcons();

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !isLogin || !user) return null;

  return (
    <>
      {/* Invisible backdrop to capture clicks outside */}
      <div
        className="fixed inset-0 z-40 bg-transparent"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="user-menu-button"
        className="absolute top-full right-0 mt-2.5 w-64 z-50 rounded-2xl bg-[#fffdfa] dark:bg-[#121215] border border-[#e5dfd5] dark:border-[#232328] shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl"
      >
        {/* User Capsule */}
        <Link
          to={`/profile/@${user?.username}/${user?.id}`}
          onClick={onClose}
          className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#f7f4ee] dark:hover:bg-[#18181c] transition-colors group"
        >
          <ProfileImage
            image={userImageurl}
            className="w-10 h-10 border border-[#e5dfd5] dark:border-[#232328] rounded-full object-cover shrink-0"
            alt={user?.displayName || user?.username}
          />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-stone-900 dark:text-stone-100 text-xs sm:text-sm truncate group-hover:underline">
              {user?.displayName || user?.username}
            </p>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
              @{user?.username}
            </p>
          </div>
        </Link>

        {/* Divider */}
        <hr className="my-1.5 border-[#e5dfd5]/80 dark:border-[#232328]/80" />

        {/* Nav Links */}
        <div className="space-y-0.5">
          <Link
            to={`/profile/@${user?.username}/${user?.id}`}
            onClick={onClose}
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-[#f7f4ee] dark:hover:bg-[#18181c] rounded-xl transition-colors"
          >
            <span className="text-sm">{icons.user}</span>
            <span>View Profile</span>
          </Link>

          <Link
            to="/saved"
            onClick={onClose}
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-[#f7f4ee] dark:hover:bg-[#18181c] rounded-xl transition-colors"
          >
            <span className="text-sm">{icons.bookmarkO}</span>
            <span>Saved Stories</span>
          </Link>

          <Link
            to="/setting"
            onClick={onClose}
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-[#f7f4ee] dark:hover:bg-[#18181c] rounded-xl transition-colors"
          >
            <span className="text-sm">{icons.gearO}</span>
            <span>Settings</span>
          </Link>
        </div>

        {/* Divider */}
        <hr className="my-1.5 border-[#e5dfd5]/80 dark:border-[#232328]/80" />

        {/* Logout Button */}
        <div className="pt-0.5">
          <LogoutBtn
            onClick={onClose}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer"
          />
        </div>
      </div>
    </>
  );
}

export default memo(DesktopTooltip);
