import type { FC, HTMLAttributes } from "react";
import { cn } from "~/global/utils/cn";

export const SkeletonLoader: FC<HTMLAttributes<HTMLParagraphElement>> = ({
    className,
}) => {
    return (
        <div
            className={cn(
                "bg-primary-shades-100 relative w-full overflow-hidden rounded py-2",
                "after:absolute after:inset-0",
                "after:animate-shimmer",
                "after:bg-gradient-to-r after:from-transparent after:via-surface/50 after:to-transparent",
                className
            )}
        />
    );
};
