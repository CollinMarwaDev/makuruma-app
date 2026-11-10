import SelectListItem from "~/global/components/form-controls/select-input/select-list-item";
import SelectContent from "~/global/components/form-controls/select-input/select-content";
import { DatePickerTrigger } from "~/global/components/date-picker/date-picker-trigger";
import { ChevronDownIcon, ChevronLeftIcon } from "~/global/components/icons";
import type { DropdownProps } from "react-day-picker";
import { ButtonIcon } from "~/global/components/button";
import Calendar from "~/global/components/calendar";
import Popover from "~/global/components/popover";
import { type FC, useState } from "react";
import type { Dayjs } from "~/global/types";
import { Select } from "radix-ui";
import dayjs from "dayjs";

export interface DatePickerProps {
    defaultValue?: string;
    max?: string;
    min?: string;
    hasError?: boolean;
    hidden?: boolean;
    onChange?: (date: string) => void;
}

export const DatePicker: FC<DatePickerProps> = ({
    max,
    min,
    defaultValue,
    hasError,
    onChange,
}) => {
    const [dateValue, setDateValue] = useState(defaultValue);

    const handleDateChange = (date: Dayjs) => {
        onChange?.(date.format("YYYY-MM-DD"));

        setDateValue(date.format("YYYY-MM-DD"));
    };

    return (
        <Popover modal>
            <Popover.Trigger className={"w-full"}>
                <DatePickerTrigger dateValue={dateValue} hasError={hasError} />
            </Popover.Trigger>
            <Popover.Content className="w-fit p-4">
                <Calendar
                    max={max ? dayjs(max).toDate() : undefined}
                    min={min ? dayjs(min).toDate() : undefined}
                    selected={dayjs(dateValue).toDate()}
                    onSelect={(date) => handleDateChange(dayjs(date))}
                    mode="single"
                    reverseYears={true}
                    toYear={2050}
                    captionLayout="dropdown-years"
                    components={{
                        Dropdown: CustomDropdown,
                        NextMonthButton: ({ ...props }) => (
                            <ButtonIcon
                                title={"Next Month"}
                                icon={ChevronLeftIcon}
                                {...props}
                                iconStrokeWidth={2}
                                iconClassName="rotate-180"
                            />
                        ),
                        PreviousMonthButton: ({ ...props }) => (
                            <ButtonIcon
                                title={"Previous Month"}
                                icon={ChevronLeftIcon}
                                {...props}
                                iconStrokeWidth={2}
                            />
                        ),
                    }}
                />
                <Popover.Arrow />
            </Popover.Content>
        </Popover>
    );
};

export const CustomDropdown = ({
    options,
    value: yearValue,
    onChange,
}: DropdownProps) => {
    const handleValueChange = (newValue: string) => {
        if (onChange) {
            const syntheticEvent = {
                target: {
                    value: newValue,
                },
            } as React.ChangeEvent<HTMLSelectElement>;

            onChange(syntheticEvent);
        }
    };

    return (
        <Select.Root
            defaultValue={String(yearValue)}
            value={String(yearValue)}
            onValueChange={(val) => handleValueChange(val)}
        >
            <Select.Trigger id="year" className="w-full">
                <div className="center gap-1 text-sm">
                    <p>{yearValue || "year"}</p>
                    <Select.Icon asChild>
                        <ChevronDownIcon
                            strokeWidth={2}
                            className="size-4 opacity-50"
                        />
                    </Select.Icon>
                </div>
            </Select.Trigger>
            <SelectContent responsive={false} className="max-h-60">
                {options?.map(({ label, disabled, value }) => (
                    <SelectListItem
                        key={value}
                        disabled={disabled}
                        value={String(value)}
                        className="center"
                    >
                        {label}
                    </SelectListItem>
                ))}
            </SelectContent>
        </Select.Root>
    );
};
