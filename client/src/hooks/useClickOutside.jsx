import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function useClickOutside(MenuRef) {
  const { isLogin } = useSelector((state) => state.auth);
  const [isFixed, setFixed] = useState(false);
  const [menuId, setMenuId] = useState(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (MenuRef?.current && !MenuRef.current.contains(event.target)) {
        setMenuId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [MenuRef]);

  useEffect(() => {
    let scrollTimeout;
    const handleScroll = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setFixed(window.scrollY > 10);
      }, 100); // Debounced delay
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return {
    isFixed,
    menuId,
    setMenuId,
  };
}

export default useClickOutside;
