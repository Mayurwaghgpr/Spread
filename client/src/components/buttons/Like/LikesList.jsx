import React, { memo, useCallback } from "react";
import useIcons from "../../../hooks/useIcons";
import { getReactionColour } from "./getReactionColour";

const REACTIONS = [
  { name: "like", label: "Like" },
  { name: "cheer", label: "Cheer" },
  { name: "celebration", label: "Celebration" },
  { name: "appreciate", label: "Appreciate" },
  { name: "helpful", label: "Helpful" },
  { name: "smile", label: "Smile" },
];

const ReactionButton = memo(({ reaction, icon, onReact, index }) => {
  const handleClick = useCallback(
    (e) => {
      e.stopPropagation();
      onReact(reaction.name);
    },
    [reaction.name, onReact]
  );

  return (
    <button
      name={reaction.name}
      onClick={handleClick}
      style={{ animationDelay: `${index * 30}ms` }}
      className={`group/button relative rounded-full p-2 cursor-pointer transition-all duration-200 ease-out hover:-translate-y-3 hover:scale-140 text-xs ${getReactionColour(
        reaction.name,
        false
      )} hover:bg-[#fff9f3] dark:hover:bg-[#080808] hover:shadow-md`}
      aria-label={`React with ${reaction.label}`}
      title={reaction.label}
    >
      {/* Tooltip */}
      <span className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover/button:flex justify-center items-center h-5 text-[10px] font-bold px-2 bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 rounded-lg shadow-lg whitespace-nowrap border border-inherit transition-all animate-in fade-in duration-150">
        {reaction.label}
      </span>
      <span className="text-lg flex items-center justify-center transition-transform duration-200">
        {icon}
      </span>
    </button>
  );
});

ReactionButton.displayName = "ReactionButton";

function LikesList({ mutate, isVisible, onMouseEnter, onMouseLeave }) {
  const icons = useIcons();

  const handleReaction = useCallback(
    (reactionName) => {
      if (mutate) {
        const syntheticEvent = {
          target: { name: reactionName },
          currentTarget: { name: reactionName },
          stopPropagation: () => {},
          preventDefault: () => {},
        };
        mutate(syntheticEvent);
      }
    },
    [mutate]
  );

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`absolute z-30 -top-14 -left-2 flex items-center gap-1 p-1.5 rounded-full bg-[#f5f1ec]/95 dark:bg-[#121212]/95 border border-inherit shadow-2xl backdrop-blur-md transition-all duration-300 ease-out origin-bottom-left ${
        isVisible
          ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
          : "opacity-0 scale-90 translate-y-3 pointer-events-none"
      }`}
      role="toolbar"
      aria-label="Reaction options"
    >
      {/* Invisible Hover Bridge Buffer */}
      <div className="absolute -bottom-4 left-0 right-0 h-4 bg-transparent pointer-events-auto" />

      {REACTIONS.map((reaction, idx) => (
        <ReactionButton
          key={reaction.name}
          index={idx}
          reaction={reaction}
          icon={icons[reaction.name]}
          onReact={handleReaction}
        />
      ))}
    </div>
  );
}

export default memo(LikesList);
