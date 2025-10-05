import {
  BsAlphabetUppercase,
  BsArrowLeft,
  BsBell,
  BsBellFill,
  BsBookmark,
  BsCamera,
  BsCameraVideo,
  BsCheck2Circle,
  BsClockHistory,
  BsEye,
  BsEyeSlash,
  BsFillBookmarkFill,
  BsFillMoonStarsFill,
  BsGear,
  BsGearFill,
  BsHandThumbsUp,
  BsHandThumbsUpFill,
  BsHeart,
  BsHeartFill,
  BsInfoCircle,
  BsLink,
  BsLinkedin,
  BsPen,
  BsPenFill,
  BsPeople,
  BsPerson,
  BsSendFill,
  BsThreeDotsVertical,
  BsTwitterX,
} from "react-icons/bs";
import {
  MdCelebration,
  MdDone,
  MdErrorOutline,
  MdHandshake,
  MdOutlineDeveloperMode,
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";
import {
  IoAttach,
  IoCallOutline,
  IoEarth,
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
import {
  PiHandsClappingFill,
  PiImageThin,
  PiPlus,
  PiTrashSimpleLight,
} from "react-icons/pi";
import { MdAutoAwesome } from "react-icons/md";

import {
  FaBookOpen,
  FaCode,
  FaCreativeCommons,
  FaHandHoldingHeart,
  FaHandshake,
  FaRegComment,
} from "react-icons/fa6";
import {
  RiQuillPenFill,
  RiQuillPenLine,
  RiUserFollowLine,
} from "react-icons/ri";
import { VscMention } from "react-icons/vsc";
import { FaUserTag } from "react-icons/fa6";
import { PiAlarm } from "react-icons/pi";
import { BiCalendarAlt, BiRepost, BiShare, BiTrash } from "react-icons/bi";
import { GrGoogle, GrSystem } from "react-icons/gr";
import { IoCloseOutline } from "react-icons/io5";
import { AiOutlineMessage, AiOutlineSend } from "react-icons/ai";
import {
  LuGithub,
  LuHandshake,
  LuLogOut,
  LuMonitorSmartphone,
} from "react-icons/lu";
import {
  TbMessageCircle,
  TbMessageCircleFilled,
  TbTrendingUp,
} from "react-icons/tb";
import { CiWarning } from "react-icons/ci";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { TiPin } from "react-icons/ti";
import { WiStars } from "react-icons/wi";
import { FiEdit3 } from "react-icons/fi";
function useIcons() {
  return {
    // A
    addPersonO: <IoPersonAddOutline />,
    alphabetUp: <BsAlphabetUppercase />,
    appreciate: <MdAutoAwesome />,
    arrowL: <BsArrowLeft />,
    arrowUp: <IoIosArrowUp />,
    arrowDown: <IoIosArrowDown />,
    attachPin: <IoAttach />,

    // B
    bellFi: <BsBellFill />,
    bellO: <BsBell />,
    bookmarkFi: <BsFillBookmarkFill />,
    bookmarkO: <BsBookmark />,
    book: <FaBookOpen />,

    // C
    calender: <BiCalendarAlt />,
    callO: <IoCallOutline />,
    celebration: <MdCelebration />,
    cheer: <PiHandsClappingFill />,
    close: <IoCloseOutline />,
    code1: <FaCode />,
    comment: <FaRegComment />,
    creative: <MdOutlineDeveloperMode />,
    check: <BsCheck2Circle />,
    // D
    desktopO: <LuMonitorSmartphone />,
    done: <MdDone color="green" />,
    duration: <BsClockHistory />,
    delete: <BiTrash />,
    delete1: <PiTrashSimpleLight />,
    doubleArrowR: <MdOutlineKeyboardDoubleArrowRight />,
    doubleArrowL: <MdOutlineKeyboardDoubleArrowLeft />,
    // E
    error: <MdErrorOutline color="red" />,
    earth: <IoEarth />,
    edit: <FiEdit3 />,
    eye: <BsEye />,
    eyeSlash: <BsEyeSlash />,
    // F
    follow: <RiUserFollowLine />,
    fetherFi: <RiQuillPenFill />,
    fetherO: <RiQuillPenLine />,
    // G
    gearFi: <BsGearFill />,
    gearO: <BsGear />,
    glitter: <WiStars className="" />,
    github: <LuGithub />,
    google: <GrGoogle />,
    grow: <TbTrendingUp />,

    // H
    helpfull: <FaHandHoldingHeart />,
    homeFi: <IoHomeSharp />,
    homeO: <IoHomeOutline />,
    redHeartFi: <BsHeartFill color="red" />,
    heartFi: <BsHeartFill className="text-gray-600" />,
    heartO: <BsHeart />,
    handshack: <LuHandshake />,

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
    linkedLine: <BsLinkedin />,

    // M
    mention: <VscMention />,
    message: <TbMessageCircle />,
    messageFi: <TbMessageCircleFilled />,
    messageDoted: <AiOutlineMessage />,
    moonFi: <BsFillMoonStarsFill />,

    // N
    // Placeholder for future grouping

    // O
    // Placeholder for future grouping

    // P
    pCamera: <BsCamera />,
    penFi: <BsPenFill />,
    penO: <BsPen />,
    people: <BsPeople />,
    pin: <TiPin />,
    plus: <PiPlus />,
    person: <BsPerson />,

    // Q
    // Placeholder for future grouping

    // R
    reminder: <PiAlarm />,
    repost: <BiRepost />,

    // S
    search: <IoSearch />,
    searchO: <IoSearchOutline />,
    sendO: <AiOutlineSend />,
    smile: <IoHappyOutline />,
    success: <MdDone color="green" />,
    sun: <IoSunny />,
    system: <GrSystem />,
    share: <BiShare />,
    sendFi: <BsSendFill />,
    // T
    tag: <FaUserTag />,
    ThreeDot: <BsThreeDotsVertical />,

    // U
    // Placeholder for future grouping

    // V
    vCamera: <BsCameraVideo />,

    // W
    warning: <CiWarning />,

    // X
    XCom: <BsTwitterX />,

    // Y
    // Placeholder for future grouping

    // Z
    // Placeholder for future grouping
  };
}

export default useIcons;
