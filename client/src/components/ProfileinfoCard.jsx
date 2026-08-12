import PeoplesList from "./PeoplesList";
import { memo } from "react";
import { PopupBox } from "./utilityComp/PopupBox";
import EmptyState from "./utilityComp/EmptyState";
import { X, Users, UserCheck } from "lucide-react";

function ProfileinfoCard({ action, kind, listData = [] }) {
  const isFollowers = kind === "followers";
  const title = isFollowers ? "Followers" : "Following";
  const IconHeader = isFollowers ? Users : UserCheck;

  return (
    <PopupBox
      action={action}
      className="relative flex flex-col max-w-md w-full h-[75vh] sm:h-[70vh] spread-card rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden backdrop-blur-xl animate-in zoom-in-95 duration-150"
    >
      {/* Header */}
      <header className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-100/50 dark:bg-stone-800/30">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-stone-200/60 dark:bg-stone-800/60 text-stone-900 dark:text-stone-100">
            <IconHeader className="w-5 h-5 text-stone-700 dark:text-stone-300" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
              {title}
            </h1>
            <span className="text-xs text-stone-500 dark:text-stone-400 font-semibold">
              {listData.length} {listData.length === 1 ? "person" : "people"}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={action}
          aria-label="Close modal"
          className="p-1.5 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* People List */}
      <main className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1">
        {listData && listData.length > 0 ? (
          listData.map((person) => (
            <PeoplesList key={person?.id || person?.username} person={person} />
          ))
        ) : (
          <div className="flex h-full w-full items-center justify-center p-6 text-center">
            <EmptyState
              Icon={IconHeader}
              heading={`No ${title.toLowerCase()} yet`}
              description={
                isFollowers
                  ? "When users follow this profile, they will appear here."
                  : "Accounts followed by this user will appear here."
              }
            />
          </div>
        )}
      </main>
    </PopupBox>
  );
}

export default memo(ProfileinfoCard);
