import { useEffect, useRef, useState } from "react";
import "./index.css";

// hooks
import useFetchApi from "../../hooks/useFetch";

// Icons
import SearchIcon from "../icons/SearchIcon";

// Utils
import debounce from "../../util/debouncing";

// Components
import ResultItemCard from "../ResultItemCard";
import NoDataFound from "../NoDataFound";

const url = "https://mocki.io/v1/a0f57a34-3afb-467e-94dd-b6fc5d2e28af";

const Search = () => {
  const { data } = useFetchApi(url);
  const resultContainerRef = useRef(null);

  const [openDropdown, setOpenDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [usingArrowKeys, setUsingArrowKeys] = useState(false);

  const handleDebouneSearch = debounce((query) => {
    const lowerCaseQuery = query.toLowerCase();
    const results = data?.filter((item) => {
      return Object.values(item).some((value) => {
        if (typeof value === "string") {
          return value.toLowerCase().includes(lowerCaseQuery);
        }
        if (Array.isArray(value)) {
          return value.some((item) =>
            item.toLowerCase().includes(lowerCaseQuery)
          );
        }
        return false;
      });
    });
    setSearchResults(results);
  }, 300);

  const handleSearch = (query) => {
    if (!query) {
      setOpenDropdown(false);
      setSearchResults(null);
    } else {
      handleDebouneSearch(query);
    }
  };

  const handleChange = (event) => {
    handlePreventDefault(event);
    setSearchQuery(event.target.value);
    handleSearch(event.target.value);
    setOpenDropdown(true);
  };
  const handleMouseEnter = (index) => {
    if (!usingArrowKeys) {
      setFocusedIndex(index);
    }
  };
  const handleMouseLeave = () => {
    if (!usingArrowKeys) {
      setFocusedIndex(null);
    }
  };
  const handleKeyDown = (event) => {
    if (openDropdown && searchResults && searchResults.length > 0) {
      setUsingArrowKeys(true);
      setFocusedIndex((prevIndex) => {
        if (event.key === "ArrowDown") {
          let updatedIndex =
            prevIndex === null
              ? 0
              : Math.min(prevIndex + 1, searchResults.length - 1);
          setSearchQuery(searchResults[updatedIndex]?.name || searchQuery);
          return updatedIndex;
        }
        if (event.key === "ArrowUp") {
          let updatedIndex =
            prevIndex === null
              ? searchResults.length - 1
              : Math.max(prevIndex - 1, 0);
          setSearchQuery(searchResults[updatedIndex]?.name || searchQuery);
          return updatedIndex;
        }
        return prevIndex;
      });
      if (event.key === "Enter") {
        handleSearch(searchResults[focusedIndex]?.name || searchQuery);
      }
    }
  };

  const handleKeyUp = () => {
    setUsingArrowKeys(false);
  };
  const handleDropdownClickOutside = (event) => {
    if (
      resultContainerRef.current &&
      !resultContainerRef.current.contains(event.target)
    ) {
      setOpenDropdown(false);
    }
  };
  const handleResultItemClick = (e, name) => {
    handlePreventDefault(e);
    if (name) {
      setSearchQuery(name);
      handleSearch(name);
    }
  };
  const handlePreventDefault = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  const handleInputFocus = () => {
    if (searchResults && searchResults.length > 0) {
      setOpenDropdown(true);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleDropdownClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleDropdownClickOutside);
    };
  }, []);

  useEffect(() => {
    if (resultContainerRef.current && focusedIndex !== null) {
      resultContainerRef.current.children[focusedIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [focusedIndex]);

  return (
    <div className="wrapper">
      <div>
        <h2>Search Assignment</h2>
        <div className="searchbox-container">
          <div className="search-input-container">
            <SearchIcon />
            <input
              type="text"
              id="search"
              autoComplete="off"
              value={searchQuery}
              className="search-input"
              onChange={handleChange}
              onFocus={handleInputFocus}
              required
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
            />
          </div>
          {openDropdown && searchResults && (
            <div className="search-result-container" ref={resultContainerRef}>
              {searchResults.length > 0 ? (
                searchResults.map((result, index) => (
                  <ResultItemCard
                    key={result.id}
                    item={result}
                    searchQuery={searchQuery}
                    onMouseEnter={(e) => {
                      handlePreventDefault(e);
                      handleMouseEnter(index);
                    }}
                    onClick={(e) => {
                      handleResultItemClick(e, result?.name);
                    }}
                    isFocused={focusedIndex === index}
                    onMouseLeave={(e) => {
                      handlePreventDefault(e);
                      handleMouseLeave();
                    }}
                  />
                ))
              ) : (
                <NoDataFound />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
