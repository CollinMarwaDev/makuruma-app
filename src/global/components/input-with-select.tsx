import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Select as SelectPrimitive } from "radix-ui";
import { type ComponentProps, type FC, useEffect, useState } from "react";
import { inputClassNames } from "~/global/components/form-controls/common";
import SelectContent from "~/global/components/form-controls/select-input/select-content";
import SelectListItem from "~/global/components/form-controls/select-input/select-list-item";
import { TextInputBasic } from "~/global/components/form-controls/text-input-fields";
import type { TextInputBasicProps } from "~/global/components/form-controls/text-input-fields/text-input-basic";
import type { Callable, LabelWithValue } from "~/global/types";
import { cn } from "~/global/utils/cn";

export const InputWithSelect = ({
    className,
    ...rest
}: ComponentProps<"div">) => {
    return (
        <div
            {...rest}
            className={cn("relative col-span-2 flex w-full", className)}
        />
    );
};

// ----------------------------------------------------------------------

const TextInput: FC<TextInputBasicProps> = ({ className, ...rest }) => {
    return (
        <TextInputBasic
            {...rest}
            className={cn("w-full flex-1 rounded-l-none", className)}
        />
    );
};

// ----------------------------------------------------------------------

interface InputWithSelectSelectProps
    extends Pick<
        ComponentProps<typeof SelectPrimitive.Trigger>,
        "aria-describedby" | "aria-invalid" | "aria-label" | "id"
    > {
    className?: string;
    defaultValue?: LabelWithValue;
    disabled?: boolean;
    hasError?: boolean;
    onChange?: Callable<LabelWithValue>;
    options: LabelWithValue[];
    isPhone?: boolean;
}

/** Forwards input identity and accessible feedback to the actual select trigger. */
export const Select: FC<InputWithSelectSelectProps> = ({
    className,
    defaultValue,
    disabled,
    hasError,
    onChange,
    options,
    isPhone,
    ...triggerProps
}) => {
    const [selectedOption, setSelectedOption] = useState<LabelWithValue>();

    useEffect(() => {
        setSelectedOption(defaultValue);
    }, [defaultValue]);

    const handleValueChange = (value: string) => {
        const parsedValue = JSON.parse(value) as LabelWithValue;

        setSelectedOption(parsedValue);
        onChange?.(parsedValue);
    };

    return (
        <SelectPrimitive.Root
            onValueChange={handleValueChange}
            defaultValue={
                defaultValue ? JSON.stringify(defaultValue) : undefined
            }
            disabled={disabled}
            value={JSON.stringify(selectedOption)}
        >
            <SelectPrimitive.Trigger
                {...triggerProps}
                className={cn(
                    inputClassNames,
                    "flex w-24 items-center justify-between gap-2 rounded-r-none",
                    "border-r-0 px-2 py-2 text-left font-medium focus:outline-none",
                    {
                        "cursor-not-allowed opacity-50": disabled,
                        "input-error": hasError,
                        "rounded-xl border-r-2": isPhone,
                    },
                    className
                )}
            >
                <img
                    hidden={!isPhone}
                    alt={selectedOption?.label}
                    src={`https://flagcdn.com/${selectedOption?.label.toLowerCase()}.svg`}
                    className={"size-4 rounded-full object-cover object-center"}
                />
                {isPhone ? selectedOption?.value : selectedOption?.label}
                <SelectPrimitive.Icon hidden={isPhone}>
                    <ChevronDownIcon
                        className="text-primary-shades-500 size-4"
                        strokeWidth={2}
                    />
                </SelectPrimitive.Icon>
            </SelectPrimitive.Trigger>
            <SelectContent
                position={"popper"}
                className={"max-h-80 overflow-hidden"}
            >
                {options.map((option) => (
                    <SelectListItem
                        key={option.value.toString()}
                        value={JSON.stringify(option)}
                        className="p-1.5"
                    >
                        <div
                            className={cn({
                                "flex items-center gap-2 px-0 text-xs": isPhone,
                            })}
                        >
                            <img
                                hidden={!isPhone}
                                alt={option?.label}
                                src={`https://flagcdn.com/${option.label.toLowerCase()}.svg`}
                                className="size-4 rounded-full object-cover object-center"
                            />
                            {isPhone ? option.value : option.label}
                        </div>
                    </SelectListItem>
                ))}
            </SelectContent>
        </SelectPrimitive.Root>
    );
};

InputWithSelect.Input = TextInput;
InputWithSelect.Select = Select;
