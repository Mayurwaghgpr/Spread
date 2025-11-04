import TopicsSkeletonLoader from "../loaders/TopicsSkeletonLoader";
import { Link } from "react-router-dom";
import WhoToFollow from "../../pages/home/WhoToFollow";
import usePublicApis from "../../services/publicApis";
import { useQuery } from "react-query";
// import { useSelector } from "react-redux";

function Aside({ className, handleTopicClick }) {
  const { fetchQuickTags } = usePublicApis();

  // Fetch tags
  const { data: tags, isLoading } = useQuery(
    "tranding_q_tags",
    fetchQuickTags,
    {
      refetchOnMount: false,
      staleTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  );
  console.log(tags);
  return (
    <aside className={`${className}`}>
      <div className="  flex flex-col w-full items-center text-start gap-2 border-inherit ">
        <h1 className=" text-start w-full text-lg font-medium">
          Trending topics
        </h1>
        <div className="flex justify-center items-start w-full flex-col">
          <ul className="flex justify-start flex-wrap gap-2">
            {tags?.length > 0 &&
              tags?.map(({ tagName }, index) => (
                <li
                  key={index}
                  className="rounded-full  border-gray-200 bg-gray-300  "
                >
                  <button
                    className="t-btn"
                    onClick={() => handleTopicClick(tagName)}
                    aria-label={`Select topic ${tagName}`}
                  >
                    <span>{tagName}</span>
                  </button>
                </li>
              ))}
            {tags?.length === 0 && isLoading && (
              <TopicsSkeletonLoader count={10} />
            )}
          </ul>
        </div>
      </div>

      <WhoToFollow
        className={
          " flex flex-col justify-start items-start gap-5 text-sm  border-inherit "
        }
      />
      <small className=" text-[#383838]">
        <Link className="" to="">
          Terms of Service
        </Link>
        <Link className="" to="">
          {" "}
          Privacy Policy
        </Link>{" "}
        © 2024 Spread
      </small>
    </aside>
  );
}

export default Aside;
