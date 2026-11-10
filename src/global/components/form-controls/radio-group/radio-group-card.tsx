import type { FC } from "react";
import {
    RadioGroupItem,
    type RadioGroupItemProps,
} from "~/global/components/form-controls/radio-group/radio-group-item";
import { cn } from "~/global/utils/cn";

export const RadioGroupCardItem: FC<RadioGroupItemProps> = ({
    containerClassName,
    ...otherProps
}) => {
    return (
        <RadioGroupItem
            {...otherProps}
            containerClassName={cn(
                containerClassName,
                "border-2 px-3 py-2 rounded-xl border-surface ring ring-secondary-200",
                "hover:bg-secondary-50 has-[:first-child[data-state=checked]]:bg-surface-container"
            )}
            labelClassName={cn(
                "group-has-[:first-child[data-state=checked]]:text-primary-700",
                "group-has-[:first-child[data-state=checked]]:font-medium",
                "flex-1 w-full font-light"
            )}
            className="data-[state=checked]:bg-palette-container"
        />
    );
};
