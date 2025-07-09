import React, { memo, useCallback } from "react";
import useIcons from "../../../hooks/useIcons";

// Configuration for reaction buttons
const REACTIONS = [
  { name: "like", label: "Like" },
  { name: "cheer", label: "Cheer" },
  { name: "celebration", label: "Celebration" },
  { name: "appreciate", label: "Appreciate" }, // Fixed typo
  { name: "helpfull", label: "Helpful" }, // Fixed typo and name consistency
  { name: "smile", label: "Smile" },
];

// Reusable button component
const ReactionButton = memo(({ reaction, icon, onReact }) => {
  const handleClick = useCallback(
    (e) => {
      e.stopPropagation();
      onReact(reaction.name);
    },
    [reaction.name, onReact]
  );

  const handleMouseOut = useCallback((e) => {
    e.stopPropagation();
  }, []);

  return (
    <button
      name={reaction.name}
      onClick={handleClick}
      onMouseOut={handleMouseOut}
      className="group/button relative bg-white dark:bg-[#191818] rounded-full p-2 cursor-pointer transition-all duration-300 hover:-translate-y-5 hover:scale-150"
      aria-label={`React with ${reaction.label}`}
      title={reaction.label}
    >
      {/* Tooltip */}
      <span className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover/button:flex justify-center items-center h-4 text-[.6rem] px-1 bg-black dark:bg-white dark:text-black text-white bg-opacity-50 rounded-lg whitespace-nowrap">
        {reaction.label.toLowerCase()}
      </span>
      {icon}
    </button>
  );
});

ReactionButton.displayName = "ReactionButton";

function LikesList({ mutate, post }) {
  const icons = useIcons();

  const handleReaction = useCallback(
    (reactionName) => {
      if (mutate) {
        // Create a synthetic event-like object with the reaction name
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
      className="absolute hidden group-hover:flex justify-start items-center shadow-xl z-10 -top-12 -left-1/2 bg-[#e8e4df] dark:bg-[#191818] gap-2 p-2 rounded-full"
      role="toolbar"
      aria-label="Reaction options"
    >
      {REACTIONS.map((reaction) => (
        <ReactionButton
          key={reaction.name}
          reaction={reaction}
          icon={icons[reaction.name]}
          onReact={handleReaction}
        />
      ))}
    </div>
  );
}

export default memo(LikesList);
