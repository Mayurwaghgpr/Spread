import { format, isToday, isYesterday } from "date-fns";

const TimeAgo = ({ date, className, grouped = false }) => {
  //Formatter forn individual dates
  const getTimeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diff = now - past;

    const second = 1000;
    const minute = 60 * second;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;
    const month = 30 * day;
    const year = 365 * day;
    const format = (value, unit) =>
      `${value} ${unit}${value > 1 ? "s" : ""} ago`;
    if (diff < minute) return format(Math.floor(diff / second), "second");
    if (diff < hour) return format(Math.floor(diff / minute), "minute");
    if (diff < day) return format(Math.floor(diff / hour), "hour");
    if (diff < week) return format(Math.floor(diff / day), "day");
    if (diff < month) return format(Math.floor(diff / week), "week");
    if (diff < year) return format(Math.floor(diff / month), "month");
    return format(Math.floor(diff / year), "year");
  };
  //Formatter for grouped dates
  const formatDateLabel = (dateString) => {
    const date = new Date(dateString);

    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";

    return format(date, "dd MMM yyyy"); // Example: 02 Oct 2025
  };

  return (
    <span className={`${className} opacity-20`}>
      {grouped ? formatDateLabel(date) : getTimeAgo(date)}
    </span>
  );
};

export default TimeAgo;
