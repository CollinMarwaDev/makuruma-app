import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { CheckIcon } from "@heroicons/react/24/outline";
import {
    forwardRef,
    type ComponentPropsWithoutRef,
    type ComponentRef,
} from "react";
import { cn } from "~/global/utils/cn";

export const DropdownMenuCheckboxItem = forwardRef<
    ComponentRef<typeof DropdownMenuPrimitive.CheckboxItem>,
    ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ children, className, ...props }, ref) => (
    <DropdownMenuPrimitive.CheckboxItem
        {...props}
        ref={ref}
        className={cn(
            "text-primary-950 focus:bg-surface-container relative flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm outline-none select-none",
            "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            className
        )}
    >
        {children}
        <span className="border-outline ml-auto flex size-4.5 shrink-0 items-center justify-center rounded border">
            <DropdownMenuPrimitive.ItemIndicator>
                <CheckIcon aria-hidden className="size-3.5" />
            </DropdownMenuPrimitive.ItemIndicator>
        </span>
    </DropdownMenuPrimitive.CheckboxItem>
));

DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";
