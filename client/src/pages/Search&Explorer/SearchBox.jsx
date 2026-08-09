import React, { memo, useState, useCallback, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { debounce } from "../../utils/functions/debounce";
import usePublicApis from "../../services/publicApis";
import Spinner from "../../components/loaders/Spinner";
import SearchBar from "../../components/inputComponents/SearchBar";
import useIcons from "../../hooks/useIcons";
import Ibutton from "../../components/buttons/Ibutton";

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

  // Handle tag selection
  const handleTagSelect = useCallback(
    (tag) => {
      navigate(`/?tag=${encodeURIComponent(tag)}`);
    },
    [navigate]
  );

  // Handle search button action
  const handleSearchAction = useCallback(() => {
    const tag = searchParams.get("tag");
    if (tag) {
      navigate(`/?tag=${tag}`);
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

  // Handle container click (prevent event bubbling)
  const handleContainerClick = useCallback((e) => {
    e.stopPropagation();
    navigate(-1);
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
      className="flex flex-col w-full items-center h-screen border-inherit p-10 "
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-title"
    >
      <header className="flex   max-w-4xl w-full  text-2xl  mx-auto">
        <Ibutton action={handleContainerClick}>{icons["arrowL"]}</Ibutton>
        <h1 id="search-title" className="text-3xl font-semibold mx-auto">
          Search & Explore
        </h1>
      </header>
      <div className="relative flex flex-col justify-start items-center gap-3 w-full max-w-2xl rounded-2xl p-6 spread-card mt-20 mx-4">
        <div className="w-full border-inherit">
          <SearchBar
            ref={searchRef}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="flex justify-center px-3 p-2 w-full items-center gap-3 rounded-xl border border-inherit bg-light dark:bg-dark placeholder:text-stone-400"
            inputAction={handleInputChange}
            btnAction={handleSearchAction}
            value={searchQuery}
            placeholder="Search tags..."
            aria-label="Search tags"
            aria-expanded={showResults}
            aria-haspopup="listbox"
          />
        </div>

        {showResults && (
          <div
            role="listbox"
            aria-live="polite"
            className={`flex justify-center items-center w-full border rounded-xl shadow-sm transition-all duration-300 border-inherit bg-light dark:bg-dark ${
              scrollDirection === "down"
                ? "-translate-y-8 opacity-0"
                : "translate-y-0 opacity-100"
            }`}
          >
            {isLoading ? (
              <div className="flex justify-center p-4">
                <Spinner className="w-5 h-5 dark:bg-stone-100 bg-stone-900 p-0.5" />
                <span className="sr-only">Searching...</span>
              </div>
            ) : searchResult.length > 0 ? (
              <ul className="flex w-full flex-col gap-1 py-2 max-h-60 overflow-y-auto">
                {searchResult.map((searchres, idx) => (
                  <li
                    key={searchres?.id || idx}
                    role="option"
                    className="cursor-pointer p-2 px-3 flex justify-start items-center gap-3 rounded-lg hover:bg-[#f5f1ec] dark:hover:bg-[#121212] duration-200 text-stone-900 dark:text-stone-100"
                    onMouseDown={() => handleTagSelect(searchres?.tag)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleTagSelect(searchres?.tag);
                      }
                    }}
                  >
                    <span className="font-thin text-lg" aria-hidden="true">
                      {icons["search"]}
                    </span>
                    <span className="font-medium">{searchres?.tag}</span>
                  </li>
                ))}
              </ul>
            ) : searchQuery.trim() ? (
              <div className="w-full px-3 flex justify-start items-center gap-3 p-3 text-stone-500 dark:text-stone-400">
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
