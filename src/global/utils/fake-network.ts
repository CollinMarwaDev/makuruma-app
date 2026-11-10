import { checkIsDevMode } from "~/global/utils/check-dev";

/**
 * Simulates a network delay by introducing an asynchronous delay when in development mode.
 *
 * This function is designed to mimic a network request by introducing a specified or random delay
 * when the application is in development mode. If the optional `time` parameter is provided, the
 * delay will match the given time in milliseconds. If no time is provided, a random delay up to
 * 900 milliseconds will be applied.
 *
 * The function performs no operation or delay when not in development mode.
 *
 * @param {number} [time] - Optional time in milliseconds to specify the delay duration.
 *                          Defaults to a random time if omitted.
 * @returns  A Promise that resolves after the specified or random delay time.
 */
export const fakeNetwork = async (time?: number) => {
    if (checkIsDevMode()) {
        const delayTime = time ?? Math.random() * 900;
        return new Promise((res) => setTimeout(res, delayTime));
    }
};
