import type { MouseEventHandler } from "react";
import { forwardRef } from "react";
import { Button } from "~/global/components/button";
import type { ButtonProps } from "~/global/components/button/common";
import { type IconType, type IconWeight } from "~/global/types";
import { cn } from "~/global/utils/cn";
import Tooltip from "~/global/components/tooltip";

interface ButtonIconProps extends ButtonProps {
    icon: IconType;
    title: string;
    weight?: IconWeight;
    iconClassName?: string;
    iconStrokeWidth?: string | number | undefined;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

export const ButtonIcon = forwardRef<HTMLButtonElement, ButtonIconProps>(
    (
        {
            className,
            icon: Icon,
            iconClassName,
            onClick,
            iconStrokeWidth,
            title,
            weight,
            variant = "outline",
            ...rest
        },
        ref
    ) => {
        return (
            <Tooltip content={title}>
                <Button
                    aria-label={title}
                    tabIndex={-1}
                    {...rest}
                    ref={ref}
                    type={"button"}
                    onClick={onClick}
                    loadingText={""}
                    loadingIconClassName="size-5"
                    variant={variant}
                    className={cn(
                        "center text-muted-foreground hover:text-foreground border-outline bg-surface",
                        "size-9 shrink-0 border p-1 focus:ring-outline",
                        className
                    )}
                >
                    <Icon
                        weight={weight}
                        className={cn("size-5", iconClassName)}
                        strokeWidth={iconStrokeWidth ?? 2}
                    />
                </Button>
            </Tooltip>
        );
    }
);

ButtonIcon.displayName = "ButtonIcon";
