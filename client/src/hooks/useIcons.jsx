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
  BsYoutube,
  BsDiscord,
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
  LuCheckCheck,
  LuSparkles,
  LuLink,
  LuCopy,
  LuArrowUpRight,
  LuGitBranch,
  LuLock,
  LuLockKeyhole,
  LuCircleAlert,
  LuInfo,
  LuPaperclip,
  LuBan,
  LuTrash2,
  LuImage,
  LuMessageSquarePlus,
  LuCompass,
  LuGlobe,
  LuTrophy,
  LuAward,
  LuHash,
  LuZap,
  LuFlame,
  LuFileText,
  LuTarget,
  LuBold,
  LuItalic,
  LuUnderline,
  LuCode,
  LuType,
  LuChevronLeft,
  LuChevronRight,
  LuUpload,
  LuTriangleAlert,
  LuUserPlus,
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
    alertTriangle: <LuTriangleAlert />,
    alphabetUp: <BsAlphabetUppercase />,
    appreciate: <LuSparkles className="text-amber-500" />,
    arrowL: <LuArrowLeft />,
    arrowUp: <LuChevronUp />,
    arrowDown: <LuChevronDown />,
    arrowUpRight: <LuArrowUpRight />,
    attachPin: <IoAttach />,
    award: <LuAward />,

    // B
    ban: <LuBan />,
    bellFi: <LuBell className="fill-current" />,
    bellO: <LuBell />,
    bold: <LuBold />,
    bookmarkFi: <LuBookmarkCheck className="fill-current text-stone-900 dark:text-stone-100" />,
    bookmarkO: <LuBookmark />,
    book: <FaBookOpen />,
    bolt: <HiOutlineBolt />,

    // C
    calender: <LuCalendarDays />,
    callO: <IoCallOutline />,
    camera: <BsCamera />,
    celebration: <MdCelebration />,
    cheer: <PiHandsClappingFill />,
    chevronLeft: <LuChevronLeft />,
    chevronRight: <LuChevronRight />,
    close: <LuX />,
    code: <LuCode />,
    code1: <FaCode />,
    comment: <LuMessageSquare />,
    compass: <LuCompass />,
    creative: <MdOutlineDeveloperMode />,
    check: <LuCheck />,
    checkCheck: <LuCheckCheck />,
    circleCheck: <BsCheck2Circle />,
    copy: <LuCopy />,
    chatTab: <HiOutlineChatBubbleLeftRight />,

    // D
    desktopO: <LuMonitorSmartphone />,
    done: <MdDone color="green" />,
    duration: <BsClockHistory />,
    delete: <BiTrash />,
    delete1: <PiTrashSimpleLight />,
    discord: <BsDiscord />,
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
    flame: <LuFlame className="text-amber-500" />,
    fileText: <LuFileText />,

    // G
    gearFi: <LuSlidersHorizontal />,
    gearO: <LuSlidersHorizontal />,
    glitter: <WiStars className="" />,
    github: <LuGithub />,
    gitBranch: <LuGitBranch />,
    globe: <LuGlobe />,
    google: <GrGoogle />,
    grow: <TbTrendingUp />,

    // H
    hash: <LuHash />,
    helpful: <FaHandHoldingHeart />,
    homeFi: <IoHomeSharp />,
    homeO: <IoHomeOutline />,
    redHeartFi: <HiHeart className="text-red-500 fill-red-500" />,
    heartFi: <LuHeart className="fill-stone-600" />,
    heartO: <LuHeart />,
    handshack: <LuHandshake />,

    // I
    image: <LuImage />,
    image1: <PiImageThin />,
    info: <BsInfoCircle />,
    italic: <LuItalic />,

    // L
    libraryFi: <IoLibrarySharp />,
    libraryO: <IoLibraryOutline />,
    link: <LuLink />,
    lock: <LuLock />,
    lockKeyhole: <LuLockKeyhole />,
    logout: <LuLogOut />,
    like: <BsHandThumbsUpFill />,
    likeO: <BsHandThumbsUp />,
    linkedin: <BsLinkedin />,

    // M
    mention: <VscMention />,
    message: <TbMessageCircle />,
    messageFi: <TbMessageCircleFilled />,
    messageDoted: <LuMessageSquare />,
    messageSquare: <LuMessageSquare />,
    messagePlus: <LuMessageSquarePlus />,
    circleAlert: <LuCircleAlert />,
    infoCircle: <LuInfo />,
    moonFi: <LuMoon />,
    menu: <CiMenuBurger />,

    // P
    paperclip: <LuPaperclip />,
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
    sparkles: <LuSparkles />,
    success: <MdDone color="green" />,
    sun: <LuSun />,
    system: <GrSystem />,
    share: <BiShare />,
    sendFi: <LuSend />,

    // T
    type: <LuType />,
    toastSuccess: <LuCheck className="stroke-[2.5]" />,
    toastError: <LuCircleAlert className="stroke-[2.2]" />,
    toastWarning: <LuCircleAlert className="stroke-[2.2]" />,
    toastInfo: <LuInfo className="stroke-[2.2]" />,
    toastLoading: <LuRefreshCw className="animate-spin stroke-[2.2]" />,
    toastClose: <LuX className="stroke-[2]" />,
    toastCopy: <LuCopy className="stroke-[2]" />,
    toastUndo: <LuCornerUpLeft className="stroke-[2]" />,
    toastChevronDown: <LuChevronDown className="stroke-[2]" />,
    toastChevronUp: <LuChevronUp className="stroke-[2]" />,
    toastCheck: <LuCheck className="stroke-[2.5]" />,
    trash: <LuTrash2 />,
    tag: <FaUserTag />,
    target: <LuTarget />,
    trophy: <LuTrophy className="text-amber-500" />,
    ThreeDot: <BsThreeDotsVertical />,

    // U
    underline: <LuUnderline />,
    upload: <LuUpload />,
    userCheck: <LuUserCheck />,
    userPlus: <LuUserPlus />,
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

    // Y
    youtube: <BsYoutube className="text-red-500" />,

    // Z
    zap: <LuZap className="text-amber-500" />,

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
