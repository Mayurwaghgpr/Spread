import React from "react";
import {
  BsAlphabetUppercase,
  BsArrowLeft,
  BsBellFill,
  BsCamera,
  BsCameraVideo,
  BsClock,
  BsClockHistory,
  BsGear,
  BsGearFill,
  BsHandThumbsUp,
  BsHandThumbsUpFill,
  BsHeart,
  BsHeartFill,
  BsInfoCircle,
  BsLink,
  BsMoonStarsFill,
  BsPeople,
  BsThreeDotsVertical,
} from "react-icons/bs";
import { MdCelebration, MdDone, MdErrorOutline } from "react-icons/md";
import {
  IoArrowDown,
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
import { PiHandsClappingFill, PiImageThin } from "react-icons/pi";
import { MdAutoAwesome } from "react-icons/md";

import {
  FaCode,
  FaComment,
  FaHandHoldingHeart,
  FaThumbsUp,
} from "react-icons/fa6";
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
import { CiWarning } from "react-icons/ci";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { TiPin } from "react-icons/ti";

function useIcons() {
  return {
    // A
    addPersonO: <IoPersonAddOutline />,
    alphabetUp: <BsAlphabetUppercase />,
    appreciate: <MdAutoAwesome />,
    arrowL: <BsArrowLeft />,
    arrowUp: <IoIosArrowUp />,
    arrowDown: <IoIosArrowDown />,

    // B
    bell: <BsBellFill />,

    // C
    calender: <BiCalendarAlt />,
    callO: <IoCallOutline />,
    celebration: <MdCelebration />,
    cheer: <PiHandsClappingFill />,
    close: <IoCloseOutline />,
    code1: <FaCode />,
    comment: <FaComment />,

    // D
    desktopO: <HiOutlineComputerDesktop />,
    done: <MdDone color="green" />,
    duration: <BsClockHistory />,

    // E
    error: <MdErrorOutline color="red" />,

    // F
    follow: <RiUserFollowLine />,

    // G
    gearFi: <BsGearFill />,
    gearO: <BsGear />,

    // H
    helpfull: <FaHandHoldingHeart />,
    homeFi: <IoHomeSharp />,
    homeO: <IoHomeOutline />,
    redHeartFi: <BsHeartFill color="red" />,
    heartFi: <BsHeartFill className="text-gray-600" />,
    heartO: <BsHeart />,

    // I
    image1: <PiImageThin />,
    info: <BsInfoCircle />,

    // J
    // Placeholder for future grouping

    // K
    // Placeholder for future grouping

    // L
    libraryFi: <IoLibrarySharp />,
    libraryO: <IoLibraryOutline />,
    link: <BsLink />,
    logout: <LuLogOut />,
    like: <BsHandThumbsUpFill />,
    likeO: <BsHandThumbsUp />,

    // M
    mention: <VscMention />,
    message: <TbMessageCircle />,
    messageFi: <TbMessageCircleFilled />,
    moonFi: <BsMoonStarsFill />,

    // N
    // Placeholder for future grouping

    // O
    // Placeholder for future grouping

    // P
    pCamera: <BsCamera />,
    penFi: <RiQuillPenFill />,
    penO: <RiQuillPenLine />,
    reminder: <PiAlarm />,
    repost: <BiRepost />,
    people: <BsPeople />,
    pin: <TiPin />,

    // Q
    // Placeholder for future grouping

    // R
    // Placeholder for future grouping

    // S
    search: <IoSearch />,
    searchO: <IoSearchOutline />,
    sendO: <AiOutlineSend />,
    smile: <IoHappyOutline />,
    success: <MdDone color="green" />,
    sun: <IoSunny />,
    system: <GrSystem />,

    // T
    tag: <FaUserTag />,
    ThreeDot: <BsThreeDotsVertical />,

    // U
    // Placeholder for future grouping

    // V
    vCamera: <BsCameraVideo />,

    // W
    warning: <CiWarning color="yellow" />,

    // X
    // Placeholder for future grouping

    // Y
    // Placeholder for future grouping

    // Z
    // Placeholder for future grouping
  };
}

export default useIcons;
