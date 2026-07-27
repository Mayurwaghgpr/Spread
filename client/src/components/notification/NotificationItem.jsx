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

  return (
    <div
      onClick={handleClick}
      className={`flex items-start justify-between gap-3 w-full p-3.5 rounded-xl border border-[#e7dfd8] dark:border-[#262626] cursor-pointer transition-all duration-200 hover:bg-laccent dark:hover:bg-dark/90 hover:shadow-sm ${
        !data?.read
          ? "bg-laccent dark:bg-daccent border-l-4 border-l-oplight"
          : "bg-light/80 dark:bg-daccent/50"
      } ${className}`}
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="relative shrink-0 mt-0.5">
          {data?.actor?.userImage ? (
            <ProfileImage
              className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 object-cover"
              image={data?.actor?.userImage}
              alt={actorName}
            />
          ) : (
            <div className="flex justify-center items-center w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 text-base">
              {icons[data?.type] || icons["bellFi"]}
            </div>
          )}
          <span className="absolute -bottom-1 -right-1 flex justify-center items-center w-4 h-4 rounded-full bg-white dark:bg-gray-900 shadow text-[10px]">
            {icons[data?.type] || "🔔"}
          </span>
        </div>
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <p className="text-xs text-gray-800 dark:text-gray-200 leading-snug break-words">
            <span className="font-semibold text-gray-900 dark:text-white mr-1">
              {actorName}
            </span>
            {messageText.startsWith(actorName)
              ? messageText.slice(actorName.length)
              : messageText}
          </p>
          <FormatedTime
            className="text-[10px] text-gray-400 dark:text-gray-500 font-medium"
            date={data?.createdAt || data?.timestamp}
          />
        </div>
      </div>
      {!data?.read && (
        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-2" />
      )}
    </div>
  );
}

export default NotificationItem;
