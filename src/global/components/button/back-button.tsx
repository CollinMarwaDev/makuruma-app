import { ArrowLeftIcon, XWithinTriangleIcon } from "~/global/components/icons";
import { cva, type VariantProps } from "class-variance-authority";
import { Link } from "react-router-dom";
import type { FC } from "react";
import { cn } from "~/global/utils/cn";

const iconVariants = cva("size-6 p-0.5", {
    defaultVariants: {
        variant: "primary",
    },
    variants: {
        variant: {
            danger: "bg-status-red-bg text-status-red",
            primary: "bg-primary-shades-100 text-primary-shades-900",
        },
    },
});

type IconVariants = VariantProps<typeof iconVariants>;

interface BackButtonProps extends IconVariants {
    to: string;
    label: string;
    onClick?: VoidFunction;
}

export const BackButton: FC<BackButtonProps> = ({
    to,
    label,
    onClick,
    variant,
}) => {
    const Icon = variant === "danger" ? XWithinTriangleIcon : ArrowLeftIcon;

    return (
        <Link
            to={to}
            className="flex cursor-pointer items-center gap-2"
            onClick={onClick}
        >
            <div
                className={cn("center rounded-full", iconVariants({ variant }))}
            >
                <Icon strokeWidth={1.5} className="size-4" />
            </div>
            <p className="text-primary-950 text-sm whitespace-nowrap">
                {label}
            </p>
        </Link>
    );
};
