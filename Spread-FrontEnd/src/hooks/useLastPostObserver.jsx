import { useCallback, useEffect, useRef } from "react";

function useLastPostObserver(
  fetchNextPage,
  isFetchingNextPage,
  isFetching,
  hasNextPage,
  threshold = 0.5
) {
  const intObserver = useRef(); // Initialize the observer reference

  const lastpostRef = useCallback(
    (post) => {
      if (isFetchingNextPage || isFetching || !hasNextPage) return;

      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver(
        (entries) => {
          console.log(entries);
          if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        },
        {
          threshold,
        }
      );

      if (post) intObserver.current.observe(post);
    },
    [isFetchingNextPage, isFetching, hasNextPage, fetchNextPage]
  );
  useEffect(() => {
    return () => {
      if (intObserver.current) {
        intObserver.current.disconnect();
        intObserver.current = null;
      }
    };
  }, []);
  return { lastpostRef };
}

export default useLastPostObserver;
