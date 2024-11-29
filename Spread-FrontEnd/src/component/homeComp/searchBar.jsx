import React, { memo, useState } from "react";
import { useQuery } from "react-query";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { debounce } from "../../utils/debounce";
import usePublicApis from "../../Apis/publicApis";

function SearchBar({ className, isSearchBar, scrollDirection }) {
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { fetchSearchData } = usePublicApis();
  const location = useLocation();
  console.log(location);
  const { data, isFetching } = useQuery({
    queryKey: ["searchQuery", search],
    queryFn: () => search && fetchSearchData(search),
    onSuccess: () => {},
    enabled: !!search,
  });
  const searchDebounce = debounce((value) => {
    console.log(value);
    setSearch(value);
  }, 500);

  return (
    <div
      onClick={() => navigate(-1)}
      className={`fixed top-0 left-0 right-0 bottom-0 flex z-[100] bg-black bg-opacity-15 flex-col justify-center w-full items-center  h-screen`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col justify-start h-1/2 items-center gap-3 w-1/3  p-6"
      >
        <div
          className={` bg-white  flex justify-center pr-3 text-black w-full  items-center gap-3 bg-inherit  rounded-full border overflow-hidden  `}
        >
          <input
            className="  p-2 pl-3 w-full outline-none   "
            placeholder="search"
            type="search"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={({ target: { value } }) => searchDebounce(value.trim())}
          />
          <button
            onClick={() => {
              // setSearchParams({ topic: search });
              navigate(`/?topic=${search}`);
            }}
            className=""
          >
            <i className="bi bi-search"></i>
          </button>
        </div>
        {/* Search Results List */}
        {isFocused && data && (
          <div
            className={`mx-2  rounded-xl border bg-inherit dark:bg-black bg-white  w-full transition-all duration-700 overflow-hidden  ${
              scrollDirection == "down"
                ? "-translate-y-36 opacity-0 "
                : "translate-y-0 opacity-100"
            }`}
          >
            {data.length > 0 ? (
              <ul className="flex flex-col gap-2 py-3  rounded-f">
                {data?.map((searchres, idx) => (
                  <li
                    className="cursor-pointer p-2 px-3 flex justify-start items-center gap-3 hover:bg-slate-800 hover:bg-opacity-40 duration-200"
                    key={idx}
                    onMouseDown={() => {
                      // setSearchParams({ topic: searchres.topic });
                      navigate(`/?topic=${searchres?.topic}`);
                    }}
                  >
                    <span className="font-thin text-lg">
                      <i className="bi bi-search"></i>
                    </span>
                    <b>{searchres?.topic}</b>
                  </li>
                ))}
                {/* {isFetching && <Spinner />} */}
              </ul>
            ) : (
              <div className="cursor-pointer px-3 flex justify-start items-center gap-3 p-3  border rounded-xl border-slate-500 ">
                {" "}
                No Result Found{" "}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(SearchBar);
