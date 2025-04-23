import React, { memo, useMemo } from "react";
import { useLastItemObserver } from "../../hooks/useLastItemObserver";
import { useInfiniteQuery } from "react-query";
import usePublicApis from "../../Apis/publicApis";
import PeoplesList from "../../component/PeoplesList";
import Follow from "../../component/buttons/follow";
import { Link, NavLink, useLocation } from "react-router-dom";

function Suggetions() {
  const { fetchPeopels } = usePublicApis();
  // const location = useLocation();
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
  return (
    <section className="grid grid-cols-10 grid-rows-12  w-full h-screen overflow-y-auto border-inherit  px-4">
      <div className="sticky top-16 flex flex-col justify-between sm:items-start sm:col-start-3 sm:col-span-5 col-span-full row-start-2 row-span-2 py-3  w-full h-full z-10 border-b border-inherit bg-[#fff9f3] dark:bg-black ">
        {/* <SearchBar className={" border rounded-full px-2"} /> */}
        <h1 className="text-2xl font-medium">Suggetions</h1>
        <ul className=" flex justify-start items-center gap-3 w-full *:transition-all *:duration-500">
          <NavLink
            isActive={(match, location) =>
              location.pathname.includes("publications")
            }
            className={({ isActive }) =>
              ` underline-offset-[1.1rem] ${isActive ? "underline" : "hover:underline"}`
            }
            to={"publications"}
          >
            Publications
          </NavLink>
          <NavLink
            isActive={(match, location) => {
              location.pathname.includes("find_peoples");
            }}
            className={({ isActive }) =>
              ` underline-offset-[1.1rem] ${isActive ? "underline" : "hover:underline"}`
            }
            to={"/find_peoples"}
          >
            Peoples
          </NavLink>
        </ul>
      </div>
      <ul className="flex flex-col justify-start items-start gap-5 sm:col-start-3 sm:col-span-5 col-span-full  row-start-4 py-4 row-span-full">
        {(peoples ? peoples : [...Array(10).fill(null)]).map(
          (pers, idx, arr) => (
            <PeoplesList
              key={pers?.id || idx}
              ref={idx === arr.length ? lastItemRef : null}
              people={pers}
              className=" flex justify-between items-center  w-full "
            >
              <Follow
                className="flex justify-center items-center text-black  text-sm border p-1  transition-all px-5 duration-100 bg-white hover:bg-gray-300 rounded-full"
                People={pers}
              />
            </PeoplesList>
          )
        )}
      </ul>
    </section>
  );
}

export default memo(Suggetions);
