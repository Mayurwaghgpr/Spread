import React, { useEffect, useMemo } from "react";
import PeoplesList from "./PeoplesList";
import { useInfiniteQuery, useMutation } from "react-query";
import usePublicApis from "../services/publicApis";
import { useLastItemObserver } from "../hooks/useLastItemObserver";
import ProfileImage from "./ProfileImage";
import DisplayUsername from "./DisplayUsername";
import userImageSrc from "../utils/userImageSrc";
function UserNamesSuggestion({
  mentionedUsername,
  className = "",
  selectUserData,
}) {
  const { fetchPeopels } = usePublicApis();
  const { data, fetchNextPage, isFetchingNextPage, isFetching, hasNextPage } =
    useInfiniteQuery(
      ["people_to_mention", mentionedUsername],
      ({ pageParam = new Date().toISOString() }) =>
        fetchPeopels({ pageParam, mentionedUsername }),
      {
        getNextPageParam: (lastPage) => {
          return lastPage.length !== 0
            ? lastPage[lastPage.length - 1].createdAt
            : undefined; // Use last data id as cursor
        },
        refetchOnWindowFocus: false,
      }
    );
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

  return (
    <div
      className={`absolute -top-40 z-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg  overflow-y-auto max-h-40 w-fit ${className}`}
    >
      <ul className="p-2 flex flex-col items-center justify-start gap-3 w-full min-w-32">
        {(!isFetching ? peoples : [...Array(10).fill(null)]).map(
          (item, idx, arr) => {
            const { userImageurl } = userImageSrc(item);
            return (
              <li
                className={`flex justify-start items-center gap-3 w-full ${isFetching ? "cursor-not-allowed" : "cursor-pointer"}`}
                key={item?.id || idx}
                ref={idx === arr.length - 1 ? lastItemRef : null}
                onClick={() => !isFetching && selectUserData(item)}
              >
                <ProfileImage
                  className={`rounded-full w-6 min-w-max h-6 ${!item && " dark:bg-white bg-black bg-opacity-30 dark:bg-opacity-30 animate-pulse "}`}
                  image={userImageurl}
                />
                <DisplayUsername
                  className={`${!item && "p-2 w-full rounded-full  dark:bg-white bg-black bg-opacity-30 dark:bg-opacity-30 animate-pulse"}`}
                  username={item?.username}
                />
              </li>
            );
          }
        )}
        {!isFetching && peoples.length == 0 && (
          <div className=" opacity-20">No user found </div>
        )}
      </ul>
    </div>
  );
}

export default UserNamesSuggestion;
