import { Link, type LinkProps } from "react-router-dom";
import { cn } from "~/global/utils/cn";
import type { FC } from "react";
import type { IconType } from "~/global/types";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

interface TextCtaLinkProps extends LinkProps {
    to: string;
    Icon?: IconType;
    label: string;
}

export const TextCtaLink: FC<TextCtaLinkProps> = ({
    to,
    Icon,
    label,
    className,
    ...rest
}) => {
    const LinkIcon = Icon ?? PlusCircleIcon;
    return (
        <Link
            to={to}
            className={cn(
                "hover:glow border-outline text-primary flex items-center gap-1 rounded-md border px-2 text-xs whitespace-nowrap",
                className
            )}
            {...rest}
        >
            <LinkIcon strokeWidth={2} className={"size-4"} />
            <p>{label}</p>
        </Link>
    );
};
