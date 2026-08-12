import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import UserPopover from "./UserPopover";

const ProfileHoverCard = ({ person, children, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, isAbove: false });
  const referenceRef = useRef(null);
  const hoverTimerRef = useRef(null);
  const leaveTimerRef = useRef(null);

  const calculatePosition = useCallback(() => {
    if (!referenceRef.current) return;
    const rect = referenceRef.current.getBoundingClientRect();
    const popoverWidth = 320; // max-w-sm width approximation
    const popoverHeight = 220; // estimated popover height
    const padding = 12;

    // Check space below vs space above
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const isAbove = spaceBelow < popoverHeight + padding && spaceAbove > spaceBelow;

    let top = isAbove ? rect.top - popoverHeight - 8 : rect.bottom + 8;
    // Bound top position inside viewport
    if (top < padding) top = padding;
    if (top + popoverHeight > window.innerHeight - padding) {
      top = window.innerHeight - popoverHeight - padding;
    }

    // Bound left position inside viewport
    let left = rect.left;
    if (left + popoverWidth > window.innerWidth - padding) {
      left = window.innerWidth - popoverWidth - padding;
    }
    if (left < padding) left = padding;

    setCoords({ top, left, isAbove });
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    
    // Slight 180ms delay to prevent accidental popups when quickly moving cursor across feed
    hoverTimerRef.current = setTimeout(() => {
      calculatePosition();
      setIsOpen(true);
    }, 180);
  }, [calculatePosition]);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    
    // Grace period (300ms) before unmounting so cursor movement into popover is smooth
    leaveTimerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 300);
  }, []);

  // Recalculate on window scroll or resize if open
  useEffect(() => {
    if (!isOpen) return;

    const handleScrollOrResize = () => {
      calculatePosition();
    };

    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen, calculatePosition]);

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    };
  }, []);

  return (
    <div
      className={`inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={referenceRef} className="cursor-pointer">
        {children}
      </div>

      {isOpen &&
        person &&
        ReactDOM.createPortal(
          <div
            style={{
              position: "fixed",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              zIndex: 9999,
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="animate-in fade-in zoom-in-95 duration-150 pointer-events-auto"
          >
            {/* Invisible Hover Bridge Buffer */}
            <div className="absolute -top-3 -bottom-3 -left-3 -right-3 -z-10 bg-transparent" />

            <UserPopover person={person} />
          </div>,
          document.body
        )}
    </div>
  );
};

export default React.memo(ProfileHoverCard);
