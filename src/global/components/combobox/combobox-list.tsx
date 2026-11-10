import { Command, useCommandState } from "cmdk";
import type { FC, ReactNode } from "react";
import { cn } from "~/global/utils/cn";

interface ComboboxListProps {
    children: ReactNode;
    className?: string;
}

const ComboboxList: FC<ComboboxListProps> = ({ children, className }) => {
    const hasOptions = useCommandState((state) => state.filtered.count > 0);

    return (
        <Command.List
            className={cn(
                "max-h-[300px] space-y-3 overflow-y-auto p-2 pr-4",
                { hidden: !hasOptions },
                className
            )}
            onWheel={(event) => event.stopPropagation()}
        >
            {children}
        </Command.List>
    );
};
export default ComboboxList;
