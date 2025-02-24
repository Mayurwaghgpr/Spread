import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { memo, useState } from "react";
import {
  BsBellFill,
  BsHandThumbsUp,
  BsHandThumbsUpFill,
  BsLightbulb,
} from "react-icons/bs";
import { MdCelebration, MdMessage } from "react-icons/md";
import { IoHappyOutline } from "react-icons/io5";
import { PiHandsClappingFill } from "react-icons/pi";
import { MdAutoAwesome } from "react-icons/md";

import { FaComment, FaHandHoldingHeart } from "react-icons/fa6";
import { RiUserFollowLine } from "react-icons/ri";
import { VscMention } from "react-icons/vsc";
import { FaUserTag } from "react-icons/fa6";
import { PiAlarm } from "react-icons/pi";
import { BiRepost } from "react-icons/bi";
import { GrSystem } from "react-icons/gr";
import { IoCloseOutline } from "react-icons/io5";
function useIcons() {
  return {
    like: <BsHandThumbsUpFill />,
    cheer: <PiHandsClappingFill />,
    celebration: <MdCelebration />,
    appreciate: <MdAutoAwesome />,
    helpfull: <FaHandHoldingHeart />,
    smile: <IoHappyOutline />,
    comment: <FaComment />,
    follow: <RiUserFollowLine />,
    message: <MdMessage />,
    mention: <VscMention />,
    tag: <FaUserTag />,
    reminder: <PiAlarm />,
    system: <GrSystem />,
    repost: <BiRepost />,
    close: <IoCloseOutline />,
    bell: <BsBellFill />,
    default: <BsHandThumbsUp />,
  };
}

export default useIcons;
