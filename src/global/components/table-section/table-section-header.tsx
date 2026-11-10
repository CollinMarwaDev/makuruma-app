import type { ComponentProps } from "react";
import { cn } from "~/global/utils/cn";

export const TableSectionHeader = ({
    className,
    ...otherProps
}: ComponentProps<"div">) => {
    return (
        <div
            {...otherProps}
            className={cn(
                "flex items-center justify-between p-4",
                className
            )}
        ></div>
    );
};
