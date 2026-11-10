import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import {
    type ComponentPropsWithoutRef,
    type FocusEvent,
    type HTMLAttributes,
    type KeyboardEvent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import type {
    CalendarMode,
    CalendarResult,
    CalenderProps,
    CalenderState,
    DateRange,
    ExtractMode,
    HTMLAttributesWithRef,
    UseCalendarReturnType,
} from "~/global/hooks/useCalendar/calendar-types";
import type { Dayjs } from "~/global/types";

// Enable the isBetween plugin for dayjs
dayjs.extend(isBetween);

// Add this utility function at the top level of useCalendar.ts or a utils file

export const normalizeMonthYear = (month: number, year: number) => {
    let normalizedMonth = month;
    let normalizedYear = year;

    while (normalizedMonth > 11) {
        normalizedMonth -= 12;
        normalizedYear += 1;
    }

    while (normalizedMonth < 0) {
        normalizedMonth += 12;
        normalizedYear -= 1;
    }

    return { monthIndex: normalizedMonth, year: normalizedYear };
};

/**
 * Keyboard navigation constants
 */
const ARROW_UP = "ArrowUp";
const ARROW_DOWN = "ArrowDown";
const ARROW_LEFT = "ArrowLeft";
const ARROW_RIGHT = "ArrowRight";
const HOME = "Home";
const END = "End";
const PAGE_UP = "PageUp";
const PAGE_DOWN = "PageDown";
const ENTER = "Enter";
const SPACE = " ";

/**
 * Keys that trigger calendar navigation actions
 */
const VALID_KEYS = new Set([
    ARROW_DOWN,
    ARROW_UP,
    ARROW_LEFT,
    ARROW_RIGHT,
    HOME,
    END,
    PAGE_UP,
    PAGE_DOWN,
    ENTER,
    SPACE,
]);

/**
 * Keys that trigger date selection
 */
const SELECT_DATE_KEY = [ENTER, SPACE];

/**
 * Generates a unique ID for a day element based on its date
 * @param day - The day to generate an ID for
 * @returns A string ID in the format "YYYY-MM-DD"
 */
const generateDateId = (day: Dayjs) => {
    return day.format("YYYY-MM-DD");
};

/**
 * Extracts a date from the defaultValue based on its type
 * @param defaultValue - The default value to extract date from
 * @returns A Dayjs object representing the extracted date, or current date if no valid date found
 */
const extractDateFromDefaultValue = (
    defaultValue: CalenderProps["defaultValue"]
): Dayjs => {
    if (!defaultValue) {
        return dayjs();
    }

    if (typeof defaultValue === "string") {
        return dayjs(defaultValue);
    } else if (Array.isArray(defaultValue) && defaultValue.length > 0) {
        return dayjs(defaultValue[0]);
    } else if (typeof defaultValue === "object" && "from" in defaultValue) {
        return dayjs(defaultValue.from);
    }

    return dayjs();
};

/**
 * Initializes the selected date based on the calendar mode
 * @param mode - The calendar selection mode
 * @returns An initialized date value appropriate for the specified mode
 * - For "single" mode: returns undefined
 * - For "range" mode: returns undefined
 * - For "multiple" mode: returns an empty array
 */
const initializeSelectedDate = <T extends CalenderProps>(
    mode: CalendarMode
) => {
    if (mode === "single") {
        return undefined as unknown as CalendarResult<ExtractMode<T>>;
    } else if (mode === "range") {
        return undefined as unknown as CalendarResult<ExtractMode<T>>;
    } else return [] as unknown as CalendarResult<ExtractMode<T>>;
};

/**
 * Generates a two-dimensional array representing a month's calendar grid
 * @param month - The month index (0-11), defaults to current month
 * @param year - The year, defaults to current year
 * @returns A 5x7 array of Dayjs objects representing the calendar grid
 * The grid includes days from previous and next months to fill the weeks
 */
export const getMonth = (month = dayjs().month(), year = dayjs().year()) => {
    const firstDayOfMonth = dayjs(new Date(year, month, 1)).day();
    let currentMonthCount = 0 - firstDayOfMonth;

    return new Array(5).fill([]).map(() => {
        return new Array(7).fill(null).map(() => {
            currentMonthCount++;
            return dayjs(new Date(year, month, currentMonthCount));
        });
    });
};

/**
 * A custom hook for creating and managing calendar functionality
 * @param mode - The calendar selection mode: 'single', 'multiple', or 'range'
 * @param defaultValue - Optional default selected date(s)
 * @param onChange - Callback function triggered when selection changes
 * @param min - Optional minimum selectable date
 * @param max - Optional maximum selectable date
 * @returns Calendar state and functions for managing the calendar
 */
export const useCalendar = <T extends CalenderProps>({
    mode,
    defaultValue,
    onChange,
    min,
    max,
}: T): UseCalendarReturnType<ExtractMode<T>> => {
    // =========================================================================
    // State initialization
    // =========================================================================

    /**
     * The currently focused date for keyboard navigation
     */
    const [focusedDate, setFocusedDate] = useState<Dayjs>(dayjs());

    /**
     * Whether the month grid container is currently focused
     */
    const [isMonthGridFocused, setIsMonthGridFocused] = useState(false);

    /**
     * Reference to the month grid container element
     */
    const monthGridRef = useRef<HTMLDivElement>(null);

    /**
     * Whether the user is currently navigating between days using keyboard
     */
    const [isNavigatingDays, setIsNavigatingDays] = useState(false);

    /**
     * The currently selected date(s) based on the calendar mode
     */
    const [selectedDate, setSelectedDate] = useState<
        CalendarResult<ExtractMode<T>>
    >(() => initializeSelectedDate(mode));

    /**
     * Reset selected date when mode changes
     */
    useEffect(() => {
        setSelectedDate(initializeSelectedDate<T>(mode));
    }, [mode]);

    /**
     * Calendar state containing the active month grid, month index, and year
     */
    const [calendarState, setCalendarState] = useState<CalenderState>(() => {
        // Initialize with default value's date if provided, otherwise use current date
        const initialDate = extractDateFromDefaultValue(defaultValue);

        return {
            activeMonth: getMonth(initialDate.month(), initialDate.year()),
            activeMonthIndex: initialDate.month(),
            activeYear: initialDate.year(),
        };
    });

    /**
     * Parse the default value into the appropriate format based on calendar mode
     */
    const parseDefaultValue = useMemo(() => {
        if (!defaultValue) return undefined;

        if (Array.isArray(defaultValue)) {
            return defaultValue.map((day) => dayjs(day));
        } else if (typeof defaultValue === "object" && "from" in defaultValue) {
            return {
                from: dayjs(defaultValue.from),
                to: dayjs(defaultValue.to),
            };
        } else return dayjs(defaultValue);
    }, [defaultValue]);

    /**
     * Set the selected date to the default value if provided and update activeYear
     */
    useEffect(() => {
        if (defaultValue) {
            setSelectedDate(
                parseDefaultValue as CalendarResult<ExtractMode<T>>
            );

            // Update activeYear and activeMonthIndex based on default value
            const dateToNavigateTo = extractDateFromDefaultValue(defaultValue);

            setCalendarState((prev) => ({
                ...prev,
                activeMonth: getMonth(
                    dateToNavigateTo.month(),
                    dateToNavigateTo.year()
                ),
                activeMonthIndex: dateToNavigateTo.month(),
                activeYear: dateToNavigateTo.year(),
            }));
        }
    }, [JSON.stringify(defaultValue)]);

    // =========================================================================
    // Date selection and handling
    // =========================================================================

    /**
     * Updates the selected date(s) and calls the onChange callback if provided
     * @param day - The newly selected date(s)
     */
    const updateSelectedDate = useCallback(
        (day: CalendarResult<ExtractMode<T>>) => {
            setSelectedDate(day);
            if (onChange) {
                if (mode === "single") {
                    onChange(day as Dayjs);
                } else if (mode === "multiple") {
                    onChange(day as Dayjs[]);
                } else {
                    onChange(day as DateRange);
                }
            }
        },
        [mode, onChange]
    );

    /**
     * Checks if a day is already selected
     * @param day - The day to check
     * @returns True if the day is selected
     */
    const isDaySelected = useCallback(
        (day: Dayjs) => {
            if (!selectedDate) {
                return false;
            }

            if (Array.isArray(selectedDate)) {
                return selectedDate.some((_day) => day.isSame(_day, "day"));
            } else if (
                typeof selectedDate === "object" &&
                "from" in selectedDate
            ) {
                return day.isBetween(
                    selectedDate.from,
                    selectedDate.to,
                    "day",
                    "[]"
                );
            } else {
                return day.isSame(selectedDate, "day");
            }
        },
        [selectedDate]
    );

    /**
     * Checks if a day is within the currently displayed month grid
     * @param _day - The day to check
     * @returns True if the day is within the displayed month grid
     */
    const isDayWithinDisplayedMonth = useCallback(
        (_day: Dayjs) => {
            return calendarState.activeMonth.some((weekdays) =>
                weekdays.some((day) => _day.isSame(day, "day"))
            );
        },
        [calendarState.activeMonth]
    );

    /**
     * Checks if a day is within the active month
     * @param day - The day to check
     * @returns True if the day is within the active month
     */
    const isDayWithinActiveMonth = useCallback(
        (day: Dayjs, activeMonthIndex?: number) => {
            if (activeMonthIndex) return day.month() === activeMonthIndex;
            return day.month() === calendarState.activeMonthIndex;
        },
        [calendarState.activeMonthIndex]
    );

    /**
     * Checks if a day is within the allowed date range (min/max)
     * @param day - The day to check
     * @returns True if the day is within the allowed range or if no range is set
     */
    const isDayWithinAllowedRange = useCallback(
        (day: Dayjs) => {
            if (min && max) {
                return day.isBetween(min, max, "day", "[]");
            } else if (min && day.isBefore(min, "day")) {
                return false;
            } else return !(max && day.isAfter(max, "day"));
        },
        [min, max]
    );

    /**
     * Checks if a day is within a specific date range (from and to)
     * @param day - The day to check
     * @param dateRange - The date range object with from and to properties
     * @returns True if the day is within the date range, false otherwise
     */
    const isDayWithinDateRange = useCallback((day: Dayjs): boolean => {
        if (selectedDate && "from" in selectedDate && "to" in selectedDate) {
            return day.isBetween(
                selectedDate.from,
                selectedDate.to,
                "day",
                "[]"
            );
        }
        return false;
    }, []);

    /**
     * Navigates to a specific month
     * @param dayOrMonthIndex - Either a Dayjs object or a month index (0-11)
     */
    const goToMonth = useCallback(
        (dayOrMonthIndex: Dayjs | number) => {
            if (typeof dayOrMonthIndex === "number") {
                const { monthIndex, year } = normalizeMonthYear(
                    dayOrMonthIndex,
                    calendarState.activeYear
                );

                setCalendarState((prev) => ({
                    ...prev,
                    activeMonth: getMonth(monthIndex, year),
                    activeMonthIndex: monthIndex,
                    activeYear: year,
                }));

                return;
            }

            const month = dayOrMonthIndex.month();
            const year = dayOrMonthIndex.year();

            setCalendarState((prev) => ({
                ...prev,
                activeMonth: getMonth(month, year),
                activeMonthIndex: month,
                activeYear: year,
            }));
        },
        [calendarState.activeYear, getMonth]
    );

    /**
     * Handles day click events and updates the selected date(s) accordingly
     * @param day - The day that was clicked
     */
    const handleDayClick = useCallback(
        (day: Dayjs) => {
            // Skip if day is outside allowed range
            if (!isDayWithinAllowedRange(day)) {
                return;
            }

            if (
                selectedDate &&
                typeof selectedDate === "object" &&
                "from" in selectedDate
            ) {
                let updatedDateRange: DateRange;
                if (day.isBefore(selectedDate.from)) {
                    updatedDateRange = {
                        ...selectedDate,
                        from: day,
                    };
                } else {
                    updatedDateRange = {
                        ...selectedDate,
                        to: day,
                    };
                }
                updateSelectedDate(
                    updatedDateRange as CalendarResult<ExtractMode<T>>
                );
            } else if (mode === "range" && !selectedDate) {
                // Initialize a new date range when none exists
                const dateRange: DateRange = {
                    from: day,
                    to: day,
                };
                updateSelectedDate(dateRange as CalendarResult<ExtractMode<T>>);
            } else if (mode === "multiple" && Array.isArray(selectedDate)) {
                let updatedDays: Dayjs[];
                if (isDaySelected(day)) {
                    updatedDays = selectedDate.filter(
                        (_day) => !_day.isSame(day, "day")
                    );
                } else {
                    updatedDays = [...selectedDate, day];
                }
                updateSelectedDate(
                    updatedDays as CalendarResult<ExtractMode<T>>
                );
            } else {
                updateSelectedDate(day as CalendarResult<ExtractMode<T>>);
            }
        },
        [
            isDayWithinAllowedRange,
            isDaySelected,
            mode,
            selectedDate,
            updateSelectedDate,
        ]
    );

    // =========================================================================
    // Focus management and keyboard navigation
    // =========================================================================

    /**
     * Handles when a day element receives focus
     * @param day - The day that received focus
     */
    const handleDayFocus = (day: Dayjs) => {
        setFocusedDate(day);
        setIsNavigatingDays(true);
    };

    /**
     * Handles when a day element loses focus
     * @param e - The blur event
     */
    const handleDayBlur = (e: FocusEvent<HTMLElement>) => {
        // If focus is moving outside the grid entirely
        if (!monthGridRef.current?.contains(e.relatedTarget as Node)) {
            setIsNavigatingDays(false);
        }
    };

    /**
     * Gets the initial date to focus when starting keyboard navigation
     * @returns The date to initially focus
     */
    const getInitialFocusableDate = (): Dayjs => {
        if (!selectedDate) {
            // Default to today if no selection
            return dayjs();
        }

        if (Array.isArray(selectedDate) && selectedDate.length > 0) {
            return selectedDate[0];
        } else if (typeof selectedDate === "object" && "from" in selectedDate) {
            return selectedDate.from;
        } else if (!Array.isArray(selectedDate)) {
            return selectedDate;
        }

        // Default to today if no selection
        return dayjs();
    };

    /**
     * Updates the focused date and changes the displayed month if necessary
     * @param day - The day to focus
     */
    const updateFocusDate = useCallback(
        (day: Dayjs) => {
            // Don't allow focusing on dates outside the allowed range
            if (!isDayWithinAllowedRange(day)) {
                return;
            }

            setFocusedDate(day);
            if (!isDayWithinDisplayedMonth(day)) {
                goToMonth(day);
            }
        },
        [isDayWithinAllowedRange, isDayWithinDisplayedMonth, goToMonth]
    );

    /**
     * Focus the day element when the grid is focused and a date is selected
     */
    useEffect(() => {
        if (isMonthGridFocused && focusedDate) {
            const dayElement = document.getElementById(
                generateDateId(focusedDate)
            );
            dayElement?.focus();
        }
    }, [isMonthGridFocused, focusedDate]);

    /**
     * Handles when the month grid container receives focus
     */
    const handleGridFocus = () => {
        setIsMonthGridFocused(true);
    };

    const isDayToday = useCallback((day: Dayjs) => {
        return dayjs().isSame(day, "day");
    }, []);

    /**
     * Handles when the month grid container loses focus
     * @param e - The blur event
     */
    const handleGridBlur = (e: FocusEvent<HTMLDivElement>) => {
        // Only set the grid as unfocused if focus moved outside the grid
        // This prevents losing focus state when clicking on a date within the grid
        if (!monthGridRef.current?.contains(e.relatedTarget as Node)) {
            setIsMonthGridFocused(false);
        }
    };

    /**
     * Handles keyboard navigation within the month grid
     * @param e - The keyboard event
     */
    const handleGridKeyDown = useCallback(
        (e: KeyboardEvent<HTMLDivElement>) => {
            // Only handle a Tab key specially when we aren't already navigating days
            if (e.key === "Tab") {
                if (!e.shiftKey && !isNavigatingDays) {
                    e.preventDefault();

                    // Start navigating days within the grid
                    setIsNavigatingDays(true);

                    // Focus the initial focusable date
                    const dateToFocus = getInitialFocusableDate();
                    setFocusedDate(dateToFocus);
                }
                // Allow Tab and Shift+Tab to behave normally in all other cases
                // This ensures users can tab out of the calendar
                return;
            }

            if (VALID_KEYS.has(e.key)) {
                e.preventDefault();
                e.stopPropagation();

                switch (e.key) {
                    case ARROW_UP:
                        updateFocusDate(focusedDate.subtract(7, "day"));
                        break;
                    case ARROW_DOWN:
                        updateFocusDate(focusedDate.add(7, "day"));
                        break;
                    case ARROW_LEFT:
                        updateFocusDate(focusedDate.subtract(1, "day"));
                        break;
                    case ARROW_RIGHT:
                        updateFocusDate(focusedDate.add(1, "day"));
                        break;
                    case HOME:
                        updateFocusDate(focusedDate.startOf("week"));
                        break;
                    case END:
                        updateFocusDate(focusedDate.endOf("week"));
                        break;
                    case PAGE_UP:
                        updateFocusDate(focusedDate.subtract(1, "month"));
                        break;
                    case PAGE_DOWN:
                        updateFocusDate(focusedDate.add(1, "month"));
                        break;
                    case ENTER:
                    case SPACE:
                        handleDayClick(focusedDate);
                        break;
                }
            }
        },
        [
            focusedDate,
            getInitialFocusableDate,
            handleDayClick,
            isNavigatingDays,
            setFocusedDate,
            setIsNavigatingDays,
            updateFocusDate,
        ]
    );

    // =========================================================================
    // Accessibility and props generation
    // =========================================================================

    /**
     * Generates props for the month grid container element
     * @param props - Additional HTML attributes to include
     * @returns HTML attributes for the month grid container element
     */
    const getMonthGridContainerProps = useCallback(
        (
            props?: HTMLAttributes<HTMLElement>
        ): HTMLAttributesWithRef<HTMLElement> => {
            return {
                ...props,
                "aria-description": `Calendar for ${dayjs(new Date(calendarState.activeYear, calendarState.activeMonthIndex)).format("MMMM YYYY")}`,
                "aria-label": "Calendar month grid",
                onBlur: handleGridBlur,
                onFocus: handleGridFocus,
                onKeyDown: handleGridKeyDown,
                ref: monthGridRef,
                role: "grid",
                tabIndex: 0,
            };
        },
        [
            calendarState.activeYear,
            calendarState.activeMonthIndex,
            handleGridBlur,
            handleGridFocus,
            handleGridKeyDown,
            monthGridRef,
        ]
    );

    /**
     * Generates props for a day element in the calendar
     * @param day - The day to generate props for
     * @param props - Additional HTML attributes to include
     * @returns HTML attributes for the day element including accessibility attributes,
     * event handlers, and data attributes for styling based on the day's state,
     * along with the day name (e.g., "Mon", "Tue")
     */
    const getDayProps = useCallback(
        (
            day: Dayjs,
            props?: ComponentPropsWithoutRef<"button">
        ): ComponentPropsWithoutRef<"button"> => {
            const isFocused = focusedDate && day.isSame(focusedDate, "day");
            const isWithinRange = isDayWithinAllowedRange(day);

            return {
                ...props,
                "aria-disabled": !isWithinRange,
                "aria-label": day.format("dddd, MMMM D, YYYY"),
                "aria-selected": isDaySelected(day),
                disabled: props?.disabled || !isWithinRange,
                id: generateDateId(day),
                onBlur: handleDayBlur,
                onClick: (e) => {
                    if (isWithinRange) {
                        handleDayClick(day);
                        handleDayFocus(day);
                        props?.onClick?.(e);
                    }
                },
                onFocus: () => handleDayFocus(day),
                // Make only the focused day tabbable, or none if we're not navigating days
                onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => {
                    if (SELECT_DATE_KEY.includes(e.key) && isWithinRange) {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDayClick(day);
                        props?.onKeyDown?.(e);
                    }
                },
                role: "gridcell",
                // Add data attribute for styling disabled days
                tabIndex: isNavigatingDays && isFocused ? 0 : -1,
            };
        },
        [
            focusedDate,
            isDayWithinAllowedRange,
            isDaySelected,
            handleDayBlur,
            handleDayClick,
            handleDayFocus,
            isNavigatingDays,
        ]
    );

    // =========================================================================
    // Additional accessibility props
    // =========================================================================

    /**
     * Generates props for the calendar header
     * @param props - Additional HTML attributes to include
     * @returns HTML attributes for the calendar header element
     */
    const getHeaderProps = useCallback(
        (props?: HTMLAttributes<HTMLElement>): HTMLAttributes<HTMLElement> => {
            return {
                ...props,
                "aria-label": "Calendar header",
                "aria-level": 2,
                role: "heading",
            };
        },
        []
    );

    const goToNextMonth = useCallback(() => {
        const { monthIndex, year } = normalizeMonthYear(
            calendarState.activeMonthIndex + 1,
            calendarState.activeYear
        );

        goToMonth(dayjs(new Date(year, monthIndex, 1)));
    }, [calendarState.activeMonthIndex, calendarState.activeYear, goToMonth]);

    const goToPreviousMonth = useCallback(() => {
        const { monthIndex, year } = normalizeMonthYear(
            calendarState.activeMonthIndex - 1,
            calendarState.activeYear
        );

        goToMonth(dayjs(new Date(year, monthIndex, 1)));
    }, [calendarState.activeMonthIndex, calendarState.activeYear, goToMonth]);

    const goToNextYear = useCallback(() => {
        const nextYear = calendarState.activeYear + 1;
        goToMonth(dayjs(new Date(nextYear, calendarState.activeMonthIndex, 1)));
    }, [calendarState.activeYear, calendarState.activeMonthIndex, goToMonth]);

    const goToPreviousYear = useCallback(() => {
        const prevYear = calendarState.activeYear - 1;
        goToMonth(dayjs(new Date(prevYear, calendarState.activeMonthIndex, 1)));
    }, [calendarState.activeYear, calendarState.activeMonthIndex, goToMonth]);

    const setActiveYear = useCallback(
        (year: number) => {
            setCalendarState((prev) => ({
                ...prev,
                activeYear: year,
            }));
        },
        [calendarState.activeYear]
    );

    /**
     * Generates props for the previous month button
     * @param props - Additional HTML attributes to include
     * @returns HTML attributes for the previous month button element
     */
    const getPreviousMonthButtonProps = useCallback(
        (
            props?: ComponentPropsWithoutRef<"button">
        ): ComponentPropsWithoutRef<"button"> => {
            const prevMonth = dayjs(
                new Date(
                    calendarState.activeYear,
                    calendarState.activeMonthIndex - 1
                )
            );
            const isDisabled = min ? prevMonth.isBefore(min, "month") : false;

            return {
                ...props,
                "aria-disabled": isDisabled,
                "aria-label": `Go to previous month, ${prevMonth.format("MMMM YYYY")}`,
                disabled: isDisabled,
                onClick: () => {
                    if (!isDisabled) {
                        goToPreviousMonth();
                    }
                },
                onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
                    if (SELECT_DATE_KEY.includes(e.key) && !isDisabled) {
                        e.preventDefault();
                        e.stopPropagation();
                        goToPreviousMonth();
                    }
                },
                role: "button",
                tabIndex: 0,
            };
        },
        [
            calendarState.activeMonthIndex,
            calendarState.activeYear,
            goToMonth,
            min,
        ]
    );

    /**
     * Generates props for the next month button
     * @param props - Additional HTML attributes to include
     * @returns HTML attributes for the next month button element
     */
    const getNextMonthButtonProps = useCallback(
        (
            props?: ComponentPropsWithoutRef<"button">
        ): ComponentPropsWithoutRef<"button"> => {
            const nextMonth = dayjs(
                new Date(
                    calendarState.activeYear,
                    calendarState.activeMonthIndex + 1
                )
            );
            const isDisabled = max ? nextMonth.isAfter(max, "month") : false;

            return {
                ...props,
                "aria-disabled": isDisabled,
                "aria-label": `Go to next month, ${nextMonth.format("MMMM YYYY")}`,
                disabled: isDisabled,
                onClick: () => {
                    if (!isDisabled) {
                        goToNextMonth();
                    }
                },
                onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
                    if (SELECT_DATE_KEY.includes(e.key) && !isDisabled) {
                        e.preventDefault();
                        e.stopPropagation();
                        goToNextMonth();
                    }
                },
                role: "button",
                tabIndex: 0,
            };
        },
        [
            calendarState.activeMonthIndex,
            calendarState.activeYear,
            goToMonth,
            max,
        ]
    );

    /**
     * Generates props for the calendar footer
     * @param props - Additional HTML attributes to include
     * @returns HTML attributes for the calendar footer element
     */
    const getFooterProps = useCallback(
        (props?: HTMLAttributes<HTMLElement>): HTMLAttributes<HTMLElement> => {
            return {
                ...props,
                "aria-label": "Calendar footer",
                role: "contentinfo",
            };
        },
        []
    );

    // =========================================================================
    // Return hook API
    // =========================================================================

    return {
        ...calendarState,
        dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        getDayProps,
        getFooterProps,
        getHeaderProps,
        getMonthGridContainerProps,
        getNextMonthButtonProps,
        getPreviousMonthButtonProps,
        goToMonth,
        goToNextMonth,
        goToNextYear,
        goToPreviousMonth,
        goToPreviousYear,
        handleDayClick,
        isDaySelected,
        isDayToday,
        isDayWithinActiveMonth,
        isDayWithinAllowedRange,
        isDayWithinDateRange,
        max: max ? dayjs(max) : undefined,
        min: min ? dayjs(min) : undefined,
        mode,
        selectedDate,
        setActiveYear,
        setSelectedDate,
    };
};
