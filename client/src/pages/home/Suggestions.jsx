import React, { memo, useMemo } from "react";
import { useLastItemObserver } from "../../hooks/useLastItemObserver";
import { useInfiniteQuery } from "react-query";
import usePublicApis from "../../services/publicApis";
import Follow from "../../component/buttons/follow";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Search, Users, Loader2, RefreshCw } from "lucide-react";
import ProfileImage from "../../component/ProfileImage";
import userImageSrc from "../../utils/userImageSrc";
import Heading from "../../component/texts/Heading";
import SubHeading from "../../component/texts/SubHeading";
import Paragraph from "../../component/texts/Paragraph";
import Spinner from "../../component/loaders/Spinner";
import ProfileListItemLoadingSkeleton from "../../component/loaders/ProfileListItemLoadingSkeleton";
import EmptyState from "../../component/utilityComp/EmptyState";
function Suggestions() {
  const { fetchPeopels } = usePublicApis();
  const location = useLocation();

  const {
    data: peopleData,
    error: errorPeoples,
    isError: isPeoplesError,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery(
    ["find_people"],
    ({ pageParam }) => fetchPeopels({ pageParam }),
    {
      getNextPageParam: (lastPage) => {
        return lastPage.length !== 0
          ? lastPage[lastPage.length - 1].createdAt
          : undefined;
      },
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const { lastItemRef } = useLastItemObserver(
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    hasNextPage
  );
  console.log(lastItemRef);
  const peoples = useMemo(
    () => peopleData?.pages.flatMap((page) => page) || [],
    [peopleData?.pages]
  );

  // Error state component
  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
        <RefreshCw className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        Unable to load suggestions
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-sm">
        Something went wrong while fetching people suggestions. Please try
        again.
      </p>
      <button
        onClick={() => refetch()}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </button>
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
        <Users className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        No suggestions available
      </h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-sm">
        We couldn't find any people to suggest right now. Check back later for
        new recommendations.
      </p>
    </div>
  );

  return (
    <div className="h-screen bg-light dark:bg-dark w-full overflow-scroll border-inherit ">
      {/* Container with better responsive breakpoints */}
      <div className="max-w-7xl h-full mx-auto px-4 sm:px-6 lg:px-8 border-inherit">
        {/* Header Section - Improved sticky behavior and responsive design */}
        <div className="sticky top-0 z-20 bg-light/80 dark:bg-dark/80 backdrop-blur-md border-b dark:border-gray-800 py-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Title with icon */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-300 to-amber-600 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Discover People
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 hidden sm:block">
                  Find and connect with interesting people
                </p>
              </div>
            </div>

            {/* Navigation tabs - Better mobile design */}
            <nav className="flex items-center border-inherit">
              <div className="flex items-center gap-2  p-1">
                <NavLink
                  to="/suggestions/find_peoples"
                  className={({ isActive }) =>
                    `text-sm font-medium transition-all duration-200 ${
                      isActive || location.pathname.includes("find_peoples")
                        ? "border-b pb-1"
                        : ""
                    }`
                  }
                >
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span className="hidden sm:inline">People</span>
                  </span>
                </NavLink>
                {/* <NavLink
                  to="/suggestions/publication"
                  className={({ isActive }) =>
                    `text-sm font-medium transition-all duration-200 ${
                      isActive || location.pathname.includes("find_peoples")
                        ? "border-b pb-1"
                        : ""
                    }`
                  }
                >
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span className="hidden sm:inline">Publication</span>
                  </span>
                </NavLink> */}
                {/* Add more nav items here if needed */}
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-4xl mx-auto border-inherit">
          {/* Stats/Info Bar */}
          {!isLoading && !isPeoplesError && peoples.length > 0 && (
            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Users className="w-4 h-4" />
                <span>{peoples.length} people found</span>
              </div>
              {isFetching && !isFetchingNextPage && (
                <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                  <Spinner className="w-4 h-4 p-1 animate-spin" />
                  <span>Refreshing...</span>
                </div>
              )}
            </div>
          )}
          {/* Content Area */}

          {isLoading ? (
            <ProfileListItemLoadingSkeleton count={10} />
          ) : (
            <ul className="space-y-3 border-inherit pb-24">
              {peoples.map((person, idx, arr) => {
                const { userImageurl } = userImageSrc(person);
                return (
                  <li
                    key={person?.id || idx}
                    ref={idx === arr.length - 1 ? lastItemRef : null}
                    className="flex items-center justify-between bg-light dark:bg-dark rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md dark:shadow-gray-900/10 border border-inherit transition-all "
                  >
                    <div className="flex items-center justify-start gap-5 w-full border-inherit">
                      <ProfileImage
                        className={`w-8 h-8 rounded-full transition-opacity duration-200`}
                        image={person && userImageurl}
                      />
                      <div className=" text-nowrap w-full space-y-2">
                        <Heading className="w-[30%] text-sm">
                          {person?.displayName}
                        </Heading>
                        <SubHeading className="text-sm w-[20%]">
                          {person?.username}
                        </SubHeading>
                        <Paragraph className={"w-3/4"}>{person?.bio}</Paragraph>
                      </div>
                    </div>
                    {/* Enhanced Follow Button */}
                    <Follow
                      className="inline-flex items-center justify-center px-6 py-2.5 text-sm rounded-full transition-all duration-200 hover:scale-105 min-w-[100px] sm:min-w-[120px]"
                      person={person}
                    />
                  </li>
                );
              })}

              {/* Loading more indicator */}
              {isFetchingNextPage && (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <Spinner className="w-5 h-5 p-1 animate-spin" />
                    <span className="text-sm">Loading more people...</span>
                  </div>
                </div>
              )}

              {/* End of list indicator */}
              {!hasNextPage && !isFetchingNextPage && peoples.length > 0 && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-full">
                    <Users className="w-4 h-4" />
                    <span>You've seen all suggestions</span>
                  </div>
                </div>
              )}
              {isPeoplesError && !isLoading && <ErrorState />}
              {peoples.length === 0 && !isLoading && (
                <EmptyState
                  Icon={Users}
                  heading={" No suggestions available"}
                  description={
                    " We couldn't find any people to suggest right now. Check back later for  new recommendations."
                  }
                />
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(Suggestions);
