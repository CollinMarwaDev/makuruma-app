import { Popover as PopoverPrimitive } from "radix-ui";
import {
    type ComponentRef,
    forwardRef,
    useCallback,
    useRef,
    useState,
} from "react";
import { useModalNestedOverlayRegistration } from "~/global/components/modal/modal-nested-overlay-context";
import { cn } from "~/global/utils/cn";

// Define the extended interface
interface ExtendedPopoverContentProps extends PopoverContentProps {
    responsive?: boolean;
}

type PopoverContentProps = PopoverPrimitive.PopoverContentProps;
type PopoverProps = PopoverPrimitive.PopoverProps;

const Popover = (props: PopoverProps) => {
    const { defaultOpen, ...rootProps } = props;
    const isControlled = rootProps.open !== undefined;
    const [uncontrolledOpen, setUncontrolledOpen] = useState(
        defaultOpen ?? false
    );
    const open = isControlled ? rootProps.open === true : uncontrolledOpen;
    const openRef = useRef(open);

    openRef.current = open;

    const handleOpenChange = useCallback(
        (nextOpen: boolean) => {
            if (!isControlled) setUncontrolledOpen(nextOpen);
            rootProps.onOpenChange?.(nextOpen);
        },
        [isControlled, rootProps.onOpenChange]
    );

    useModalNestedOverlayRegistration({
        close: () => handleOpenChange(false),
        isOpen: () => openRef.current,
    });

    return (
        <PopoverPrimitive.Root
            {...rootProps}
            onOpenChange={handleOpenChange}
            open={open}
        />
    );
};

const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverClose = PopoverPrimitive.Close;

const PopoverArrow = (props: PopoverPrimitive.PopoverArrowProps) => {
    return (
        <PopoverPrimitive.Arrow
            className={cn("fill-primary-shades-100", props.className)}
            {...props}
        />
    );
};

const PopoverContent = forwardRef<
    ComponentRef<typeof PopoverPrimitive.Content>,
    ExtendedPopoverContentProps
>(
    (
        {
            className,
            align = "center",
            sideOffset = 4,
            responsive = true,
            ...props
        },
        ref
    ) => (
        <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
                ref={ref}
                align={align}
                sideOffset={sideOffset}
                className={cn(
                    // Animation states
                    "data-[state=open]:animate-in",
                    "data-[state=closed]:animate-out",
                    "data-[state=closed]:fade-out-0",
                    "data-[state=open]:fade-in-0",
                    "data-[state=closed]:zoom-out-95",
                    "data-[state=open]:zoom-in-95",

                    // Slide animations based onside
                    "data-[side=bottom]:slide-in-from-top-2",
                    "data-[side=left]:slide-in-from-right-2",
                    "data-[side=right]:slide-in-from-left-2",
                    "data-[side=top]:slide-in-from-bottom-2",

                    // Basic styles
                    "border-primary-shades-100 z-50 rounded-xl border bg-surface p-3 text-sm shadow-2xl",

                    { "w-[var(--radix-popover-trigger-width)]": responsive },
                    className
                )}
                {...props}
            />
        </PopoverPrimitive.Portal>
    )
);

PopoverContent.displayName = PopoverPrimitive.Content.displayName;

Popover.Trigger = PopoverTrigger;
Popover.Content = PopoverContent;
Popover.Close = PopoverClose;
Popover.Arrow = PopoverArrow;

export default Popover;
