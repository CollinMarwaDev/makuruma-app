import { Select as SelectPrimitive } from "radix-ui";
import type { ComponentPropsWithoutRef, ComponentRef } from "react";
import { forwardRef } from "react";
import { cn } from "~/global/utils/cn";

interface SelectContentProps
    extends ComponentPropsWithoutRef<typeof SelectPrimitive.Content> {
    responsive?: boolean;
}

const SelectContent = forwardRef<
    ComponentRef<typeof SelectPrimitive.Content>,
    SelectContentProps
>(
    (
        {
            className,
            children,
            position = "popper",
            responsive = true,
            ...props
        },
        ref
    ) => (
        <SelectPrimitive.Portal>
            <SelectPrimitive.Content
                ref={ref}
                className={cn(
                    "text-dark-green border-primary-shades-100 z-50 max-h-80",
                    "data-[state=open]:animate-in data-[state=closed]:animate-out",
                    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 space-y-1",
                    "overflow-hidden rounded-lg border bg-surface p-1 shadow-md",
                    "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
                    "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                    {
                        "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1":
                            position === "popper",
                    },
                    {
                        "data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1":
                            position === "popper",
                    },
                    { "w-[var(--radix-select-trigger-width)]": responsive },
                    className
                )}
                position={position}
                {...props}
            >
                <SelectPrimitive.Viewport className="p-1">
                    {children}
                </SelectPrimitive.Viewport>
            </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
    )
);

SelectContent.displayName = SelectPrimitive.Content.displayName;

export default SelectContent;
