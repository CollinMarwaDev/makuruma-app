import { cva, type VariantProps } from "class-variance-authority";
import type { FC, HTMLAttributes } from "react";
import { cn } from "~/global/utils/cn";

export type BadgeType =
    | "warning"
    | "danger"
    | "success"
    | "default"
    | "disabled";

export const badgeVariants = cva("badge items-center gap-1.5", {
    defaultVariants: {
        variant: "default",
    },
    variants: {
        variant: {
            danger: `[&_div]:bg-status-red-pc bg-status-red-bg text-status-red-pc`,
            default: `[&_div]:bg-status-blue-pc bg-status-blue-bg text-status-blue-pc`,
            disabled: `[&_div]:bg-status-grey-pc bg-status-grey-bg text-status-grey-pc`,
            success: `[&_div]:bg-status-green-pc bg-status-green-bg text-status-green-pc`,
            warning: `[&_div]:bg-status-yellow-pc bg-status-yellow-bg text-status-yellow-pc`,
        },
    },
});

type BadgeVariants = VariantProps<typeof badgeVariants>;
type DivElementProps = Omit<HTMLAttributes<HTMLDivElement>, "children">;

export interface BadgeProps extends DivElementProps, BadgeVariants {
    className?: string;
    hideDotIndicator?: boolean;
    label: string;
}

export const Badge: FC<BadgeProps> = ({
    className,
    hideDotIndicator,
    label,
    variant,
    ...rest
}) => {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...rest}>
            {!hideDotIndicator && <div className="size-1.5 rounded-full" />}
            <p className="whitespace-nowrap">{label}</p>
        </div>
    );
};
