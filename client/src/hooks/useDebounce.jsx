import React, { useEffect, useState } from "react";

function useDebouned(value, delay = 300) {
  const [deboucedValue, setDeboucedValue] = useState();
  useEffect(() => {
    let timer = setTimeout(() => setDeboucedValue(value), delay);
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  return deboucedValue;
}

export default useDebouned;
