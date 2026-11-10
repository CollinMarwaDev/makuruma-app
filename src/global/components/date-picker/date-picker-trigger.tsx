import { inputClassNames } from "~/global/components/form-controls/common";
import { Calendar } from "@solar-icons/react/ssr";
import { cn } from "~/global/utils/cn";

interface DatePickerTriggerProps {
    hasError?: boolean;
    dateValue?: string;
}

export const DatePickerTrigger = ({
    dateValue,
    hasError,
}: DatePickerTriggerProps) => {
    return (
        <div
            className={cn(
                inputClassNames,
                "text-input flex items-center justify-between gap-8 text-left",
                { "input-error": hasError }
            )}
        >
            <p>{dateValue || "dd/mm/yyyy"}</p>
            <Calendar
                weight={"BoldDuotone"}
                className={"text-primary size-4.5"}
            />
        </div>
    );
};
