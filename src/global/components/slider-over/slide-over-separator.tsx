import type { IconType } from "~/global/types";
import type { FC } from "react";
import {cn} from "~/global/utils/cn";

interface SlideOverSeparatorProps {
    className?: string;
    title: string;
    icon: IconType;
}

const SlideOverSeparator: FC<SlideOverSeparatorProps> = ({
    className,
    icon: Icon,
    title,
}) => {
    return (
        <div className={cn("center w-full gap-2", className)}>
            <Icon className={"size-5 text-neutral-500"} />
            <h3 className={"font-semibold"}>{title}</h3>
            <hr className={"text-outline grow"} />
        </div>
    );
};

export default SlideOverSeparator;
