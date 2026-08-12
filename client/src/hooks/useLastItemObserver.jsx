import { useCallback, useEffect, useRef } from "react";

export function useLastItemObserver(
  fetchNextPage,
  isFetchingNextPage,
  isFetching,
  hasNextPage,
  threshold = 0.1
) {
  const intObserver = useRef(null);

  const lastItemRef = useCallback(
    (node) => {
      if (isFetchingNextPage || !hasNextPage) return;

      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        },
        {
          rootMargin: "250px",
          threshold: Math.min(threshold, 0.1),
        }
      );

      if (node) intObserver.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage, threshold]
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
