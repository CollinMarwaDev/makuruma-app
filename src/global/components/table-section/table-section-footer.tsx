import type { ComponentProps, FC } from "react";
import { cn } from "~/global/utils/cn";

export const TableSectionFooter: FC<ComponentProps<"footer">> = ({
    className,
    ...otherProps
}) => {
    return (
        <footer
            {...otherProps}
            className={cn(
                "center border-outline border-t py-5",
                className
            )}
        />
    );
};
