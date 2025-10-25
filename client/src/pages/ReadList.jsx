import { useMemo } from "react";
import { useInfiniteQuery } from "react-query";
import PostPreview from "../component/postsComp/PostPreview";
import Spinner from "../component/loaders/Spinner";
import { useLastItemObserver } from "../hooks/useLastItemObserver";
import useProfileApi from "../services/ProfileApis";
import useIcons from "../hooks/useIcons";

const ReadList = () => {
  const { getArchivedPosts } = useProfileApi();
  const icons = useIcons();
  const {
    data,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    hasNextPage,
  } = useInfiniteQuery(
    ["posts"],
    ({ pageParam = new Date().toISOString() }) =>
      getArchivedPosts({ pageParam }),
    {
      getNextPageParam: (lastPage) => {
        return lastPage.length !== 0
          ? lastPage[lastPage.length - 1].createdAt
          : undefined; // Use last post's timestamp as cursor
      },
      refetchOnWindowFocus: false,
    }
  );
  // console.log({ pages });
  const { lastItemRef } = useLastItemObserver(
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    hasNextPage
  );
  // console.log("saved", data);
  const pages = useMemo(
    () => data?.pages.flatMap((page) => page) || [],
    [data?.pages]
  );

  return (
    <div className=" flex flex-col justify-start items-start w-full h-full  xl:items-center border-inherit overflow-scroll ">
      <div className=" sticky top-0 flex  justify-end items-center gap-4 w-full z-10  border-inherit  ">
        <div className=" flex justify-start items-center gap-4 w-full h-full p-7 bg-light dark:bg-dark  border-b border-inherit">
          <span className="border rounded-lg p-2 border-inherit">
            {icons["book"]}
          </span>
          <div>
            <h1 className="text-3xl ">Read list </h1>
            <p className="text-sm opacity-50">Read posts you have saved</p>
          </div>
        </div>
      </div>
      <div className="pb-20 pt-10 max-w-2xl w-full border-inherit space-y-5">
        {(!isLoading ? pages : [...Array(10)])?.map((page, idx) => (
          <PostPreview
            className={" w-full  border"}
            ref={pages?.length % 3 === 0 ? lastItemRef : null}
            key={idx}
            post={page}
            Saved={true}
          />
        ))}

        {isFetchingNextPage && (
          <div className="w-full flex justify-center items-center  p-5">
            <Spinner
              className={"w-8 h-8 p-1 border-t-black dark:border-t-white"}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadList;
