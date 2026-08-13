import PeoplesList from "./PeoplesList";
import { memo, useMemo } from "react";
import { PopupBox } from "./utilityComp/PopupBox";
import EmptyState from "./utilityComp/EmptyState";
import Spinner from "./loaders/Spinner";
import useIcons from "../hooks/useIcons";
import { useQuery } from "@tanstack/react-query";
import useProfileApi from "../services/useProfileApis";

function ProfileinfoCard({ action, kind, profileId, listData = [] }) {
  const icons = useIcons();
  const isFollowers = kind === "followers";
  const title = isFollowers ? "Followers" : "Following";
  const { fetchFollowInfo } = useProfileApi();

  const { data: fetchedData, isLoading } = useQuery({
    queryKey: ["followInfo", kind, profileId],
    queryFn: () => fetchFollowInfo({ FollowInfo: kind, profileId }),
    enabled: !!profileId && !!kind,
    refetchOnWindowFocus: false,
  });

  const effectiveListData = useMemo(() => {
    if (Array.isArray(fetchedData)) return fetchedData;
    return listData || [];
  }, [fetchedData, listData]);

  const showLoading = isLoading && (!effectiveListData.length || (!effectiveListData[0]?.displayName && !effectiveListData[0]?.username));

  return (
    <PopupBox
      action={action}
      className="relative flex flex-col max-w-md w-full h-[65vh] sm:h-[70vh] spread-card rounded-t-3xl sm:rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden backdrop-blur-xl animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-300 ease-out"
    >
      {/* Header */}
      <header className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-100/50 dark:bg-stone-800/30">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-stone-200/60 dark:bg-stone-800/60 text-stone-900 dark:text-stone-100 text-lg">
            {isFollowers ? icons.users : icons.userCheck}
          </div>
          <div>
            <h1 className="text-base font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
              {title}
            </h1>
            <span className="text-xs text-stone-500 dark:text-stone-400 font-semibold">
              {effectiveListData.length} {effectiveListData.length === 1 ? "person" : "people"}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={action}
          aria-label="Close modal"
          className="p-1.5 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer text-xl"
        >
          {icons.close}
        </button>
      </header>

      {/* People List */}
      <main className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1">
        {showLoading ? (
          <div className="flex h-full w-full items-center justify-center p-6">
            <Spinner className="w-7 h-7 text-stone-900 dark:text-stone-100" />
          </div>
        ) : effectiveListData && effectiveListData.length > 0 ? (
          effectiveListData.map((person) => (
            <PeoplesList key={person?.id || person?.username} person={person} />
          ))
        ) : (
          <div className="flex h-full w-full items-center justify-center p-6 text-center">
            <EmptyState
              Icon={isFollowers ? icons.users : icons.userCheck}
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
