import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Select as SelectPrimitive } from "radix-ui";
import {
    type ComponentPropsWithoutRef,
    type ComponentRef,
    forwardRef,
} from "react";
import { LoadingCircle } from "~/global/components/icons";
import { cn } from "~/global/utils/cn";

const SelectTrigger = forwardRef<
    ComponentRef<typeof SelectPrimitive.Trigger>,
    ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
        hasError?: boolean;
        loading?: boolean;
        className?: string;
    }
>(({ className, hasError, loading, children, ...props }, ref) => (
    <SelectPrimitive.Trigger
        ref={ref}
        className={cn(
            "text-input flex min-h-11 w-full items-center justify-between",
            "text-left focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            {
                "input-error": hasError,
            },
            className
        )}
        {...props}
    >
        <span className="no-scrollbar w-full flex-1 overflow-x-auto pr-1 whitespace-nowrap">
            {children}
        </span>
        <div className="flex items-center">
            {loading ? (
                <LoadingCircle className="ml-2" />
            ) : (
                <SelectPrimitive.Icon asChild>
                    <ChevronDownIcon
                        strokeWidth={2}
                        className="size-4 opacity-50"
                    />
                </SelectPrimitive.Icon>
            )}
        </div>
    </SelectPrimitive.Trigger>
));

SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

export default SelectTrigger;
