import type { ComponentProps, FC } from "react";
import { cn } from "~/global/utils/cn";

// ℹ️Todo This is an incomplete container component <Exporting how to use container query feature >
export const Container: FC<ComponentProps<"section">> = ({
    className,
    ...otherProps
}) => {
    return <section {...otherProps} className={cn("max-w-4xl", className)} />;
};
