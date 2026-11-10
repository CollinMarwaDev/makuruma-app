import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import {
    type ComponentPropsWithoutRef,
    type ComponentRef,
    forwardRef,
} from "react";
import { DropdownMenu } from "~/global/components/dropdown/dropdown-menu";
import { cn } from "~/global/utils/cn";

type DropdownMenuContentRef = ComponentRef<
    typeof DropdownMenuPrimitive.Content
>;
type DropdownMenuContentProps = ComponentPropsWithoutRef<
    typeof DropdownMenuPrimitive.Content
>;

export const DropdownMenuContent = forwardRef<
    DropdownMenuContentRef,
    DropdownMenuContentProps
>(({ className, sideOffset = 4, children, ...props }, ref) => (
    <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
            ref={ref}
            sideOffset={sideOffset}
            className={cn(
                "text-dark-green border-primary-shades-100 z-50",
                "data-[state=open]:animate-in data-[state=closed]:animate-out",
                "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                "shadow-3xl min-w-[8rem] overflow-hidden rounded-lg border bg-surface p-1",
                "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
                "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                className
            )}
            {...props}
        >
            {children}
            <DropdownMenu.Arrrow className={"fill-primary-shades-100"} />
        </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
));

DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
