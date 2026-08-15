import {
  BsAlphabetUppercase,
  BsCamera,
  BsCameraVideo,
  BsCheck2Circle,
  BsClockHistory,
  BsEye,
  BsEyeSlash,
  BsFacebook,
  BsHandThumbsUp,
  BsHandThumbsUpFill,
  BsInfoCircle,
  BsLinkedin,
  BsPen,
  BsPenFill,
  BsReddit,
  BsThreeDotsVertical,
  BsTwitterX,
  BsWhatsapp,
} from "react-icons/bs";
import {
  MdCelebration,
  MdDone,
  MdEmail,
  MdErrorOutline,
  MdOutlineDeveloperMode,
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";
import {
  IoAttach,
  IoCallOutline,
  IoEarth,
  IoHomeOutline,
  IoHomeSharp,
  IoLibraryOutline,
  IoLibrarySharp,
  IoPersonAddOutline,
} from "react-icons/io5";
import {
  PiHandsClappingFill,
  PiImageThin,
  PiPlus,
  PiTrashSimpleLight,
  PiAlarm,
} from "react-icons/pi";
import {
  FaBookOpen,
  FaCode,
  FaHandHoldingHeart,
  FaUserTag,
} from "react-icons/fa6";
import {
  RiQuillPenFill,
  RiQuillPenLine,
} from "react-icons/ri";
import { VscMention } from "react-icons/vsc";
import { BiRepost, BiShare, BiTrash } from "react-icons/bi";
import { GrGoogle, GrSystem } from "react-icons/gr";
import {
  LuGithub,
  LuHandshake,
  LuLogOut,
  LuMonitorSmartphone,
  LuUserCheck,
  LuUsers,
  LuUser,
  LuSlidersHorizontal,
  LuShieldCheck,
  LuKeyRound,
  LuFolder,
  LuFolderPlus,
  LuBookmark,
  LuBookmarkCheck,
  LuCornerUpLeft,
  LuMessageSquare,
  LuNewspaper,
  LuCalendarDays,
  LuPencil,
  LuRefreshCw,
  LuX,
  LuSearch,
  LuSend,
  LuHeart,
  LuPin,
  LuChevronDown,
  LuChevronUp,
  LuArrowLeft,
  LuSmile,
  LuBell,
  LuVolume2,
  LuSun,
  LuMoon,
  LuCheck,
  LuSparkles,
  LuLink,
  LuCopy,
} from "react-icons/lu";
import {
  TbTrendingUp,
  TbMessageCircle,
  TbMessageCircleFilled,
} from "react-icons/tb";
import { CiMenuBurger, CiWarning } from "react-icons/ci";
import { WiStars } from "react-icons/wi";
import { FiExternalLink } from "react-icons/fi";
import {
  HiOutlineBolt,
  HiOutlineDocumentText,
  HiOutlineChatBubbleLeftRight,
  HiHeart,
} from "react-icons/hi2";

function useIcons() {
  return {
    // A
    addPersonO: <IoPersonAddOutline />,
    alphabetUp: <BsAlphabetUppercase />,
    appreciate: <LuSparkles className="text-amber-500" />,
    arrowL: <LuArrowLeft />,
    arrowUp: <LuChevronUp />,
    arrowDown: <LuChevronDown />,
    attachPin: <IoAttach />,

    // B
    bellFi: <LuBell className="fill-current" />,
    bellO: <LuBell />,
    bookmarkFi: <LuBookmarkCheck className="fill-current text-stone-900 dark:text-stone-100" />,
    bookmarkO: <LuBookmark />,
    book: <FaBookOpen />,
    bolt: <HiOutlineBolt />,

    // C
    calender: <LuCalendarDays />,
    callO: <IoCallOutline />,
    celebration: <MdCelebration />,
    cheer: <PiHandsClappingFill />,
    close: <LuX />,
    code1: <FaCode />,
    comment: <LuMessageSquare />,
    creative: <MdOutlineDeveloperMode />,
    check: <LuCheck />,
    circleCheck: <BsCheck2Circle />,
    copy: <LuCopy />,
    chatTab: <HiOutlineChatBubbleLeftRight />,

    // D
    desktopO: <LuMonitorSmartphone />,
    done: <MdDone color="green" />,
    duration: <BsClockHistory />,
    delete: <BiTrash />,
    delete1: <PiTrashSimpleLight />,
    doubleArrowR: <MdOutlineKeyboardDoubleArrowRight />,
    doubleArrowL: <MdOutlineKeyboardDoubleArrowLeft />,
    docTab: <HiOutlineDocumentText />,

    // E
    error: <MdErrorOutline color="red" />,
    earth: <IoEarth />,
    edit: <LuPencil />,
    eye: <BsEye />,
    eyeSlash: <BsEyeSlash />,
    exLink: <FiExternalLink />,
    email: <MdEmail />,

    // F
    follow: <LuUserCheck />,
    fetherFi: <RiQuillPenFill />,
    fetherO: <RiQuillPenLine />,
    facebook: <BsFacebook />,

    // G
    gearFi: <LuSlidersHorizontal />,
    gearO: <LuSlidersHorizontal />,
    glitter: <WiStars className="" />,
    github: <LuGithub />,
    google: <GrGoogle />,
    grow: <TbTrendingUp />,

    // H
    helpful: <FaHandHoldingHeart />,
    homeFi: <IoHomeSharp />,
    homeO: <IoHomeOutline />,
    redHeartFi: <HiHeart className="text-red-500 fill-red-500" />,
    heartFi: <LuHeart className="fill-stone-600" />,
    heartO: <LuHeart />,
    handshack: <LuHandshake />,

    // I
    image1: <PiImageThin />,
    info: <BsInfoCircle />,

    // L
    libraryFi: <IoLibrarySharp />,
    libraryO: <IoLibraryOutline />,
    link: <LuLink />,
    logout: <LuLogOut />,
    like: <BsHandThumbsUpFill />,
    likeO: <BsHandThumbsUp />,
    linkedin: <BsLinkedin />,

    // M
    mention: <VscMention />,
    message: <TbMessageCircle />,
    messageFi: <TbMessageCircleFilled />,
    messageDoted: <LuMessageSquare />,
    moonFi: <LuMoon />,
    menu: <CiMenuBurger />,

    // P
    pCamera: <BsCamera />,
    penFi: <BsPenFill />,
    penO: <BsPen />,
    people: <LuUsers />,
    pin: <LuPin />,
    plus: <PiPlus />,
    person: <LuUser />,
    post: <LuNewspaper />,

    // R
    reminder: <PiAlarm />,
    repost: <BiRepost />,
    reddit: <BsReddit />,
    refresh: <LuRefreshCw />,

    // S
    search: <LuSearch />,
    searchO: <LuSearch />,
    sendO: <LuSend />,
    smile: <LuSmile />,
    success: <MdDone color="green" />,
    sun: <LuSun />,
    system: <GrSystem />,
    share: <BiShare />,
    sendFi: <LuSend />,

    // T
    tag: <FaUserTag />,
    ThreeDot: <BsThreeDotsVertical />,

    // U
    userCheck: <LuUserCheck />,
    users: <LuUsers />,
    user: <LuUser />,

    // V
    vCamera: <BsCameraVideo />,
    volume: <LuVolume2 />,

    // W
    warning: <CiWarning />,
    whatsapp: <BsWhatsapp />,

    // X
    XCom: <BsTwitterX />,

    // S
    sliders: <LuSlidersHorizontal />,
    shieldCheck: <LuShieldCheck />,
    key: <LuKeyRound />,
    reply: <LuCornerUpLeft />,
    folder: <LuFolder />,
    folderPlus: <LuFolderPlus />,
  };
}

export default useIcons;
