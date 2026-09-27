import { format, isToday, isYesterday } from "date-fns";

// Formatter for grouped dates (WhatsApp / Instagram style)
export const formatDateLabel = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";

  const now = new Date();
  if (date.getFullYear() === now.getFullYear()) {
    return format(date, "EEEE, MMMM d"); // e.g. Monday, September 22
  }
  return format(date, "MMMM d, yyyy"); // e.g. September 22, 2024
};

// Formatter for message timestamp inside bubbles (e.g. 10:45 AM)
export const formatMessageTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return format(date, "p"); // e.g. 7:00 PM
};

const TimeAgo = ({ date, className = "", grouped = false, timeOnly = false }) => {
  if (!date) return null;

  // Formatter for individual relative dates ("2 hours ago")
  const getTimeAgo = (dateInput) => {
    const now = new Date();
    const past = new Date(dateInput);
    const diff = now - past;

    const second = 1000;
    const minute = 60 * second;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;
    const month = 30 * day;
    const year = 365 * day;
    const formatStr = (value, unit) =>
      `${value} ${unit}${value > 1 ? "s" : ""} ago`;
    if (diff < minute) return "Just now";
    if (diff < hour) return formatStr(Math.floor(diff / minute), "minute");
    if (diff < day) return formatStr(Math.floor(diff / hour), "hour");
    if (diff < week) return formatStr(Math.floor(diff / day), "day");
    if (diff < month) return formatStr(Math.floor(diff / week), "week");
    if (diff < year) return formatStr(Math.floor(diff / month), "month");
    return formatStr(Math.floor(diff / year), "year");
  };

  const content = timeOnly
    ? formatMessageTime(date)
    : grouped
    ? formatDateLabel(date)
    : getTimeAgo(date);

  return (
    <span className={className}>
      {content}
    </span>
  );
};

export default TimeAgo;
