import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import {
    type ComponentPropsWithoutRef,
    type ComponentRef,
    forwardRef,
    type ReactNode,
} from "react";
import Label from "~/global/components/form-controls/label";
import type { LabelWithValue } from "~/global/types";
import { cn } from "~/global/utils/cn";
import { generateRandomId } from "~/global/utils/string-utils";

export interface RadioGroupItemProps
    extends Omit<
        ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
        "value"
    > {
    containerClassName?: string;
    /** A short line under the label, such as what the option allows. */
    description?: string;
    hasError?: boolean;
    labelClassName?: string;
    /** Shown between the radio and the label, such as an avatar. */
    leading?: ReactNode;
    /** Shown after the label, such as a status tag. */
    trailing?: ReactNode;
    value: LabelWithValue;
}

export const RadioGroupItem = forwardRef<
    ComponentRef<typeof RadioGroupPrimitive.Item>,
    RadioGroupItemProps
>(
    (
        {
            className,
            containerClassName,
            description,
            disabled,
            hasError,
            labelClassName,
            leading,
            trailing,
            value,
            ...props
        },
        ref
    ) => {
        const itemId = generateRandomId();

        const labelNode = (
            <Label
                className={cn(
                    "text-neutral-550 cursor-pointer",
                    "group-has-[:first-child[data-state=checked]]:text-primary-950",
                    {
                        "disabled:cursor-not-allowed": disabled,
                    },
                    labelClassName
                )}
                htmlFor={itemId}
            >
                {value.label}
            </Label>
        );

        return (
            <div
                className={cn(
                    "group flex gap-2",
                    description ? "items-start" : "items-center",
                    containerClassName
                )}
                data-disabled={disabled}
            >
                <RadioGroupPrimitive.Item
                    {...props}
                    value={JSON.stringify(value)}
                    className={cn(
                        "focus:ring-primary/15 text-primary cursor-pointer focus:ring-4",
                        { "mt-0.5": !!description },
                        "border-secondary-200 aspect-square size-4.5 rounded-full border-[1.5px]",
                        "center focus:border-primary disabled:cursor-not-allowed disabled:opacity-50",
                        { "input-error": hasError },
                        className
                    )}
                    disabled={disabled}
                    id={itemId}
                    ref={ref}
                >
                    <RadioGroupPrimitive.Indicator className="bg-primary size-2 rounded-full" />
                </RadioGroupPrimitive.Item>

                {leading}

                {description ? (
                    <div className="flex min-w-0 flex-1 flex-col">
                        {labelNode}
                        <p className="text-xs text-neutral-500">
                            {description}
                        </p>
                    </div>
                ) : (
                    labelNode
                )}

                {trailing}
            </div>
        );
    }
);

RadioGroupItem.displayName = "RadioGroupItem";
