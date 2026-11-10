import dayjs from "dayjs";
import { formatDateTime } from "~/global/utils/date-utils";

export const getRemainingTime = (eventDate: string) => {
    const now = dayjs();
    const date = dayjs(eventDate);

    const diffSeconds = now.diff(date, "second");
    const diffMinutes = now.diff(date, "minute");
    const diffHours = now.diff(date, "hour");
    const diffDays = now.diff(date, "day");

    if (diffSeconds < 60) {
        return diffSeconds <= 1 ? "Just now" : `${diffSeconds} seconds ago`;
    }

    if (diffMinutes < 60) {
        return diffMinutes === 1
            ? "1 minute ago"
            : `${diffMinutes} minutes ago`;
    }

    if (diffHours < 24) {
        return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
    }

    if (diffDays < 7) {
        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        return `${diffDays} days ago`;
    }

    // More than a week → show full date
    return formatDateTime(eventDate) ?? "";
};
