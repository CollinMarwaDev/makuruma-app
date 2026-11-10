import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import {
    type ComponentPropsWithoutRef,
    type ComponentRef,
    forwardRef,
    type ForwardRefExoticComponent,
    type RefAttributes,
} from "react";
import { RadioGroupCardItem } from "~/global/components/form-controls/radio-group/radio-group-card";
import { RadioGroupItem } from "~/global/components/form-controls/radio-group/radio-group-item";
import { type LabelWithValue } from "~/global/types";
import { stringifyLabelValue } from "~/global/utils/string-utils";

// ----------------------------------------------------------------------

type RadioGroupProps = Omit<
    ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>,
    "onValueChange" | "defaultValue" | "value"
> & {
    defaultValue?: LabelWithValue;
    onValueChange?: (value: LabelWithValue) => void;
    value?: LabelWithValue;
};

type RadioGroupComponentProps = ForwardRefExoticComponent<
    RadioGroupProps &
        RefAttributes<ComponentRef<typeof RadioGroupPrimitive.Root>>
> & {
    Item: typeof RadioGroupItem;
    ItemCard: typeof RadioGroupCardItem;
};

// ----------------------------------------------------------------------

export const RadioGroup = forwardRef<
    ComponentRef<typeof RadioGroupPrimitive.Root>,
    RadioGroupProps
>(({ className, defaultValue, onValueChange, value, ...props }, ref) => {
    const handleValueChange = (value: string) => {
        onValueChange?.(JSON.parse(value) as LabelWithValue);
    };

    return (
        <RadioGroupPrimitive.Root
            className={className}
            defaultValue={stringifyLabelValue(defaultValue)}
            {...props}
            onValueChange={onValueChange ? handleValueChange : undefined}
            ref={ref}
            value={stringifyLabelValue(value)}
        />
    );
}) as RadioGroupComponentProps;

RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

RadioGroup.Item = RadioGroupItem;
RadioGroup.ItemCard = RadioGroupCardItem;
