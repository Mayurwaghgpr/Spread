import { useState, useMemo, useCallback, useRef } from "react";
import useProfileApi from "../services/useProfileApis";
import { debounce } from "../utils/functions/debounce";

export const USERNAME_REGEX = /^[a-z0-9_]{3,15}$/;

export function useUsernameAvailability(initialUsername = "") {
  const [username, setUsername] = useState(initialUsername);
  const [status, setStatus] = useState("idle"); // 'idle' | 'invalid' | 'loading' | 'available' | 'taken'
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const { searchUsername } = useProfileApi();
  const latestQueryRef = useRef("");

  const generateSuggestions = useCallback((base) => {
    const clean = base.toLowerCase().replace(/[^a-z0-9_]/g, "");
    if (!clean) return [];
    return [
      `${clean}_dev`,
      `${clean}_spread`,
      `${clean}${Math.floor(10 + Math.random() * 89)}`,
    ];
  }, []);

  const performCheck = useCallback(
    async (targetUsername) => {
      const cleanVal = targetUsername.toLowerCase().trim();
      latestQueryRef.current = cleanVal;

      if (!cleanVal) {
        setStatus("idle");
        setMessage("");
        setSuggestions([]);
        return;
      }

      if (!USERNAME_REGEX.test(cleanVal)) {
        setStatus("invalid");
        if (cleanVal.length < 3) {
          setMessage("Username must be at least 3 characters");
        } else if (cleanVal.length > 15) {
          setMessage("Username must be 15 characters or less");
        } else {
          setMessage("Only letters, numbers, and underscores allowed (e.g. no '@' or spaces)");
        }
        setSuggestions([]);
        return;
      }

      setStatus("loading");
      setMessage("Checking availability...");

      try {
        const result = await searchUsername({ username: cleanVal });

        // Ignore stale out-of-order responses
        if (latestQueryRef.current !== cleanVal) return;

        setStatus("available");
        setMessage("Username is available ✨");
        setSuggestions([]);
      } catch (err) {
        // Ignore stale out-of-order responses
        if (latestQueryRef.current !== cleanVal) return;

        const errStatus = err?.status || err?.response?.status;
        const isExist = err?.data?.exist || err?.response?.data?.exist;

        if (errStatus === 409 || isExist) {
          setStatus("taken");
          setMessage("Username is already taken");
          setSuggestions(generateSuggestions(cleanVal));
        } else {
          setStatus("invalid");
          setMessage(
            err?.data?.message ||
              err?.response?.data?.message ||
              "Error checking username"
          );
          setSuggestions([]);
        }
      }
    },
    [searchUsername, generateSuggestions]
  );

  const debouncedSearch = useMemo(
    () => debounce((val) => performCheck(val), 150),
    [performCheck]
  );

  const handleUsernameChange = useCallback(
    (rawVal) => {
      // Store exact raw input so typed characters like '@' or spaces remain visible to the user
      setUsername(rawVal);
      const cleanVal = rawVal.trim();
      latestQueryRef.current = cleanVal;

      if (!cleanVal) {
        setStatus("idle");
        setMessage("");
        setSuggestions([]);
      } else if (!USERNAME_REGEX.test(cleanVal)) {
        setStatus("invalid");
        if (cleanVal.length < 3) {
          setMessage("Username must be at least 3 characters");
        } else if (cleanVal.length > 15) {
          setMessage("Username must be 15 characters or less");
        } else {
          setMessage("Only letters, numbers, and underscores allowed (e.g. no '@' or spaces)");
        }
        setSuggestions([]);
      } else {
        setStatus("loading");
        setMessage("Checking availability...");
        debouncedSearch(cleanVal);
      }
    },
    [debouncedSearch]
  );

  const selectSuggestion = useCallback(
    (suggestedHandle) => {
      setUsername(suggestedHandle);
      performCheck(suggestedHandle);
    },
    [performCheck]
  );

  return {
    username,
    setUsername,
    status,
    message,
    suggestions,
    handleUsernameChange,
    selectSuggestion,
    isAvailable: status === "available",
    isLoading: status === "loading",
  };
}
