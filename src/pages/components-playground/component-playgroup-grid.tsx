import type { ComponentPropsWithoutRef, FC } from "react";
import { cn } from "~/global/utils/cn";

export const ComponentPlaygroupGrid: FC<
    ComponentPropsWithoutRef<"section">
> = ({ className, ...otherProps }) => {
    return (
        <section
            className={cn("grid grid-cols-2 gap-5", className)}
            {...otherProps}
        />
    );
};
