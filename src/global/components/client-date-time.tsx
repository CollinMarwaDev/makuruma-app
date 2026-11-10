import dayjs from "dayjs";
import {
    useEffect,
    useState,
    type ComponentPropsWithoutRef,
    type FC,
} from "react";

type ClientDateTimeFormat = "date" | "date-time" | "time";

interface ClientDateTimeProps extends ComponentPropsWithoutRef<"time"> {
    fallback?: string;
    format?: ClientDateTimeFormat;
    value?: null | string;
}

const formatPatterns: Record<ClientDateTimeFormat, string> = {
    date: "DD MMM YYYY",
    "date-time": "DD MMM YYYY - hh:mm A",
    time: "hh:mm A",
};

const formatDateTimeValue = (
    format: ClientDateTimeFormat,
    value: string
): string | undefined => {
    const parsedDate = dayjs(value);

    if (!parsedDate.isValid()) return undefined;

    return parsedDate.format(formatPatterns[format]);
};

/**
 * Formats date values after hydration so the browser timezone is used.
 */
export const ClientDateTime: FC<ClientDateTimeProps> = ({
    fallback = "N/A",
    format = "date-time",
    value,
    ...otherProps
}) => {
    const [label, setLabel] = useState(value ? "..." : fallback);

    useEffect(() => {
        setLabel(
            value ? (formatDateTimeValue(format, value) ?? fallback) : fallback
        );
    }, [fallback, format, value]);

    return (
        <time dateTime={value ?? undefined} {...otherProps}>
            {label}
        </time>
    );
};
