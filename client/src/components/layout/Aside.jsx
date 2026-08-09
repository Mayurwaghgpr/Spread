import TopicsSkeletonLoader from "../loaders/TopicsSkeletonLoader";
import { Link } from "react-router-dom";
import WhoToFollow from "../../pages/home/WhoToFollow";
import usePublicApis from "../../services/publicApis";
import { useQuery } from "@tanstack/react-query";

function Aside({ className, handleTopicClick }) {
  const { fetchQuickTags } = usePublicApis();

  // Fetch tags
  const { data: tags, isLoading } = useQuery({
    queryKey: ["quick_tags"],
    queryFn: fetchQuickTags,
    refetchOnMount: false,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return (
    <aside className={`space-y-6 text-stone-900 dark:text-stone-100 ${className}`}>
      {/* Trending Topics Section */}
      <div className="flex flex-col w-full items-start gap-3 border-inherit">
        <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
          Trending topics
        </h2>
        <div className="flex items-start w-full flex-col">
          <ul className="flex flex-wrap gap-2 w-full">
            {tags?.length > 0 &&
              tags?.map(({ tagName }, index) => (
                <li key={tagName || index}>
                  <button
                    onClick={() => handleTopicClick(tagName)}
                    aria-label={`Select topic ${tagName}`}
                    className="spread-pill text-xs font-semibold px-3 py-1 hover:scale-105 transition-transform cursor-pointer"
                  >
                    #{tagName}
                  </button>
                </li>
              ))}
            {isLoading && <TopicsSkeletonLoader count={8} />}
          </ul>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-stone-200 dark:border-stone-800" />

      {/* Who To Follow Section */}
      <WhoToFollow className="flex flex-col justify-start items-start gap-3 text-xs border-inherit" />

      {/* Footer Legal & Copyright */}
      <footer className="pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-stone-500 dark:text-stone-400 font-medium">
        <Link to="#" className="hover:underline hover:text-stone-800 dark:hover:text-stone-200">
          Terms of Service
        </Link>
        <Link to="#" className="hover:underline hover:text-stone-800 dark:hover:text-stone-200">
          Privacy Policy
        </Link>
        <span>© 2024 Spread</span>
      </footer>
    </aside>
  );
}

export default Aside;
