import React from "react";
import {
  BsArrowLeft,
  BsBellFill,
  BsCameraVideo,
  BsGear,
  BsGearFill,
  BsHandThumbsUp,
  BsHandThumbsUpFill,
  BsLink,
  BsMoonStarsFill,
  BsSearch,
} from "react-icons/bs";
import { MdCelebration, MdMessage } from "react-icons/md";
import {
  IoCallOutline,
  IoHappyOutline,
  IoHomeOutline,
  IoHomeSharp,
  IoLibraryOutline,
  IoLibrarySharp,
  IoPersonAddOutline,
  IoSearch,
  IoSearchOutline,
  IoSunny,
} from "react-icons/io5";
import { PiHandsClappingFill } from "react-icons/pi";
import { MdAutoAwesome } from "react-icons/md";

import { FaComment, FaHandHoldingHeart } from "react-icons/fa6";
import {
  RiQuillPenFill,
  RiQuillPenLine,
  RiUserFollowLine,
} from "react-icons/ri";
import { VscMention } from "react-icons/vsc";
import { FaUserTag } from "react-icons/fa6";
import { PiAlarm } from "react-icons/pi";
import { BiCalendarAlt, BiRepost } from "react-icons/bi";
import { GrSystem } from "react-icons/gr";
import { IoCloseOutline } from "react-icons/io5";
import { AiOutlineSend } from "react-icons/ai";
import { LuLogOut } from "react-icons/lu";
import { TbMessageCircle, TbMessageCircleFilled } from "react-icons/tb";
import { HiOutlineComputerDesktop } from "react-icons/hi2";
function useIcons() {
  return {
    like: <BsHandThumbsUpFill />,
    logout: <LuLogOut />,
    cheer: <PiHandsClappingFill />,
    celebration: <MdCelebration />,
    appreciate: <MdAutoAwesome />,
    helpfull: <FaHandHoldingHeart />,
    smile: <IoHappyOutline />,
    comment: <FaComment />,
    follow: <RiUserFollowLine />,
    message: <TbMessageCircle />,
    messageFi: <TbMessageCircleFilled />,
    mention: <VscMention />,
    tag: <FaUserTag />,
    reminder: <PiAlarm />,
    system: <GrSystem />,
    repost: <BiRepost />,
    close: <IoCloseOutline />,
    bell: <BsBellFill />,
    search: <IoSearch />,
    searchO: <IoSearchOutline />,
    vCamera: <BsCameraVideo />,
    arrowL: <BsArrowLeft />,
    callO: <IoCallOutline />,
    sendO: <AiOutlineSend />,
    link: <BsLink />,
    homeO: <IoHomeOutline />,
    homeFi: <IoHomeSharp />,
    penO: <RiQuillPenLine />,
    penFi: <RiQuillPenFill />,
    libraryFi: <IoLibrarySharp />,
    libraryO: <IoLibraryOutline />,
    addPersonO: <IoPersonAddOutline />,
    gearO: <BsGear />,
    gearFi: <BsGearFill />,
    moonFi: <BsMoonStarsFill />,
    sun: <IoSunny />,
    desktopO: <HiOutlineComputerDesktop />,
    calender: <BiCalendarAlt />,
    default: <BsHandThumbsUp />,
  };
}

export default useIcons;
