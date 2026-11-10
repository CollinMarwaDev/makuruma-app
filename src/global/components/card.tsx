import type { ComponentPropsWithoutRef, ElementType, FC } from "react";
import { cn } from "~/global/utils/cn";

interface CardProps extends ComponentPropsWithoutRef<"div"> {
    as?: ElementType;
    /** `panel` is the white, rounded content panel of the workspace pages. */
    variant?: "outlined" | "filled" | "panel";
}

export const Card: FC<CardProps> = ({
    as: Tag = "div",
    className,
    variant = "outlined",
    ...otherProps
}) => {
    return (
        <Tag
            className={cn(
                "border-outline rounded-xl border p-3",
                {
                    "bg-surface-container ring-outline/40 border-2 border-surface ring-2":
                        variant == "filled",
                    "flex flex-col gap-4 rounded-2xl bg-surface p-4":
                        variant == "panel",
                },
                className
            )}
            {...otherProps}
        />
    );
};
