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
      className={`flex items-start justify-between gap-3 w-full p-3.5 rounded-xl border border-inherit cursor-pointer transition-all duration-200 hover:bg-[#f5f1ec] dark:hover:bg-[#121212] ${
        !data?.read
          ? "bg-[#f5f1ec] dark:bg-[#121212]"
          : "bg-light dark:bg-dark"
      } ${className}`}
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="relative shrink-0 mt-0.5">
          {data?.actor?.userImage ? (
            <ProfileImage
              className="w-9 h-9 rounded-full overflow-hidden border border-inherit object-cover"
              image={data?.actor?.userImage}
              alt={actorName}
            />
          ) : (
            <div className="flex justify-center items-center w-9 h-9 rounded-full bg-[#f5f1ec] dark:bg-[#121212] text-stone-800 dark:text-stone-200 text-base border border-inherit">
              {icons[data?.type] || icons["bellFi"]}
            </div>
          )}
          <span className="absolute -bottom-1 -right-1 flex justify-center items-center w-4 h-4 rounded-full bg-light dark:bg-dark border border-inherit text-[10px]">
            {icons[data?.type] || "🔔"}
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
            className="text-[10px] text-stone-500 dark:text-stone-400 font-medium"
            date={data?.createdAt || data?.timestamp}
          />
        </div>
      </div>
      {!data?.read && (
        <span className="w-2 h-2 rounded-full bg-stone-900 dark:bg-stone-100 shrink-0 mt-2" />
      )}
    </div>
  );
}

export default NotificationItem;
