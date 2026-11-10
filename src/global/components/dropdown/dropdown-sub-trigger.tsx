import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import type { FC, ReactNode } from "react";
import { cn } from "~/global/utils/cn";

interface DropdownSubTriggerProps {
    children?: ReactNode;
    className?: string;
    label?: string;
}
export const DropdownSubTrigger: FC<DropdownSubTriggerProps> = ({
    children,
    className,
    label,
}) => {
    return (
        <DropdownMenuPrimitive.SubTrigger
            className={cn(
                "data-[highlighted]:bg-primary items-between rounded-lg py-2 data-[highlighted]:outline-none",
                "cursor-pointer gap-6 px-2 text-sm data-[highlighted]:text-white",
                "data-[highlighted]:data-[state=open]:bg-primary",
                "data-[state=open]:bg-primary-shades-50 data-[state=open]:text-primary",
                "group data-[highlighted]:data-[state=open]:text-white",
                className
            )}
        >
            {label ? (
                <>
                    <span className="whitespace-nowrap">{label}</span>
                    <ChevronRightIcon
                        strokeWidth={2}
                        className={cn(
                            "text-primary-shades-500 size-3.5 opacity-80",
                            "group-data-[highlighted]:text-white"
                        )}
                    />
                </>
            ) : (
                children
            )}
        </DropdownMenuPrimitive.SubTrigger>
    );
};
