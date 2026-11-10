import type { ComponentPropsWithoutRef, FC, ReactNode } from "react";
import {
    Avatar,
    type AvatarIconProps,
} from "~/global/components/avatar/avatar-primitive";
import { cn } from "~/global/utils/cn";
import { getInitials } from "~/global/utils/string-utils";

export const AvatarCard = ({
    className,
    ...otherProps
}: ComponentPropsWithoutRef<"div">) => {
    return (
        <div
            className={cn("flex items-center gap-3", className)}
            {...otherProps}
        />
    );
};

export interface AvatarCardImageProps {
    active?: boolean;
    alt: string;
    containerClassName?: string;
    fallBack?: string;
    src: string;
}

const AvatarCardImage: FC<AvatarCardImageProps> = ({
    active,
    alt,
    containerClassName,
    src,
    fallBack,
}) => {
    return (
        <Avatar active={active} className={containerClassName}>
            <Avatar.Image src={src} alt={alt} />
            {fallBack && (
                <Avatar.Fallback>{getInitials(fallBack)}</Avatar.Fallback>
            )}
        </Avatar>
    );
};

export interface AvatarCardIconProps extends AvatarIconProps {
    active?: boolean;
    containerClassName?: string;
}

const AvatarCardIcon: FC<AvatarCardIconProps> = ({
    active,
    containerClassName,
    ...otherProps
}) => {
    return (
        <Avatar active={active} className={containerClassName}>
            <Avatar.Icon {...otherProps} />
        </Avatar>
    );
};

interface AvatarContentProps {
    className?: string;
    subtitle?: ReactNode;
    subtitleClassName?: string;
    swap?: boolean;
    title: string;
    titleClassName?: string;
}

const AvatarContent: FC<AvatarContentProps> = ({
    className,
    subtitle,
    subtitleClassName,
    swap,
    title,
    titleClassName,
}) => {
    return (
        <div className={cn("flex flex-col text-start", className)}>
            <p className={cn("text-sm", { "order-2": swap }, titleClassName)}>
                {title}
            </p>
            <p
                className={cn(
                    "text-primary-shades-600 text-xs",
                    { "order-1": swap },
                    { hidden: !subtitle },
                    subtitleClassName
                )}
            >
                {subtitle}
            </p>
        </div>
    );
};

AvatarCard.Content = AvatarContent;
AvatarCard.Icon = AvatarCardIcon;
AvatarCard.Image = AvatarCardImage;
