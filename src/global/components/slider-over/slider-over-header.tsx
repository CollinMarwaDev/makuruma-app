import { DialogTitle } from "~/global/components/dialog-title";
import type { FC, ReactNode } from "react";
import { cn } from "~/global/utils/cn";

interface SliderOverHeaderProps {
    className?: string;
    title: string;
    children?: ReactNode;
}

export const SliderOverHeader: FC<SliderOverHeaderProps> = ({
    className,
    title,
}) => {
    return (
        <header
            className={cn(
                "relative w-full rounded-t-lg bg-surface p-6 pb-3",
                className
            )}
        >
            <div className="flex items-center gap-4">
                <DialogTitle title={title} className={"font-semibold"} />
            </div>
        </header>
    );
};
