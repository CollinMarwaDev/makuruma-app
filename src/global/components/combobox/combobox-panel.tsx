import { Command } from "cmdk";
import type { FC, ReactNode } from "react";
import Popover from "~/global/components/popover";
import { cn } from "~/global/utils/cn";

interface ComboboxPanelProps {
    children: ReactNode;
    className?: string;
    responsive?: boolean;
    shouldFilter?: boolean;
}

export const ComboboxPanel: FC<ComboboxPanelProps> = ({
    children,
    className,
    responsive,
    shouldFilter,
}) => {
    return (
        <Popover.Content
            responsive={responsive}
            className={cn("overflow-hidden p-0", className)}
        >
            <Command loop shouldFilter={shouldFilter}>
                {children}
            </Command>
        </Popover.Content>
    );
};
