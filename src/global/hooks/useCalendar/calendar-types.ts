import type {
    ComponentPropsWithoutRef,
    Dispatch,
    HTMLAttributes,
    RefObject,
    SetStateAction,
} from "react";
import type { Callable, Dayjs } from "~/global/types";

/**
 * Supported calendar selection modes
 * - single: Select a single date
 * - multiple: Select multiple individual dates
 * - range: Select a range of dates with start and end
 */
export type CalendarMode = "single" | "multiple" | "range";

/**
 * Represents a range of dates with start (from) and end (to) dates
 */
export type DateRange = {
    /** Start date of the range */
    from: Dayjs;
    /** End date of the range */
    to: Dayjs;
};

/**
 * Represents a range of dates as a string with start (from) and end (to) dates
 */
export type DateRangeString = {
    /** Start date of the range */
    from: string;
    /** End date of the range */
    to: string;
};

/**
 * Base properties for all calendar modes
 */
export type CalendarBaseProps = {
    /** Optional minimum selectable date - dates before this will be disabled */
    min?: string;
    /** Optional maximum selectable date - dates after this will be disabled */
    max?: string;
};

/**
 * Properties for range selection mode
 */
type DateRangeProps = CalendarBaseProps & {
    /** Callback function triggered when date range selection changes */
    onChange?: (range: DateRange) => void;
    /** Optional default selected date range */
    defaultValue?: DateRangeString;
    /** Calendar mode set to "range" */
    mode: "range";
};

/**
 * Properties for single date selection mode
 */
type SingleDateProps = CalendarBaseProps & {
    /** Callback function triggered when date selection changes */
    onChange?: (date: Dayjs) => void;
    /** Optional default selected date */
    defaultValue?: string;
    /** Calendar mode set to "single" */
    mode: "single";
};

/**
 * Properties for multiple date selection mode
 */
type MultipleDateProps = CalendarBaseProps & {
    /** Callback function triggered when date selection changes */
    onChange?: (date: Dayjs[]) => void;
    /** Optional default selected dates */
    defaultValue?: string[];
    /** Calendar mode set to "multiple" */
    mode: "multiple";
};

/**
 * Internal calendar state
 */
export type CalenderState = {
    /** Two-dimensional array representing the days in the active month */
    activeMonth: Dayjs[][];
    /** Index of the active month (0-11) */
    activeMonthIndex: number;
    /** Active year */
    activeYear: number;
};

/**
 * Utility type to extract the mode from a calendar props object
 */
export type ExtractMode<T> = T extends { mode: infer M } ? M : never;

/**
 * Type that resolves to the appropriate result type based on the calendar mode
 * - For "single" mode: returns a single Dayjs object
 * - For "multiple" mode: returns an array of Dayjs objects
 * - For "range" mode: returns a DateRange object
 */
export type CalendarResult<M> = M extends "single"
    ? Dayjs | undefined
    : M extends "multiple"
      ? Dayjs[]
      : M extends "range"
        ? DateRange | undefined
        : never;

/**
 * Union type of all possible calendar props configurations
 */
export type CalenderProps =
    | SingleDateProps
    | MultipleDateProps
    | DateRangeProps;

/**
 * Extends HTML attributes with a ref property
 * Used for elements that need both HTML attributes and a ref
 * @template T - The type of HTML element
 */
export type HTMLAttributesWithRef<T> = HTMLAttributes<T> & {
    /** Reference to the DOM element */
    ref: RefObject<T | null>;
};

/**
 * Return type for the useCalendar hook
 * Contains all state and functions needed to build a calendar UI
 * @template M - The calendar mode type ("single", "multiple", or "range")
 */
