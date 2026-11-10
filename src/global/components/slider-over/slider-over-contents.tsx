import type { FC, ReactNode } from "react";
import { cn } from "~/global/utils/cn";

export const SliderOverContent: FC<{
    children: ReactNode;
    className?: string;
}> = ({ children, className }) => {
    return (
        <div
            className={cn(
                "h-full flex-1 overflow-y-auto rounded-b-lg bg-surface px-6 pt-0 pb-6",
                className
            )}
        >
            {children}
        </div>
    );
};
