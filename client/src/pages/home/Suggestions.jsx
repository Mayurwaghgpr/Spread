import { memo, useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import usePublicApis from "../../services/publicApis";
import { useLastItemObserver } from "../../hooks/useLastItemObserver";
import PeoplesList from "../../components/PeoplesList";
import Spinner from "../../components/loaders/Spinner";
import EmptyState from "../../components/utilityComp/EmptyState";
import Follow from "../../components/buttons/follow";
import AbbreviateNumber from "../../utils/components/AbbreviateNumber";
import { UserPlus, Sparkles, Users, AlertCircle } from "lucide-react";

function Suggestions() {
  const { fetchPeopel } = usePublicApis();

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    hasNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["PeopleSuggestionsPage"],
    queryFn: ({ pageParam = new Date().toISOString() }) =>
      fetchPeopel({ pageParam }),
    getNextPageParam: (lastPage) =>
      lastPage && lastPage.length > 0
        ? lastPage[lastPage.length - 1].createdAt
        : undefined,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  const { lastItemRef } = useLastItemObserver(
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    hasNextPage,
    0.1
  );

  const peoples = useMemo(
    () => data?.pages?.flatMap((page) => page) || [],
    [data?.pages]
  );

  return (
    <div className="flex flex-col items-center w-full min-h-screen border-inherit px-3 sm:px-6 py-6 max-w-4xl mx-auto space-y-6">
      {/* Hero Header Section */}
      <div className="w-full spread-card p-6 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-stone-200/70 dark:bg-stone-800/70 text-stone-900 dark:text-stone-100 shrink-0">
              <UserPlus className="w-7 h-7 text-stone-700 dark:text-stone-300" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight flex items-center gap-2">
                Discover People
                <Sparkles className="w-4 h-4 text-stone-700 dark:text-stone-300" />
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                Connect with tech writers, developers, and creators on Spread
              </p>
            </div>
          </div>
        </div>

        {/* Stats Highlight Bar */}
        {!isLoading && !isError && peoples.length > 0 && (
          <div className="pt-2 border-t border-stone-200/60 dark:border-stone-800/60 flex items-center gap-2 text-xs font-semibold text-stone-600 dark:text-stone-400">
            <Users className="w-4 h-4 text-stone-500" />
            <span>Showing <AbbreviateNumber rawNumber={peoples.length} /> suggested creators</span>
          </div>
        )}
      </div>

      {/* Main Suggestions Grid */}
      <div className="w-full spread-card p-4 sm:p-6 rounded-2xl border border-stone-200 dark:border-stone-800">
        {/* Loading Skeletons */}
        {isLoading && (
          <div className="divide-y divide-stone-200 dark:divide-stone-800">
            {Array(6)
              .fill(null)
              .map((_, idx) => (
                <div
                  key={`suggestion-skel-${idx}`}
                  className="p-4 flex items-center justify-between animate-pulse"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-stone-300 dark:bg-stone-700" />
                    <div className="space-y-2">
                      <div className="w-32 h-4 bg-stone-300 dark:bg-stone-700 rounded-full" />
                      <div className="w-20 h-3 bg-stone-300 dark:bg-stone-700 rounded-full" />
                    </div>
                  </div>
                  <div className="w-20 h-8 bg-stone-300 dark:bg-stone-700 rounded-full" />
                </div>
              ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Unable to load suggestions
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm">
              {error?.message || "An unexpected error occurred. Please try again later."}
            </p>
          </div>
        )}

        {/* Suggestions List */}
        {!isLoading && !isError && peoples.length > 0 && (
          <div className="divide-y divide-stone-200/60 dark:divide-stone-800/60">
            {peoples.map((person, idx, arr) => (
              <div
                key={person.id}
                ref={idx === arr.length - 1 ? lastItemRef : null}
                className="py-3 sm:py-4 px-2 flex items-center justify-between hover:bg-stone-200/40 dark:hover:bg-stone-800/40 rounded-xl transition-colors"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <PeoplesList person={person} />
                </div>
                <div className="shrink-0">
                  <Follow person={person} className="px-5 py-1.5 text-xs" />
                </div>
              </div>
            ))}

            {/* Pagination Spinner */}
            {isFetchingNextPage && (
              <div className="flex justify-center items-center py-6">
                <Spinner className="w-6 h-6 text-stone-900 dark:text-stone-100" />
              </div>
            )}

            {/* End of Suggestions Indicator */}
            {!hasNextPage && !isFetchingNextPage && peoples.length > 0 && (
              <div className="text-center py-6">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 dark:text-stone-400 spread-pill px-4 py-2 rounded-full">
                  <Users className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
                  <span>You've explored all user suggestions</span>
                </div>
              </div>
            )}

            {/* Empty State */}
            {peoples.length === 0 && !isLoading && (
              <div className="py-12 flex justify-center items-center text-center">
                <EmptyState
                  Icon={UserPlus}
                  heading="No suggestions found"
                  description="Check back later for new members joining Spread."
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(Suggestions);
