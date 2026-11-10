import type { ComponentPropsWithoutRef, FC } from "react";
import { cn } from "~/global/utils/cn";

export const PageContainer: FC<ComponentPropsWithoutRef<"section">> = ({
    className,
    ...otherProps
}) => {
    return (
        <section
            {...otherProps}
            className={cn("h-full overflow-y-auto px-5 pt-5 pb-2.5", className)}
        />
    );
};
