import { Progress } from "radix-ui";
import { type FC } from "react";
import { cn } from "~/global/utils/cn";

interface ProgressBarProps {
    className?: string;
    indicatorClassName?: string;
    label?: string;
    progress: number;
}

export const ProgressBar: FC<ProgressBarProps> = ({
    className,
    indicatorClassName,
    label,
    progress,
}) => {
    const value = Math.min(
        100,
        Math.max(0, Number.isFinite(progress) ? progress : 0)
    );

    return (
        <Progress.Root
            aria-label={label}
            className={cn(
                "bg-primary-shades-200 relative h-3 w-full transform-[translateZ(0)] overflow-hidden rounded-full",
                className
            )}
            value={value}
        >
            <Progress.Indicator
                className={cn(
                    "ease-[cubic-bezier(0.65, 0, 0.35, 1)] bg-primary size-full transition-transform duration-[660ms]",
                    indicatorClassName
                )}
                style={{ transform: `translateX(-${100 - value}%)` }}
            />
        </Progress.Root>
    );
};
