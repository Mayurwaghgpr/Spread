import React, { memo, useMemo } from "react";
import { useLastItemObserver } from "../../hooks/useLastItemObserver";
import { useInfiniteQuery } from "react-query";
import usePublicApis from "../../Apis/publicApis";
import PeoplesList from "../../component/PeoplesList";
import Follow from "../../component/buttons/follow";

function FindMoreUsers() {
  const { fetchPeopels } = usePublicApis();
  const {
    data: peopleData,
    error: errorPeoples,
    isError: isPeoplesError,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteQuery(
    ["find_people"],
    ({ pageParam }) => fetchPeopels({ pageParam }),
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
    () => peopleData?.pages.flatMap((page) => page) || [],
    [peopleData?.pages]
  );
  console.log(peoples);
  return (
    <section className="w-full h-screen overflow-y-auto">
      <ul className="flex flex-col justify-start items-start gap-5  mt-20 h-full max-w-[50%] mx-auto ">
        {peoples.map((pers, idx, arr) => (
          <PeoplesList
            key={pers.id}
            ref={idx === arr.length ? lastItemRef : null}
            people={pers}
            className=" flex justify-between items-center  w-full "
          >
            <Follow
              className="flex justify-center items-center text-black  text-sm border p-1  transition-all px-5 duration-100 bg-white hover:bg-gray-300 rounded-full"
              People={pers}
            />
          </PeoplesList>
        ))}
      </ul>
    </section>
  );
}

export default memo(FindMoreUsers);
