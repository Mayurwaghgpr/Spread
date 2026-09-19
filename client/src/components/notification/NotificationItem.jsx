import FormatedTime from "../utilityComp/FormatedTime";
import useIcons from "../../hooks/useIcons";
import ProfileImage from "../ProfileImage";
import { useNavigate } from "react-router-dom";
import notificationApi from "../../services/notificationApi";
import { useQueryClient } from "@tanstack/react-query";

function NotificationItem({ className = "", data, onClickItem }) {
  const icons = useIcons();
  const navigate = useNavigate();
  const { markRead } = notificationApi();
  const queryClient = useQueryClient();

  const actorName = data?.actor?.displayName || data?.actor?.username || "Someone";
  let messageText = data?.message || "";
  if (!messageText || messageText.includes("undefined")) {
    if (data?.type === "like") messageText = `${actorName} liked your post.`;
    else if (data?.type === "comment") messageText = `${actorName} commented on your post.`;
    else if (data?.type === "follow") messageText = `${actorName} started following you.`;
    else messageText = `${actorName} interacted with you.`;
  }

  const handleClick = async () => {
    if (!data?.read) {
      try {
        await markRead(data.id);
        queryClient.invalidateQueries(["notifications"]);
        queryClient.invalidateQueries(["unreadNotificationsCount"]);
      } catch (err) {
        console.error(err);
      }
    }

    if (onClickItem) onClickItem();

    const username = data?.actor?.username || data?.actor?.displayName || "user";
    if (data?.entityType === "post" && data?.entityId) {
      navigate(`/post/${data.entityId}`);
    } else if (data?.entityType === "user" || data?.type === "follow") {
      const targetId = data?.entityId || data?.actorId || data?.actor?.id;
      navigate(`/profile/${username}/${targetId}`);
    } else if (data?.entityId) {
      navigate(`/post/${data.entityId}`);
    }
  };

  const getBadgeMeta = (type) => {
    switch (type) {
      case "like":
        return {
          icon: icons["redHeartFi"] || icons["heartFi"],
          badgeBg: "bg-rose-50 dark:bg-rose-950/90 text-rose-500 border-rose-200 dark:border-rose-800",
        };
      case "comment":
        return {
          icon: icons["comment"] || icons["messageDoted"],
          badgeBg: "bg-blue-50 dark:bg-blue-950/90 text-blue-500 border-blue-200 dark:border-blue-800",
        };
      case "follow":
        return {
          icon: icons["follow"] || icons["userCheck"],
          badgeBg: "bg-violet-50 dark:bg-violet-950/90 text-violet-500 border-violet-200 dark:border-violet-800",
        };
      default:
        return {
          icon: icons["bellFi"] || icons["bellO"],
          badgeBg: "bg-amber-50 dark:bg-amber-950/90 text-amber-500 border-amber-200 dark:border-amber-800",
        };
    }
  };

  const badge = getBadgeMeta(data?.type);

  return (
    <div
      onClick={handleClick}
      className={`group flex items-start justify-between gap-3 w-full p-3 rounded-xl border transition-all duration-150 cursor-pointer ${
        !data?.read
          ? "bg-stone-100 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700/60 shadow-xs"
          : "bg-transparent hover:bg-stone-100/70 dark:hover:bg-stone-800/40 border-transparent hover:border-stone-200/60 dark:hover:border-stone-800/60"
      } ${className}`}
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="relative shrink-0 mt-0.5">
          {data?.actor?.userImage ? (
            <ProfileImage
              className="w-9 h-9 rounded-full overflow-hidden ring-1 ring-stone-200 dark:ring-stone-700 object-cover"
              image={data?.actor?.userImage}
              alt={actorName}
            />
          ) : (
            <div className="flex justify-center items-center w-9 h-9 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold ring-1 ring-stone-300 dark:ring-stone-700">
              {actorName.charAt(0).toUpperCase()}
            </div>
          )}
          <span
            className={`absolute -bottom-1 -right-1 flex justify-center items-center w-4 h-4 rounded-full border text-[9px] shadow-xs ${badge.badgeBg}`}
          >
            {badge.icon}
          </span>
        </div>
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <p className="text-xs text-stone-800 dark:text-stone-200 leading-snug break-words">
            <span className="font-bold text-stone-900 dark:text-stone-100 mr-1">
              {actorName}
            </span>
            {messageText.startsWith(actorName)
              ? messageText.slice(actorName.length)
              : messageText}
          </p>
          <FormatedTime
            className="text-[10px] text-stone-400 dark:text-stone-500 font-medium"
            date={data?.createdAt || data?.timestamp}
          />
        </div>
      </div>
      {!data?.read && (
        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-2 shadow-xs" />
      )}
    </div>
  );
}

export default NotificationItem;
