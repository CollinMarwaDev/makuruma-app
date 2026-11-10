import type { MillSeconds } from "~/global/types";

/**
 * Sleep - utility function to wait until specified time it passed
 * @param ms - number in milliseconds
 */
export const sleep = (ms?: MillSeconds) => {
    const delayTime = ms ?? Math.random() * 900;
    return new Promise((resolve) => setTimeout(resolve, delayTime));
};
