export const getReactionColour = (reaction, selector = false) => {
  const baseStyles = {
    like: "text-blue-500 hover:text-blue-600 transition-all duration-300",
    cheer:
      "text-emerald-500 hover:text-emerald-600 transition-all duration-300",
    celebration:
      "text-amber-500 hover:text-amber-600 transition-all duration-300",
    appreciate: "text-cyan-500 hover:text-cyan-600 transition-all duration-300",
    helpful:
      "text-violet-500 hover:text-violet-600 transition-all duration-300",
    smile: "text-orange-500 hover:text-orange-600 transition-all duration-300",
  };

  const selectorStyles = {
    like: "bg-gradient-to-br from-blue-400/30 to-blue-500/40 dark:from-blue-400/25 dark:to-blue-500/35 dark:backdrop-blur-xl border border-blue-400/60 dark:border-blue-400/40 shadow-lg shadow-blue-400/40 hover:shadow-xl hover:shadow-blue-400/60 hover:scale-105",

    cheer:
      "bg-gradient-to-br from-emerald-400/30 to-emerald-500/40 dark:from-emerald-400/25 dark:to-emerald-500/35 dark:backdrop-blur-xl border border-emerald-400/60 dark:border-emerald-400/40 shadow-lg shadow-emerald-400/40 hover:shadow-xl hover:shadow-emerald-400/60 hover:scale-105",

    celebration:
      "bg-gradient-to-br from-amber-400/30 to-amber-500/40 dark:from-amber-400/25 dark:to-amber-500/35 dark:backdrop-blur-xl border border-amber-400/60 dark:border-amber-400/40 shadow-lg shadow-amber-400/40 hover:shadow-xl hover:shadow-amber-400/60 hover:scale-105",

    appreciate:
      "bg-gradient-to-br from-cyan-400/30 to-cyan-500/40 dark:from-cyan-400/25 dark:to-cyan-500/35 dark:backdrop-blur-xl border border-cyan-400/60 dark:border-cyan-400/40 shadow-lg shadow-cyan-400/40 hover:shadow-xl hover:shadow-cyan-400/60 hover:scale-105",

    helpful:
      "bg-gradient-to-br from-violet-400/30 to-violet-500/40 dark:from-violet-400/25 dark:to-violet-500/35 dark:backdrop-blur-xl border border-violet-400/60 dark:border-violet-400/40 shadow-lg shadow-violet-400/40 hover:shadow-xl hover:shadow-violet-400/60 hover:scale-105",

    smile:
      "bg-gradient-to-br from-orange-400/30 to-orange-500/40 dark:from-orange-400/25 dark:to-orange-500/35 dark:backdrop-blur-xl border border-orange-400/60 dark:border-orange-400/40 shadow-lg shadow-orange-400/40 hover:shadow-xl hover:shadow-orange-400/60 hover:scale-105",
  };

  const base =
    baseStyles[reaction] ||
    "text-gray-500 hover:text-gray-600 transition-all duration-300";

  const selectorStyle = selector
    ? selectorStyles[reaction] ||
      "bg-gradient-to-br from-gray-400/30 to-gray-500/40 dark:from-gray-400/25 dark:to-gray-500/35 dark:backdrop-blur-xl border border-gray-400/60 dark:border-gray-400/40 shadow-lg shadow-gray-400/40 hover:shadow-xl hover:shadow-gray-400/60 hover:scale-105"
    : "";

  return `${base} ${selectorStyle}`.trim();
};
