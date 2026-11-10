import { XMarkIcon } from "@heroicons/react/24/outline";
import type { FC, MouseEvent, ReactNode } from "react";
import { Avatar } from "~/global/components/avatar";
import type { AvatarCardImageProps } from "~/global/components/avatar/avatar-card";
import { ButtonIcon } from "~/global/components/button/button-icon";
import type { IconType } from "~/global/types";
import { cn } from "~/global/utils/cn";
import { getInitials } from "~/global/utils/string-utils";

interface ChipsButtonProps {
    children?: ReactNode;
    onClick?: VoidFunction;
}

export const ChipsButton = ({ children, onClick }: ChipsButtonProps) => {
    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        e.preventDefault();
        onClick?.();
    };
    return (
        <div className="bg-status-grey-bg flex w-fit shrink-0 items-center gap-2 overflow-hidden rounded-md px-1 py-1">
            {children}

            <ButtonIcon
                title={"Close"}
                className="bg-primary-shades-200 hover:bg-primary-shades-300 size-4 rounded-full p-0.5"
                icon={XMarkIcon}
                iconClassName="size-2.5"
                iconStrokeWidth={2.1}
                onClick={handleClick}
            />
        </div>
    );
};

const ChipsButtonIcon: FC<{ Icon: IconType }> = ({ Icon }) => {
    return (
        <Avatar className="size-4 bg-transparent">
            <Avatar.Icon icon={Icon} className="size-4.5" />
        </Avatar>
    );
};

const ChipsButtonImage: FC<AvatarCardImageProps> = ({
    fallBack,
    ...otherProps
}) => {
    return (
        <Avatar className="size-4">
            <Avatar.Image {...otherProps} />
            {fallBack && (
                <Avatar.Fallback className="font-jetbrains-mono text-primary-shades-500 text-[9px] font-semibold">
                    {getInitials(fallBack)}
                </Avatar.Fallback>
            )}
        </Avatar>
    );
};

type ChipsButtonLabelProps = {
    className?: string;
    label: string;
};

const ChipsButtonLabel = ({ className, label }: ChipsButtonLabelProps) => {
    return (
        <p
            className={cn(
                "text-dark-green text-primary-950 text-xs whitespace-nowrap",
                className
            )}
        >
            {label}
        </p>
    );
};

ChipsButton.Label = ChipsButtonLabel;
ChipsButton.Icon = ChipsButtonIcon;
ChipsButton.Image = ChipsButtonImage;
