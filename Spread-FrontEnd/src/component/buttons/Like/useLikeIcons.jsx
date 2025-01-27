import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { memo, useState } from "react";
import {
  BsHandThumbsUp,
  BsHandThumbsUpFill,
  BsLightbulb,
} from "react-icons/bs";
import { MdCelebration, MdOutlineCelebration } from "react-icons/md";
import {
  IoBulbOutline,
  IoBulbSharp,
  IoHappyOutline,
  IoInformation,
  IoVideocam,
} from "react-icons/io5";
import {
  PiHandsClappingFill,
  PiHandsClappingLight,
  PiLightbulbLight,
} from "react-icons/pi";
import { MdAutoAwesome } from "react-icons/md";
import { useSelector } from "react-redux";
import { FaHandHoldingHeart } from "react-icons/fa6";
function useLikeIcons() {
  return {
    like: <BsHandThumbsUpFill />,
    cheer: <PiHandsClappingFill />,
    celebration: <MdCelebration />,
    appreciate: <MdAutoAwesome />,
    helpfull: <FaHandHoldingHeart />,
    smile: <IoHappyOutline />,
    default: <BsHandThumbsUp />,
  };
}

export default useLikeIcons;
