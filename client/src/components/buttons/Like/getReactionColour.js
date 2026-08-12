export const getReactionColour = (reaction, selector = false) => {
  const baseStyles = {
    like: " text-blue-500 transition-all duration-300",
    cheer: " text-emerald-500 transition-all duration-300",
    celebration: " text-stone-700 dark:text-stone-300 transition-all duration-300",
    appreciate: " text-cyan-500 transition-all duration-300",
    helpful: " text-violet-500 transition-all duration-300",
    smile: " text-rose-500 transition-all duration-300",
  };

  const selectorStyles = {
    like: "bg-gradient-to-br from-blue-400 to-blue-500 dark:from-blue-400 dark:to-blue-500 border border-blue-400/60 dark:border-blue-400 hover:scale-105",

    cheer:
      "bg-gradient-to-br from-emerald-400 to-emerald-500 dark:from-emerald-400 dark:to-emerald-500 border border-emerald-400/60 dark:border-emerald-400 hover:scale-105",

    celebration:
      "bg-stone-800 text-stone-100 dark:bg-stone-100 dark:text-stone-900 border border-stone-700 hover:scale-105",

    appreciate:
      "bg-gradient-to-br from-cyan-400 to-cyan-500 dark:from-cyan-400 dark:to-cyan-500 border border-cyan-400/60 dark:border-cyan-400 hover:scale-105",

    helpful:
      "bg-gradient-to-br from-violet-400 to-violet-500 dark:from-violet-400 dark:to-violet-500 border border-violet-400/60 dark:border-violet-400 hover:scale-105",

    smile:
      "bg-gradient-to-br from-rose-400 to-rose-500 dark:from-rose-400 dark:to-rose-500 border border-rose-400/60 dark:border-rose-400 hover:scale-105",
  };

  const selectorStyle = selector
    ? selectorStyles[reaction]
    : baseStyles[reaction];

  return `${selectorStyle}`.trim();
};
