import { memo, useMemo } from "react";
import { useLastItemObserver } from "../../hooks/useLastItemObserver";
import { useInfiniteQuery } from "react-query";
import usePublicApis from "../../services/publicApis";
import Follow from "../../component/buttons/follow";
import { NavLink, useLocation } from "react-router-dom";
import { Users } from "lucide-react";
import ProfileImage from "../../component/ProfileImage";
import userImageSrc from "../../utils/userImageSrc";
import Heading from "../../component/texts/Heading";
import SubHeading from "../../component/texts/SubHeading";
import Paragraph from "../../component/texts/Paragraph";
import Spinner from "../../component/loaders/Spinner";
import ProfileListItemLoadingSkeleton from "../../component/loaders/ProfileListItemLoadingSkeleton";
import EmptyState from "../../component/utilityComp/EmptyState";
function Suggestions() {
  const { fetchPeopel } = usePublicApis();
  const location = useLocation();

  const {
    data,
    isError,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["find_people"],
    queryFn: ({ pageParam }) => fetchPeopel({ pageParam }),
    getNextPageParam: (lastPage) => {
      return lastPage.length !== 0
        ? lastPage[lastPage.length - 1].createdAt
        : undefined;
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { lastItemRef } = useLastItemObserver(
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    hasNextPage
  );
  const peoples = useMemo(
    () => data?.pages.flatMap((page) => page) || [],
    [data?.pages]
  );
  // Define links array
  const navLinks = [
    { to: "/suggestions/find_peoples", label: "People", icon: Users },
    // { to: "/suggestions/publication", label: "Publication", icon: Users },
  ];

  const navLinkBase =
    "text-xs font-medium transition-all duration-200 border-b  border-inherit before:border-inherit  rounded-br-xl px-4 py-1 gap-5  before:border-r before:absolute before:w-8 before:h-8 before:-right-[8px] before:-top-4 before:rotate-[36deg] before:-z-10";

  return (
    <div className="h-screen bg-light dark:bg-dark w-full overflow-scroll border-inherit ">
      {/* Container with better responsive breakpoints */}
      <div className="max-w-7xl h-full mx-auto border-inherit">
        <div className="mb-6 border-inherit">
          {/* Header Section - Improved sticky behavior and responsive design */}
          <div className="sticky top-0 z-20 bg-light/80 dark:bg-dark/80 backdrop-blur-md border-b border-inherit  py-4 px-6 ">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-inherit ">
              {/* Title with icon */}
              <div className="flex items-center gap-3 border-inherit ">
                <div className="w-10 h-10 rounded-xl border border-inherit  flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Discover People
                  </h1>
                  <p className="text-sm opacity-50 mt-1 hidden sm:block">
                    Find and connect with interesting people
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Navigation tabs - Better mobile design */}
          <nav className="flex items-center w-fit border-inherit ">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <div
                key={to}
                className="relative flex z-10 items-center border-inherit"
              >
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `${navLinkBase} ${
                      isActive ||
                      location.pathname.includes(to.split("/").pop())
                        ? ""
                        : ""
                    }
                    `
                  }
                >
                  <span className="flex items-center gap-2 border-inherit ">
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{label}</span>
                  </span>
                </NavLink>
              </div>
            ))}
          </nav>
        </div>
        {/* Main Content Area */}
        <div className="max-w-4xl mx-auto border-inherit">
          {/* Stats/Info Bar */}
          {!isLoading && !isError && peoples.length > 0 && (
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
                      <div className=" text-nowrap w-full">
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
