import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function useClickOutside(MenuRef, searchRef) {
  const { isLogin, user } = useSelector((state) => state.auth);
  const [isFixed, setFixed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuId, setMenuId] = useState("");
  useEffect(() => {
    function handleClickOutside(event) {
      if (MenuRef?.current && !MenuRef.current.contains(event.target)) {
        setMenuId("");
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // document.removeEventListener("scroll", handleClickOutside);
    };
  }, [MenuRef]);

  useEffect(() => {
    const handleScroll = () => {
      // Adjust scroll threshold based on your needs
      if (window.scrollY > 10) {
        setFixed(true);
      } else {
        setFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return {
    isFixed,
    isMenuOpen,
    setIsMenuOpen,
    menuId,
    setMenuId,
  };
}

export default useClickOutside;