export type UseCalendarReturnType<M> = {
    /** Two-dimensional array representing the days in the active month */
    activeMonth: Dayjs[][];

    /** Index of the active month (0-11) */
    activeMonthIndex: number;

    /** Active year */
    activeYear: number;

    /** Array of day names (e.g., ["Sun", "Mon", "Tue", ...]) used for the calendar header */
    dayNames: string[];

    /**
     * Function to get props for a day element
     * @param day - The day to generate props for
     * @param props - Additional HTML attributes to include
     * @returns HTML attributes for the day element including accessibility attributes,
     * event handlers, and data attributes for styling based on the day's state,
     * along with the day name (e.g., "Mon", "Tue")
     */
    getDayProps: (
        day: Dayjs,
        props?: ComponentPropsWithoutRef<"button">
    ) => ComponentPropsWithoutRef<"button">;

    /**
     * Function to get props for the calendar footer
     * @param props - Additional HTML attributes to include
     * @returns HTML attributes for the calendar footer element
     */
    getFooterProps: (
        props?: HTMLAttributes<HTMLElement>
    ) => HTMLAttributes<HTMLElement>;

    /**
     * Function to get props for the calendar header
     * @param props - Additional HTML attributes to include
     * @returns HTML attributes for the calendar header element
     */
    getHeaderProps: (
        props?: HTMLAttributes<HTMLElement>
    ) => HTMLAttributes<HTMLElement>;
    /**
     * Function to get props for the month grid container
     * @param props - Additional HTML attributes to include
     * @returns HTML attributes for the month grid container element
     */
    getMonthGridContainerProps: (
        props?: HTMLAttributes<HTMLElement>
    ) => HTMLAttributesWithRef<HTMLElement>;

    /**
     * Function to get props for the next month button
     * @param props - Additional HTML attributes to include
     * @returns HTML attributes for the next month button element
     */
    getNextMonthButtonProps: (
        props?: ComponentPropsWithoutRef<"button">
    ) => ComponentPropsWithoutRef<"button">;

    /**
     * Function to get props for the previous and next month button
     * @param props - Additional HTML attributes to include
     * @returns HTML attributes for the previous month button element
     */
    getPreviousMonthButtonProps: (
        props?: ComponentPropsWithoutRef<"button">
    ) => ComponentPropsWithoutRef<"button">;

    /**
     * Function to navigate to a specific month
     * @param dayOrMonthIndex - Either a Dayjs object or a month index (0-11)
     */
    goToMonth: (dayOrMonthIndex: Dayjs | number) => void;

    /** Function to navigate to the next month */
    goToNextMonth: VoidFunction;

    /** Function to navigate to the previous month */
    goToPreviousMonth: VoidFunction;

    /** Function to navigate to the next year */
    goToNextYear: VoidFunction;

    /** Function to navigate to the previous year */
    goToPreviousYear: VoidFunction;

    /**
     * Function to handle day click events and update the selected date(s)
     * @param day - The day that was clicked
     */
    handleDayClick: (day: Dayjs) => void;

    /**
     * Function to check if a day is today's date
     */
    isDayToday: Callable<Dayjs, boolean>;

    /**
     * Function to check if a day is selected
     * @param day - The day to check
     * @returns True if the day is selected
     */
    isDaySelected: (day: Dayjs) => boolean;

    /**
     * Function to check if a day is within the active month
     * @param day - The day to check
     * @returns True if the day is within the active month
     */
    isDayWithinActiveMonth: (day: Dayjs, activeMonthIndex?: number) => boolean;

    /**
     * Function to check if a day is within the allowed date range (min/max)
     * @param day - The day to check
     * @returns True if the day is within the allowed range or if no range is set
     */
    isDayWithinAllowedRange: (day: Dayjs) => boolean;

    /**
     * Function to check if a day is within a specific date range (from and to)
     * @param day - The day to check
     * @param dateRange - The date range object with from and to properties
     * @returns True if the day is within the date range, false otherwise
     */
    isDayWithinDateRange: (day: Dayjs) => boolean;

    /** The calendar mode */
    mode: CalendarMode;

    /** Optional minimum selectable date */
    min?: Dayjs;

    /** Optional maximum selectable date */
    max?: Dayjs;

    /** The currently selected date(s) based on the calendar mode */
    selectedDate: CalendarResult<M>;

    setActiveYear: Callable<number>;

    setSelectedDate: Dispatch<SetStateAction<CalendarResult<M>>>;
};
