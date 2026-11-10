import { createContext, type ReactNode, useContext } from "react";
import type {
    CalendarMode,
    CalenderProps,
    UseCalendarReturnType,
} from "~/global/hooks/useCalendar/calendar-types";
import { useCalendar } from "~/global/hooks/useCalendar/index";

const CalendarContext = createContext<
    UseCalendarReturnType<unknown> | undefined
>(undefined);

type CalendarProviderProps = {
    /** React children components */
    children: ReactNode;
} & CalenderProps;

/**
 * Provider component for Calendar functionality
 * Wraps children with calendar context to enable access to calendar state and functions
 */
export const CalendarProvider = <T extends CalendarProviderProps>({
    children,
    ...rest
}: T) => {
    const calendarProps = useCalendar(rest as CalenderProps);

    return (
        <CalendarContext.Provider value={calendarProps}>
            {children}
        </CalendarContext.Provider>
    );
};

/**
 * Custom hook to access calendar context
 * Must be used within a CalendarProvider component
 */
export const useCalendarContext = <M extends CalendarMode>() => {
    const context = useContext(CalendarContext) as UseCalendarReturnType<M>;

    if (context === undefined) {
        throw new Error(
            "useCalendarContext must be used within a CalendarProvider"
        );
    }
    return context;
};
