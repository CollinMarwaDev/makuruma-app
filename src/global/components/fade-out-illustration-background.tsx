import type { ComponentPropsWithoutRef, FC } from "react";
import { cn } from "~/global/utils/cn";

/** A component to center contents within fade out background with pattern image */
export const FadeOutIllustrationBackground: FC<
    ComponentPropsWithoutRef<"div">
> = ({ className, children, ...otherProps }) => {
    return (
        <div {...otherProps} className={cn("center relative z-10", className)}>
            {children}
        </div>
    );
};
