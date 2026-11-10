import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { type ComponentRef, forwardRef, Fragment } from "react";
import { DropdownMenuSeparator } from "~/global/components/dropdown/dropdown-menu-separator";
import type { IconType, IconWeight, LabelWithNumberValue } from "~/global/types";
import { cn } from "~/global/utils/cn";

export interface DropdownMenuType extends Omit<LabelWithNumberValue, "value"> {
    icon?: IconType;
    danger?: boolean;
    divider?: boolean;
    weight?: IconWeight;
    onClick?: () => void;
    value?: number | string;
}

type DropdownMenuItemRef = ComponentRef<typeof DropdownMenuPrimitive.Item>;
export type DropdownMenuItemProps =
    DropdownMenuPrimitive.DropdownMenuItemProps & DropdownMenuType;

export const DropdownMenuItem = forwardRef<
    DropdownMenuItemRef,
    DropdownMenuItemProps
>(
    (
        {
            children,
            className,
            icon: Icon,
            weight,
            danger,
            divider,
            label,
            ...props
        },
        ref
    ) => (
        <Fragment>
            {divider && <DropdownMenuSeparator />}
            <DropdownMenuPrimitive.Item
                ref={ref}
                className={cn(
                    "focus:bg-primary relative flex",
                    "cursor-pointer items-center gap-2 rounded-lg px-2 py-2",
                    "text-sm transition-colors outline-none select-none",
                    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                    "text-primary-950 focus:text-white [&>svg]:size-4 [&>svg]:shrink-0",
                    { "focus:text-status-red focus:bg-status-red-bg": danger },
                    className
                )}
                {...props}
            >
                {Icon && (
                    <Icon
                        weight={weight}
                        className={"size-5"}
                        strokeWidth={2}
                    />
                )}
                {children ?? <label>{label}</label>}
            </DropdownMenuPrimitive.Item>
        </Fragment>
    )
);

DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
