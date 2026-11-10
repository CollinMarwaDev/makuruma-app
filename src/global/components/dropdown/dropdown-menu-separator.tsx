import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import {
    type ComponentPropsWithoutRef,
    type ComponentRef,
    forwardRef,
} from "react";
import { cn } from "~/global/utils/cn";

type DropdownMenuSeparatorRef = ComponentRef<
    typeof DropdownMenuPrimitive.Separator
>;
type DropdownMenuSeparatorProps = ComponentPropsWithoutRef<
    typeof DropdownMenuPrimitive.Separator
>;

export const DropdownMenuSeparator = forwardRef<
    DropdownMenuSeparatorRef,
    DropdownMenuSeparatorProps
>(({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.Separator
        ref={ref}
        className={cn("bg-primary-shades-100 -mx-1 my-1 h-px", className)}
        {...props}
    />
));

DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
