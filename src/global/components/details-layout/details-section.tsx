import React from "react";
import { useAppContext } from "~/global/providers/app-provider";
import { cn } from "~/global/utils/cn";

type DetailsSectionProps = {
    children: React.ReactNode;
    className?: string;
};

export const DetailsSection = ({
    className,
    children,
}: DetailsSectionProps) => {
    const { isSidebarOpen } = useAppContext();

    return (
        <aside
            className={cn(
                "border-primary-shades-100 flex w-80 flex-col border-r",
                "h-full duration-200",
                {
                    "w-96": !isSidebarOpen,
                },
                className
            )}
        >
            {children}
        </aside>
    );
};
