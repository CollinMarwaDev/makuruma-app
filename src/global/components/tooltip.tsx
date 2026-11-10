import { Tooltip as TooltipPrimitive } from "radix-ui";
import {
    type ComponentPropsWithoutRef,
    type ComponentRef,
    forwardRef,
} from "react";
import { cn } from "~/global/utils/cn";

export type TooltipProps = ComponentPropsWithoutRef<
    typeof TooltipPrimitive.Content
> & {
    children: React.ReactNode;
    className?: string;
    content: React.ReactNode; // allow nodes, not just strings
};

const Tooltip = forwardRef<
    ComponentRef<typeof TooltipPrimitive.Content>,
    TooltipProps
>(({ content, children, className, ...props }, ref) => {
    return (
        <TooltipPrimitive.Provider>
            <TooltipPrimitive.Root>
                <TooltipPrimitive.Trigger asChild>
                    {children}
                </TooltipPrimitive.Trigger>
                <TooltipPrimitive.Portal>
                    <TooltipPrimitive.Content
                        ref={ref}
                        {...props}
                        className={cn(
                            "border-primary-shades-100 z-50 border text-center text-xs text-foreground",
                            "data-[state=open]:animate-in data-[state=closed]:animate-out",
                            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                            "max-w-[10rem] min-w-[4rem] overflow-hidden rounded-lg bg-surface p-2 shadow-lg",
                            "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
                            "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                            className
                        )}
                    >
                        {content}
                        <TooltipPrimitive.Arrow
                            className={"fill-primary-shades-100"}
                        />
                    </TooltipPrimitive.Content>
                </TooltipPrimitive.Portal>
            </TooltipPrimitive.Root>
        </TooltipPrimitive.Provider>
    );
});

Tooltip.displayName = "Tooltip";

export default Tooltip;
