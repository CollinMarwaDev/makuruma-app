import { Select as SelectPrimitive } from "radix-ui";
import {
    forwardRef,
    useCallback,
    useEffect,
    useId,
    useRef,
    useState,
} from "react";
import {
    ErrorMessage,
    FieldContainer,
    inputClassNames,
} from "~/global/components/form-controls/common";
import Label from "~/global/components/form-controls/label";
import SelectContent from "~/global/components/form-controls/select-input/select-content";
import SelectListItem from "~/global/components/form-controls/select-input/select-list-item";
import SelectTrigger from "~/global/components/form-controls/select-input/select-trigger";
import type {
    SelectInputProps,
    SelectOption,
} from "~/global/components/form-controls/select-input/types";
import { useModalNestedOverlayRegistration } from "~/global/components/modal/modal-nested-overlay-context";
import { cn } from "~/global/utils/cn";

/** Select field that forwards accessible names and descriptions to its trigger. */
export const SelectInput = forwardRef<HTMLButtonElement, SelectInputProps>(
    (
        {
            "aria-describedby": describedBy,
            "aria-invalid": invalid,
            "aria-label": ariaLabel,
            className,
            containerClassName,
            defaultOpen,
            hasError,
            options = [],
            placeholder,
            loading = false,
            defaultValue,
            errorMessage,
            label,
            onChange,
            optional,
            labelClassName,
            onOpenChange,
            open: controlledOpen,
            id,
            ...props
        },
        ref
    ) => {
        const generatedId = useId();
        const inputId = id ?? generatedId;
        const errorId = errorMessage ? `${inputId}-error` : undefined;
        const [value, setValue] = useState<SelectOption>();
        const isControlled = controlledOpen !== undefined;
        const [uncontrolledOpen, setUncontrolledOpen] = useState(
            defaultOpen ?? false
        );
        const open = isControlled ? controlledOpen : uncontrolledOpen;
        const openRef = useRef(open);

        openRef.current = open;

        const handleOpenChange = useCallback(
            (nextOpen: boolean) => {
                if (!isControlled) setUncontrolledOpen(nextOpen);
                onOpenChange?.(nextOpen);
            },
            [isControlled, onOpenChange]
        );

        useModalNestedOverlayRegistration({
            close: () => handleOpenChange(false),
            isOpen: () => openRef.current,
        });

        useEffect(() => {
            if (defaultValue) {
                setValue(defaultValue);
            }
        }, [defaultValue, options]);

        const handleChange = (value: string) => {
            const parseOption = JSON.parse(value) as SelectOption;

            setValue(parseOption);
            onChange?.(parseOption);
        };

        return (
            <FieldContainer className={containerClassName}>
                {label && (
                    <div className="flex items-center justify-between">
                        <Label
                            htmlFor={inputId}
                            optional={optional}
                            className={labelClassName}
                        >
                            {label}
                        </Label>
                    </div>
                )}
                <SelectPrimitive.Root
                    disabled={loading}
                    onOpenChange={handleOpenChange}
                    open={open}
                    value={JSON.stringify(value)}
                    onValueChange={handleChange}
                    {...props}
                >
                    <SelectTrigger
                        aria-describedby={
                            [describedBy, errorId].filter(Boolean).join(" ") ||
                            undefined
                        }
                        aria-invalid={hasError || !!errorMessage || invalid}
                        aria-label={ariaLabel}
                        id={inputId}
                        ref={ref}
                        className={cn(inputClassNames, className)}
                        hasError={hasError}
                        loading={loading}
                    >
                        {value
                            ? value.label
                            : (placeholder ?? "Select an option")}
                    </SelectTrigger>
                    <SelectContent>
                        {options.map((option) => (
                            <SelectListItem
                                key={option.value.toString()}
                                value={JSON.stringify(option)}
                                icon={option.icon}
                            >
                                {option.label}
                            </SelectListItem>
                        ))}
                    </SelectContent>
                </SelectPrimitive.Root>
                {errorMessage && (
                    <ErrorMessage id={errorId} message={errorMessage} />
                )}
            </FieldContainer>
        );
    }
);

SelectInput.displayName = "SelectField";

export default SelectInput;
