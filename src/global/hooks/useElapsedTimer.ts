import { useEffect, useState } from "react";

/**
 * Tracks elapsed whole seconds from a start timestamp while enabled.
 *
 * @param enabled - Whether the timer should continue updating.
 * @param startTimestamp - Timestamp in milliseconds when timing began.
 * @returns The elapsed duration in seconds.
 */
export const useElapsedTimer = (enabled: boolean, startTimestamp?: number) => {
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    useEffect(() => {
        if (!startTimestamp) {
            setElapsedSeconds(0);
            return;
        }

        if (!enabled) return;

        const updateElapsedSeconds = () => {
            setElapsedSeconds(
                Math.max(0, Math.floor((Date.now() - startTimestamp) / 1000))
            );
        };

        updateElapsedSeconds();
        const timer = window.setInterval(updateElapsedSeconds, 1000);

        return () => window.clearInterval(timer);
    }, [enabled, startTimestamp]);

    return elapsedSeconds;
};
