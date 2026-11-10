import type { ComponentProps, FC } from "react";
import { cn } from "~/global/utils/cn";

export const TableSectionActions: FC<ComponentProps<"div">> = ({
    className,
    ...otherProps
}) => {
    return (
        <div
            {...otherProps}
            className={cn("items-between flex gap-3", className)}
        />
    );
};
