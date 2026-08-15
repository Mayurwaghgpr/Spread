import { forwardRef, memo, useState, useRef } from "react";
import useIcons from "../../hooks/useIcons";

const Menu = forwardRef(function (
  { content, items, className = "", menuId, setMenuId },
  ref,
) {
  const icons = useIcons();

  // Mobile drag-to-dismiss state
  const [dragY, setDragY] = useState(0);
  const touchStartY = useRef(0);

  if (!content || !items || !items.length) return null;

  const isOpen = menuId === content?.id;

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuId((prev) => (prev === content?.id ? null : content?.id));
  };

  const handleClose = () => {
    setMenuId(null);
  };

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - touchStartY.current;
    if (deltaY > 0) {
      setDragY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (dragY > 60) {
      handleClose();
    }
    setDragY(0);
  };

  const renderItemIcon = (iconName) => {
    switch (iconName) {
      case "link":
        return <span className="text-stone-500 dark:text-stone-400 text-sm">{icons.link}</span>;
      case "share":
        return <span className="text-stone-500 dark:text-stone-400 text-sm">{icons.share}</span>;
      case "delete1":
      case "delete":
        return <span className="text-red-500 text-sm">{icons.delete}</span>;
      case "penO":
      case "edit":
        return <span className="text-stone-700 dark:text-stone-300 text-sm">{icons.edit}</span>;
      default:
        return icons[iconName] || null;
    }
  };

  return (
    <div
      ref={ref}
      className="relative inline-block text-left border-inherit"
      onClick={(e) => e.stopPropagation()}
    >
      {/* ThreeDot Trigger Button */}
      <button
        type="button"
        onClick={toggleMenu}
        aria-label="Post actions menu"
        className="p-1.5 rounded-full hover:bg-stone-200/60 dark:hover:bg-stone-800/60 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors active:scale-95 cursor-pointer flex items-center justify-center min-w-[36px] min-h-[36px] text-lg"
      >
        {icons.ThreeDot}
      </button>

      {/* Backdrop for Closing Menu */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 sm:bg-transparent backdrop-blur-xs sm:backdrop-blur-none transition-opacity"
          onClick={handleClose}
        />
      )}

      {/* Menu Container: Draggable Bottom Sheet on Mobile, Absolute Popover on Desktop */}
      {isOpen && (
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            transform: dragY > 0 ? `translateY(${dragY}px)` : undefined,
            transition: dragY === 0 ? "transform 0.2s ease-out" : "none",
          }}
          className={`fixed inset-x-0 bottom-0 z-50 w-full max-h-[50vh] sm:max-h-none sm:w-auto sm:min-w-[180px] sm:absolute sm:right-0 sm:top-9 sm:bottom-auto sm:left-auto spread-card p-4 sm:p-1.5 rounded-t-3xl sm:rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl backdrop-blur-xl bg-stone-100/95 dark:bg-stone-900/95 animate-in slide-in-from-bottom-full sm:animate-in sm:fade-in sm:zoom-in-95 duration-300 ease-out origin-bottom sm:origin-top-right flex flex-col justify-between ${className}`}
        >
          {/* Mobile Drag Handle Bar */}
          <div className="sm:hidden w-full flex justify-center pb-3 cursor-grab active:cursor-grabbing">
            <div className="w-12 h-1.5 rounded-full bg-stone-300 dark:bg-stone-700" />
          </div>

          <ul className="flex flex-col gap-1 sm:gap-0.5 text-xs font-semibold text-stone-800 dark:text-stone-200 overflow-y-auto">
            {items.map((item) => {
              const isDelete = item.id.includes("delete");
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuId(null);
                      item.action(content.id);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 sm:py-2 rounded-xl transition-colors text-left cursor-pointer ${
                      isDelete
                        ? "text-red-600 dark:text-red-400 hover:bg-red-500/10 active:bg-red-500/20"
                        : "hover:bg-stone-200/70 dark:hover:bg-stone-800/70 active:bg-stone-200 dark:active:bg-stone-800"
                    }`}
                  >
                    <span className="shrink-0">{renderItemIcon(item.icon)}</span>
                    <span className="truncate text-xs font-bold sm:font-semibold">{item.itemName}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="sm:hidden pt-3">
            <button
              type="button"
              onClick={handleClose}
              className="w-full py-2.5 text-xs font-bold text-stone-600 dark:text-stone-400 bg-stone-200/60 dark:bg-stone-800/60 rounded-xl hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default memo(Menu);
