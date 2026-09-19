import { memo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import userImageSrc from "../../utils/functions/userImageSrc";
import ProfileImage from "../../components/ProfileImage";
import useIcons from "../../hooks/useIcons";

function AccountSettings() {
  const icons = useIcons();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { userImageurl } = userImageSrc(user);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
          Account & Profile
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Manage your account information and public profile details.
        </p>
      </div>

      {/* User Profile Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-stone-100/60 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <ProfileImage
            className="w-16 h-16 rounded-full shrink-0 ring-2 ring-stone-300 dark:ring-stone-700"
            image={userImageurl}
            alt={user?.displayName || user?.username}
          />
          <div className="min-w-0 space-y-0.5">
            <h3 className="text-base font-extrabold text-stone-900 dark:text-stone-100 truncate">
              {user?.displayName || user?.username || "User Account"}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
              @{user?.username || "username"}
            </p>
            <div className="flex items-center gap-1.5 pt-1 text-[11px] text-stone-500 dark:text-stone-400">
              <span className="text-xs">{icons.email}</span>
              <span className="truncate">{user?.email || "No email linked"}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-200 dark:border-stone-800">
          <button
            type="button"
            onClick={() => navigate(`/profile/@${user?.username}/${user?.id}`)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800/60 transition-colors cursor-pointer"
          >
            <span className="text-xs">{icons.exLink}</span>
            <span>View Profile</span>
          </button>
        </div>
      </div>

      {/* Account Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-stone-100/40 dark:bg-stone-800/20 border border-stone-200 dark:border-stone-800 space-y-1">
          <span className="text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
            Authentication
          </span>
          <div className="flex items-center gap-2 pt-1 text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
            <span className="text-emerald-500 text-sm">{icons.shieldCheck}</span>
            <span>{user?.signedWith === "manual" ? "Password Authenticated" : `${user?.signedWith || "Google"} OAuth`}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-stone-100/40 dark:bg-stone-800/20 border border-stone-200 dark:border-stone-800 space-y-1">
          <span className="text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
            User ID
          </span>
          <div className="font-mono text-xs text-stone-700 dark:text-stone-300 truncate pt-1">
            {user?.id || "N/A"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(AccountSettings);
