import dayjs from "dayjs";

/**
 * Compares a provided date with today's date and returns human-readable difference
 * The provided date must be today or in the past (cannot be future dates)
 * @param {string} dateString - Date string like "29 May 2025", "2025-05-29", etc.
 * @param {boolean} hasTime - A boolean value that enables the display of date time
 * @returns {string} Human readable date difference like "today", "1 day ago", "2 days ago", etc.
 */
export const getHumanReadableDateDifference = (
    dateString: string,
    hasTime = false
): string => {
    const providedDate = dayjs(dateString);

    const today = dayjs();

    if (!providedDate.isValid()) {
        return "Invalid date";
    }

    const diffInDays = today

        .startOf("day")

        .diff(providedDate.startOf("day"), "day");

    if (diffInDays === 0) {
        return providedDate.format("HH:mm");
    }

    if (diffInDays === 1) {
        return hasTime
            ? `Yesterday ${providedDate.format("HH:mm")}`
            : "Yesterday";
    }

    return hasTime
        ? providedDate.format("DD/MM/YY HH:mm")
        : providedDate.format("DD/MM/YY");
};

/**
 * Formats a date string into a human-readable format.
 *
 * This function takes an input date string and converts it
 * into the format "DD MMMM YYYY" using the Day.js library.
 *
 * @param {string} dateString - The input date string to be formatted.
 * @returns {string} The formatted date string in the "DD MMMM YYYY" format.
 */
export const formatDate = (
    dateString: string | null | undefined
): string | undefined => {
    if (!dateString) return undefined;
    return dayjs(dateString).format("DD MMMM YYYY");
};

/**
 * Formats a datetime string into a human-readable format.
 *
 * This function takes an input datetime string and converts it
 * into the format "DD MMMM YYYY, HH:mm" using the Day.js library.
 *
 * @param {string} datetimeString - The input datetime string to be formatted.
 * @returns {string} The formatted datetime string in the "DD MMMM YYYY, HH:mm" format.
 */
export const formatDateTime = (
    datetimeString?: string | null
): string | undefined => {
    if (!datetimeString) return undefined;
    return dayjs(datetimeString).format("DD MMMM YYYY - hh:mm A");
};
