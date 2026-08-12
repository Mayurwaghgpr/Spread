import React from "react";

const EmptyState = ({ Icon, heading, description }) => {
  const renderIcon = () => {
    if (!Icon) return null;
    if (React.isValidElement(Icon)) return Icon;
    if (typeof Icon === "function" || (typeof Icon === "object" && (Icon.$$typeof || Icon.render))) {
      const Component = Icon;
      return <Component className="w-8 h-8 text-stone-600 dark:text-stone-400" />;
    }
    return Icon;
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center w-full">
      <div className="w-16 h-16 bg-stone-200/60 dark:bg-stone-800/60 rounded-full flex items-center justify-center mb-4 text-stone-700 dark:text-stone-300">
        {renderIcon()}
      </div>
      <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">
        {heading}
      </h3>
      <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default EmptyState;
