import type { FC, HTMLAttributes } from "react";
import { cn } from "~/global/utils/cn";

interface ComponentCardProps extends HTMLAttributes<HTMLDivElement> {
    innerWrapperClassName?: string;
    title: string;
}

export const ComponentCard: FC<ComponentCardProps> = ({
    className,
    children,
    innerWrapperClassName,
    title,
    ...otherProps
}) => {
    return (
        <div
            className={cn("border-outline rounded-xl border p-3", className)}
            {...otherProps}
        >
            <small className="font-jetbrains-mono text-primary-950 font-medium italic">
                {title}
            </small>

            <div className={cn("mt-2", innerWrapperClassName)}>{children}</div>
        </div>
    );
};
