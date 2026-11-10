import { useEffect, useState, useCallback } from "react";

interface UseCountdownOptions {
    onComplete?: () => void;
}

/**
 * A hook that manages a countdown timer based on a start timestamp and a duration.
 *
 * @param startTimestamp - The timestamp (ms) when the countdown should be considered started.
 * @param durationSeconds - The total duration of the countdown in seconds.
 * @param options - Optional callbacks.
 * @returns An object containing the remaining time in seconds and a boolean indicating if it's active.
 */
export const useCountdown = (
    startTimestamp: number | undefined,
    durationSeconds: number,
    options?: UseCountdownOptions
) => {
    const [timeLeft, setTimeLeft] = useState(0);

    const calculateTimeLeft = useCallback(() => {
        if (!startTimestamp) return 0;
        const elapsedSeconds = Math.floor((Date.now() - startTimestamp) / 1000);
        return Math.max(0, durationSeconds - elapsedSeconds);
    }, [startTimestamp, durationSeconds]);

    useEffect(() => {
        if (!startTimestamp || durationSeconds <= 0) {
            setTimeLeft(0);
            return;
        }

        const initialTime = calculateTimeLeft();
        setTimeLeft(initialTime);

        if (initialTime > 0) {
            const timer = setInterval(() => {
                const newTime = calculateTimeLeft();
                setTimeLeft(newTime);
                if (newTime <= 0) {
                    clearInterval(timer);
                    options?.onComplete?.();
                }
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [startTimestamp, durationSeconds, calculateTimeLeft, options]);

    return {
        isActive: timeLeft > 0,
        timeLeft,
    };
};
