import { forwardRef, memo } from "react";
import useIcons from "../../hooks/useIcons";
import { MoreHorizontal, Trash2, Link as LinkIcon, Share2, Edit3 } from "lucide-react";

const Menu = forwardRef(function (
  { content, items, className = "", menuId, setMenuId },
  ref,
) {
  const icons = useIcons();

  if (!content || !items || !items.length) return null;

  const isOpen = menuId === content?.id;

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuId((prev) => (prev === content?.id ? null : content?.id));
  };

  const getLucideIcon = (iconName) => {
    switch (iconName) {
      case "link":
        return <LinkIcon className="w-4 h-4 text-stone-500 dark:text-stone-400" />;
      case "share":
        return <Share2 className="w-4 h-4 text-stone-500 dark:text-stone-400" />;
      case "delete1":
      case "delete":
        return <Trash2 className="w-4 h-4 text-red-500" />;
      case "penO":
      case "edit":
        return <Edit3 className="w-4 h-4 text-stone-700 dark:text-stone-300" />;
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
        className="p-1.5 rounded-full hover:bg-stone-200/60 dark:hover:bg-stone-800/60 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors active:scale-95 cursor-pointer flex items-center justify-center"
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>

      {/* Backdrop for Closing Menu */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => setMenuId(null)}
        />
      )}

      {/* Popover Menu Container */}
      {isOpen && (
        <div
          className={`absolute right-0 top-9 z-50 min-w-[170px] spread-card p-1.5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl backdrop-blur-xl bg-stone-100/95 dark:bg-stone-900/95 animate-in fade-in zoom-in-95 duration-150 origin-top-right ${className}`}
        >
          <ul className="flex flex-col gap-0.5 text-xs font-semibold text-stone-800 dark:text-stone-200">
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
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors text-left cursor-pointer ${
                      isDelete
                        ? "text-red-600 dark:text-red-400 hover:bg-red-500/10"
                        : "hover:bg-stone-200/70 dark:hover:bg-stone-800/70"
                    }`}
                  >
                    <span className="shrink-0">{getLucideIcon(item.icon)}</span>
                    <span className="truncate">{item.itemName}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
});

export default memo(Menu);
