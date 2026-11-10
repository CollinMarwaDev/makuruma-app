import { type FC, type ReactNode, useId } from "react";
import { Combobox } from "~/global/components/combobox/combobox";
import type { ComboboxTriggerType } from "~/global/components/form-controls/combobox-input/combobox-types";
import {
    ErrorMessage,
    FieldContainer,
    inputClassNames,
} from "~/global/components/form-controls/common";
import Label from "~/global/components/form-controls/label";
import { cn } from "~/global/utils/cn";

interface ComboboxTriggerContainerProps extends ComboboxTriggerType {
    children: ReactNode;
    triggerClassName?: string;
}

const ComboboxTriggerContainer: FC<ComboboxTriggerContainerProps> = ({
    "aria-describedby": describedBy,
    "aria-invalid": invalid,
    children,
    containerClassName,
    disabled,
    errorMessage,
    hasError,
    id,
    label,
    labelClassName,
    triggerClassName,
}) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = errorMessage ? `${inputId}-error` : undefined;
    return (
        <FieldContainer className={containerClassName}>
            <Label htmlFor={inputId} className={labelClassName}>
                {label}
            </Label>
            <Combobox.Trigger
                aria-describedby={
                    [describedBy, errorId].filter(Boolean).join(" ") ||
                    undefined
                }
                aria-invalid={hasError || !!errorMessage || invalid}
                id={inputId}
                disabled={disabled}
                className={cn(
                    inputClassNames,
                    "w-full",
                    "px-0 md:py-0 lg:py-0",
                    { "input-error": hasError },
                    triggerClassName
                )}
            >
                {children}
            </Combobox.Trigger>
            <ErrorMessage id={errorId} message={errorMessage} />
        </FieldContainer>
    );
};
export default ComboboxTriggerContainer;
