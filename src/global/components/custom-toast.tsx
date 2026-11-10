import { memo, type FC } from "react";
import type { IconType } from "~/global/types";
import { cn } from "~/global/utils/cn";

export interface CustomToastProps {
    Icon: IconType;
    iconClassName?: string;
    message: string;
    title: string;
}

const CustomToast: FC<CustomToastProps> = ({
    Icon,
    message,
    iconClassName,
    title,
}) => {
    return (
        <div
            className={cn(
                "center w-88 justify-start gap-3 overflow-hidden rounded-xl p-3",
                "border border-neutral-100 bg-surface shadow-lg"
            )}
        >
            <Icon
                weight={"BoldDuotone"}
                className={cn("size-10 shrink-0", iconClassName)}
            />

            <div className={"text-sm"}>
                <p className={"font-semibold"}>{title}</p>
                <p className={"text-neutral-500"}>{message}</p>
            </div>
        </div>
    );
};

export default memo(CustomToast);
