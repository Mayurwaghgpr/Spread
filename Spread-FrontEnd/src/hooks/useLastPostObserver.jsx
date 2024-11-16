import { useCallback, useRef } from "react";

function useLastPostObserver(
  fetchNextPage,
  isFetchingNextPage,
  isFetching,
  hasNextPage
) {
  const intObserver = useRef(); // Initialize the observer reference

  const lastpostRef = useCallback(
    (post) => {
      if (isFetchingNextPage || isFetching || !hasNextPage) return;

      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage) {
            fetchNextPage();
          }
        },
        {
          threshold: 1.0,
        }
      );

      if (post) intObserver.current.observe(post);
    },
    [isFetchingNextPage, isFetching, hasNextPage, fetchNextPage]
  );

  return { lastpostRef };
}

export default useLastPostObserver;
