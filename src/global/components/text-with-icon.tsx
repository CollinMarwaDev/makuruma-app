import type { FC } from "react";
import type { IconType, IconWeight } from "~/global/types";
import { cn } from "~/global/utils/cn";

export interface TextWithIconProps {
    Icon: IconType;
    text: string;
    textClassName?: string;
    iconClassName?: string;
    weight?: IconWeight;
}

const TextWithIcon: FC<TextWithIconProps> = ({
    Icon,
    text,
    weight,
    textClassName,
    iconClassName,
}) => {
    return (
        <div className={"flex w-fit items-center gap-2"}>
            <Icon
                weight={weight}
                strokeWidth={1.5}
                className={cn("text-primary-900 size-5", iconClassName)}
            />
            <p className={cn("text-dark-green text-sm", textClassName)}>
                {text}
            </p>
        </div>
    );
};
export default TextWithIcon;
