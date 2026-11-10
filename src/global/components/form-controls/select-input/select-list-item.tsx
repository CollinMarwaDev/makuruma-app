import { CheckIcon } from "~/global/components/icons";
import { Select as SelectPrimitive } from "radix-ui";
import {
    type ComponentPropsWithoutRef,
    type ComponentRef,
    forwardRef,
} from "react";
import type { IconType } from "~/global/types";
import { cn } from "~/global/utils/cn";

const SelectListItem = forwardRef<
    ComponentRef<typeof SelectPrimitive.Item>,
    ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & {
        icon?: IconType;
    }
>(({ className, children, icon: Icon, ...props }, ref) => (
    <SelectPrimitive.Item
        ref={ref}
        className={cn(
            "relative flex w-full cursor-default items-center rounded-lg px-3 py-2 text-sm outline-none select-none",
            "text-secondary-900 hover:bg-primary-100 transition-colors",
            "focus:bg-primary-100 focus:text-secondary-900",
            "data-[highlighted]:bg-primary-100 data-[highlighted]:text-secondary-900",
            "data-[state=checked]:bg-primary-200 data-[state=checked]:text-secondary-900 data-[state=checked]:font-semibold",
            "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            className
        )}
        {...props}
    >
        {Icon && (
            <span className="mr-2 h-4 w-4">
                <Icon className="h-4 w-4" />
            </span>
        )}
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        <SelectPrimitive.ItemIndicator className="text-primary absolute right-3 flex items-center justify-center">
            <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
));

SelectListItem.displayName = SelectPrimitive.Item.displayName;

export default SelectListItem;
