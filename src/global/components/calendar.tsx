import { DayPicker, type DayPickerProps, type Matcher } from "react-day-picker";
import "react-day-picker/style.css";
import type { FC } from "react";

export type CalendarProps = DayPickerProps & {
    max?: Date;
    min?: Date;
};

const Calendar: FC<CalendarProps> = ({ max, min, ...props }) => {
    return (
        <DayPicker
            disabled={
                {
                    after: max,
                    before: min,
                } as Matcher
            }
            showOutsideDays={true}
            classNames={{
                button_next:
                    "absolute right-6 size-7 gray-scale z-20 bg-transparent rounded-full opacity-50 hover:opacity-100",
                button_previous:
                    "bg-transparent size-7 z-20 stroke-1 rounded-full opacity-50 hover:opacity-100 absolute left-8",
                caption_label: "text-sm font-medium",
                day: "rounded-full hover:bg-surface-input text-center text-xs font-normal aria-selected:opacity-100",
                disabled: "text-neutral-200 opacity-50",
                hidden: "invisible",
                month_caption: "flex justify-center py-1 relative items-center",
                month_grid: "w-full border-collapse text-gray-500",
                months: "flex flex-col max-w-full justify-center sm:flex-row text-gray-500 relative sm:space-x-4 sm:space-y-0",
                nav: "flex items-start h-8 absolute left-0 top-0.5 right-0 w-full",
                outside:
                    "day-outside text-outline opacity-50  aria-selected:bg-surface-porcelain/50 aria-selected:text-primary-950/50 aria-selected:opacity-30",
                range_end: "bg-primary rounded-l-none",
                range_middle:
                    "aria-selected:bg-primary-300 bg-container! text-primary-950! rounded-none aria-selected:text-accent-foreground",
                range_start: "bg-primary rounded-r-none",
                selected: "!bg-primary text-primary-50 hover:!bg-accent",
                today: "bg-palette-container/40 text-primary",
                weekday: "p-2 text-center grayscale font-medium text-xs",
                weekdays: "text-center text-xs",
            }}
            {...props}
        />
    );
};

export default Calendar;
