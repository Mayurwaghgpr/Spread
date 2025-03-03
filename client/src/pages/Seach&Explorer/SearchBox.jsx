import React, { memo, useState } from "react";
import { useMutation } from "react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { debounce } from "../../utils/debounce";
import usePublicApis from "../../Apis/publicApis";
import Spinner from "../../component/loaders/Spinner";
import { IoCloseOutline } from "react-icons/io5";
import SearchBar from "../../component/inputComponents/SearchBar";
function SearchBox({ className, scrollDirection }) {
  const [isFocused, setIsFocused] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [searchParams] = useSearchParams();
  const cache = new Map();
  const navigate = useNavigate();
  const { fetchSearchData } = usePublicApis();
  const { isLoading, mutate } = useMutation({
    mutationKey: ["searchQuery"],
    mutationFn: (search) => search && fetchSearchData(search),
    onSuccess: (data) => {
      setSearchResult(data.data);
      cache.set(data.key, data.data);
    },
  });

  const searchDebounce = debounce((value) => {
    if (cache.has(value.toString())) {
      setSearchResult(cache.get(value.toString()));
    } else {
      mutate(value);
    }
  }, 500);

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex z-[100] bg-black bg-opacity-15 flex-col  w-full items-center h-screen border-inherit">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col justify-start  items-center gap-3 sm:w-1/3 p-6 border-inherit mt-20 m-auto "
      >
        <div className="w-full bg-white dark:bg-black rounded-xl rounded-b-3xl">
          <div className="flex justify-between w-full text-2xl p-2">
            <span>Search</span>
            <button onClick={() => navigate(-1)} className="">
              <IoCloseOutline />
            </button>
          </div>
          <SearchBar
            className=" flex justify-center pr-3  w-full items-center gap-3 rounded-full border overflow-hidden border-inherit"
            inputAction={({ target: { value } }) =>
              searchDebounce(value.trim())
            }
            btnAction={() => navigate(`/?topic=${searchParams.get("topic")}`)}
          />
        </div>
        {isFocused && (
          <div
            aria-live="polite"
            className={`flex justify-center items-center rounded-xl border  w-full l transition-all duration-700  border-inherit ${
              scrollDirection === "down"
                ? "-translate-y-36 opacity-0"
                : "translate-y-0 opacity-100"
            }`}
          >
            {searchResult?.length > 0 ? (
              <ul className="flex w-full flex-col gap-2 py-3">
                {searchResult.map((searchres, idx) => (
                  <li
                    className="cursor-pointer p-2 px-3 flex justify-start items-center gap-3 hover:bg-gray-500 hover:bg-opacity-25  duration-200"
                    key={idx}
                    onMouseDown={() => navigate(`/?topic=${searchres?.topic}`)}
                  >
                    <span className="font-thin text-lg">
                      <i className="bi bi-search"></i>
                    </span>
                    <b>{searchres?.topic}</b>
                  </li>
                ))}
              </ul>
            ) : isLoading ? (
              <Spinner className={"w-10 h-10 dark:border-white border-black"} />
            ) : (
              <div className="cursor-pointer w-full px-3 flex justify-start items-center gap-3 p-3">
                No Result Found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(SearchBox);
