import React, { useState, useEffect } from "react";

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    // Function to handle scroll event
    const toggleVisibility = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.scrollHeight
      ) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", toggleVisibility);

    // Clean up
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <div
          title="Scroll to Top"
          className={`fixed transition-all duration-500 z-30 right-10 bottom-10 shadow-md text-inherit  border border-inherit rounded-xl p-2  capitalize`}
        >
          <i className="bi bi-arrow-up"></i>
        </div>
      )}
    </>
  );
}

export default ScrollToTopButton;
