/** Formats a Voice minute balance with one decimal, e.g. `14.8`. */
export const formatMinutes = (minutes: number) =>
    minutes.toLocaleString("en-US", {
        maximumFractionDigits: 1,
        minimumFractionDigits: 1,
    });
