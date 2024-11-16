// import { useState, useEffect, useRef, useCallback } from "react";

// const useScrollDirection = (
//   threshold = 10,
//   maxNavTransform = -68,
//   maxMainTransform = 0
// ) => {
//   const [NavetransformY, setNavTransformY] = useState(0);
//   const [maintransformY, setmainTransformY] = useState(68);
//   const lastScrollY = useRef(0);
//   const ticking = useRef(false);

//   const updateTransformY = useCallback(() => {
//     const currentScrollY = window.scrollY;

//     if (
//       currentScrollY > lastScrollY.current ||
//       window.innerHeight + document.documentElement.scrollTop + 1 >=
//         document.documentElement.scrollHeight
//     ) {
//       // Scrolling down
//       setNavTransformY((prev) => Math.max(prev - threshold, maxNavTransform));
//       setmainTransformY((prev) => Math.max(prev - threshold, maxMainTransform));
//     } else {
//       // Scrolling up
//       setNavTransformY((prev) => Math.min(prev + threshold, 0));
//       setmainTransformY((prev) => Math.min(prev + threshold, 68));
//     }

//     lastScrollY.current = currentScrollY;
//     ticking.current = false;
//   }, [threshold, maxNavTransform, maxMainTransform]);

//   const handleScroll = useCallback(() => {
//     if (!ticking.current) {
//       window.requestAnimationFrame(updateTransformY);
//       ticking.current = true;
//     }
//   }, [updateTransformY]);

//   useEffect(() => {
//     window.addEventListener("scroll", handleScroll);
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, [handleScroll]);

//   return { NavetransformY, maintransformY };
// };

// export default useScrollDirection;
