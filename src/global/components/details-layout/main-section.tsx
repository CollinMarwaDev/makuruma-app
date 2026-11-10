import type { ReactNode } from "react";
import { cn } from "~/global/utils/cn";

type MainSectionProps = {
    children: ReactNode;
    className?: string;
};

export const MainSection = ({ children, className }: MainSectionProps) => {
    return (
        <div
            className={cn(
                "h-full flex-1 flex-col overflow-y-auto py-4",
                className
            )}
        >
            {children}
        </div>
    );
};
