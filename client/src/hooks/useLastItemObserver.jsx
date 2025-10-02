import { useCallback, useEffect, useRef } from "react";

export function useLastItemObserver(
  fetchNextPage,
  isFetchingNextPage,
  isFetching,
  hasNextPage,
  threshold = 1
) {
  const intObserver = useRef(null);

  const lastItemRef = useCallback(
    (post) => {
      if (isFetchingNextPage || isFetching || !hasNextPage) return;

      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        },
        {
          threshold,
        }
      );

      if (post) intObserver.current.observe(post);
    },
    [isFetchingNextPage, isFetching, hasNextPage, fetchNextPage, threshold]
  );

  useEffect(() => {
    return () => {
      if (intObserver.current) {
        intObserver.current.disconnect();
      }
    };
  }, []);

  return { lastItemRef };
}
