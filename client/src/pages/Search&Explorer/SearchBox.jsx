import React, { memo, useState, useCallback, useRef, useEffect } from "react";
import { useMutation } from "react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { debounce } from "../../utils/debounce";
import usePublicApis from "../../services/publicApis";
import Spinner from "../../component/loaders/Spinner";
import SearchBar from "../../component/inputComponents/SearchBar";
import useIcons from "../../hooks/useIcons";
import Ibutton from "../../component/buttons/Ibutton";

function SearchBox({ className, scrollDirection }) {
  const [isFocused, setIsFocused] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const icons = useIcons();
  const searchRef = useRef(null);
  const { fetchSearchData } = usePublicApis();
  const { isLoading, mutate } = useMutation({
    mutationKey: ["searchQuery"],
    mutationFn: (search) => search && fetchSearchData(search),
    onSuccess: (data) => {
      setSearchResult(data?.data || []);
    },
    onError: (error) => {
      console.error("Search error:", error);
      setSearchResult([]);
    },
  });

  // Memoized debounced search function
  const searchDebounce = useCallback(
    debounce((value) => {
      if (value.trim()) {
        mutate(value.trim());
      } else {
        setSearchResult([]);
      }
    }, 500),
    [mutate]
  );

  // Handle input change
  const handleInputChange = useCallback(
    ({ target: { value } }) => {
      setSearchQuery(value);
      searchDebounce(value);
    },
    [searchDebounce]
  );

  // Handle topic selection
  const handleTopicSelect = useCallback(
    (topic) => {
      navigate(`/?topic=${encodeURIComponent(topic)}`);
    },
    [navigate]
  );

  // Handle search button action
  const handleSearchAction = useCallback(() => {
    const topic = searchParams.get("topic");
    if (topic) {
      navigate(`/?topic=${topic}`);
    }
  }, [navigate, searchParams]);

  // Handle focus
  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  // Handle blur with delay to allow for click events
  const handleBlur = useCallback(() => {
    setTimeout(() => setIsFocused(false), 150);
  }, []);

  // Handle backdrop click
  const handleBackdropClick = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Handle container click (prevent event bubbling)
  const handleContainerClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        navigate(-1);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  // Auto-focus search input
  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
  }, []);

  const showResults =
    isFocused && (searchResult.length > 0 || isLoading || searchQuery.trim());

  return (
    <div
      className="flex flex-col w-full items-center h-screen border-inherit mt-20 "
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-title"
    >
      <header className="w-full  text-2xl px-20">
        <Ibutton action={handleContainerClick}>{icons["arrowL"]}</Ibutton>
      </header>
      <div className="relative flex flex-col justify-start items-center gap-3 w-full max-w-2xl rounded-lg p-6 bg-[#fff9f3] dark:bg-black border-inherit mt-20 mx-4">
        <h1 id="search-title" className="text-3xl font-semibold">
          Search & Explore
        </h1>

        <div className="w-full dark:bg-black border-inherit">
          <SearchBar
            ref={searchRef}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="flex justify-center px-3 p-2 w-full items-center gap-3 rounded-full border overflow-hidden border-inherit placeholder:text-inherit"
            inputAction={handleInputChange}
            btnAction={handleSearchAction}
            value={searchQuery}
            placeholder="Search topics..."
            aria-label="Search topics"
            aria-expanded={showResults}
            aria-haspopup="listbox"
          />
        </div>

        {showResults && (
          <div
            role="listbox"
            aria-live="polite"
            className={`flex justify-center items-center w-full border rounded-sm shadow-sm transition-all duration-300 border-inherit ${
              scrollDirection === "down"
                ? "-translate-y-8 opacity-0"
                : "translate-y-0 opacity-100"
            }`}
          >
            {isLoading ? (
              <div className="flex justify-center p-4">
                <Spinner className="w-5 h-5 dark:bg-white bg-black p-0.5" />
                <span className="sr-only">Searching...</span>
              </div>
            ) : searchResult.length > 0 ? (
              <ul className="flex w-full flex-col gap-1 py-2 max-h-60 overflow-y-auto">
                {searchResult.map((searchres, idx) => (
                  <li
                    key={searchres?.id || idx}
                    role="option"
                    className="cursor-pointer p-2 px-3 flex justify-start items-center gap-3 rounded-lg hover:bg-gray-300 hover:bg-opacity-30 duration-200 focus:bg-gray-300 focus:bg-opacity-30"
                    onMouseDown={() => handleTopicSelect(searchres?.topic)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleTopicSelect(searchres?.topic);
                      }
                    }}
                  >
                    <span className="font-thin text-lg" aria-hidden="true">
                      {icons["search"]}
                    </span>
                    <span className="font-medium">{searchres?.topic}</span>
                  </li>
                ))}
              </ul>
            ) : searchQuery.trim() ? (
              <div className="w-full px-3 flex justify-start items-center gap-3 p-3 text-gray-500">
                <span className="font-thin text-lg" aria-hidden="true">
                  {icons["search"]}
                </span>
                No results found for "{searchQuery}"
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(SearchBox);
