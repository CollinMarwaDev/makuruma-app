import { type FC, forwardRef } from "react";
import {
    type Control,
    type FieldValues,
    type Path,
    useController,
} from "react-hook-form";
import { type NumberFormatValues, NumericFormat } from "react-number-format";
import { TextInputWithPrefix } from "~/global/components/form-controls/text-input-fields/text-input-with-prefix";
import { cn } from "~/global/utils/cn";

export interface NumberInputProps<
    TFieldValues extends FieldValues = FieldValues,
> {
    className?: string;
    control: Control<TFieldValues>;
    prefixComponent?: string;
    suffix?: string;
    defaultValue?: number;
    hasError?: boolean;
    name: Path<TFieldValues>;
    placeholder?: string;
    prefixClassName?: string;
    containerClassName?: string;
    inputType: "text-input";
}

const NumberInput: FC<NumberInputProps> = forwardRef<
    HTMLInputElement,
    NumberInputProps
>(
    (
        {
            prefixComponent: prefix,
            control,
            defaultValue,
            prefixClassName,
            name,
            ...rest
        },
        ref
    ) => {
        const {
            field: { onBlur: handleBlur, onChange: handleChange },
            fieldState: { error },
        } = useController({
            control,
            defaultValue,
            name,
        });

        const handleValueChange = (numberFormatValues: NumberFormatValues) => {
            const value = numberFormatValues.value; //💡none-formatted value
            handleChange(Number(value));
        };

        return (
            <NumericFormat
                value={defaultValue}
                customInput={TextInputWithPrefix}
                {...rest}
                hasError={!!error?.message}
                className={cn("pl-12", rest.className)}
                _prefix={`${prefix} - `}
                thousandSeparator
                onValueChange={handleValueChange}
                getInputRef={ref}
                onBlur={handleBlur}
                _suffix={"123"}
                suffixClassName={"text-primary text-xs"}
                prefixClassName={cn(
                    "text-sm text-muted-foreground font-light pl-1",
                    prefixClassName
                )}
            />
        );
    }
);

NumberInput.displayName = "CurrencyInput";

export default NumberInput;
