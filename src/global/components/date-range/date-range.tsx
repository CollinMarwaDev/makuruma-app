import { DateRangeTrigger } from "~/global/components/date-range/date-range-trigger";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon } from "~/global/components/icons";
import { ButtonIcon } from "~/global/components/button";
import Calendar from "~/global/components/calendar";
import Popover from "~/global/components/popover";
import { type FC, useState } from "react";
import dayjs, { type Dayjs } from "dayjs";

export interface DateRangeProps {
    defaultValue?: { from: string; to: string };
    hasError?: boolean;
    hidden?: boolean;
    onChange?: (date: { from: string; to: string }) => void;
    max?: string;
    min?: string;
}

export const DateRange: FC<DateRangeProps> = ({
    defaultValue,
    hasError,
    onChange,
    max,
    min,
}) => {
    const [dateValue, setDateValue] = useState<
        { from: Date; to: Date } | undefined
    >(
        defaultValue
            ? {
                  from: dayjs(defaultValue.from).toDate(),
                  to: dayjs(defaultValue.to).toDate(),
              }
            : undefined
    );

    const handleDateChange = (dates?: { from: Dayjs; to: Dayjs }) => {
        if (!dates?.from || !dates?.to) {
            return;
        }

        const formatted = {
            from: dates.from.format("YYYY-MM-DD"),
            to: dates.to.format("YYYY-MM-DD"),
        };

        onChange?.(formatted);

        setDateValue({
            from: dates.from.toDate(),
            to: dates.to.toDate(),
        });
    };

    const convertToDateLabel = dateValue
        ? `${dayjs(dateValue.from).format("DD/MM/YYYY")} - ${dayjs(dateValue.to).format("DD/MM/YYYY")}`
        : undefined;

    return (
        <Popover modal>
            <Popover.Trigger className={"w-full"}>
                <DateRangeTrigger
                    dateValue={convertToDateLabel}
                    hasError={hasError}
                />
            </Popover.Trigger>
            <Popover.Content className="p-4">
                <Calendar
                    max={
                        max ? (dayjs(max).toDate() as number & Date) : undefined
                    }
                    min={
                        min ? (dayjs(min).toDate() as number & Date) : undefined
                    }
                    selected={dateValue}
                    onSelect={(dates) =>
                        dates &&
                        handleDateChange({
                            from: dayjs(dates.from),
                            to: dayjs(dates.to),
                        })
                    }
                    mode="range"
                    numberOfMonths={2}
                    components={{
                        NextMonthButton: ({ ...props }) => (
                            <ButtonIcon
                                title={"Next Month"}
                                icon={ChevronRightIcon}
                                {...props}
                                iconStrokeWidth={2}
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
