import type { FC, ReactNode } from "react";
import { cn } from "~/global/utils/cn";

export interface LabelValueListItemProps {
    /** CSS class name for custom styling */
    className?: string;
    /** Label text to display */
    label: string;
    /** Value to display below the label */
    value: ReactNode;
    /** Label text to display */
    labelClassName?: string;
    /** Value to display below the label */
    valueClassName?: ReactNode;
}

/**
 * Component that displays a label and value pair in a vertical layout
 * @category Component
 */
export const LabelValueListItem: FC<LabelValueListItemProps> = ({
    className,
    label,
    labelClassName,
    value,
    valueClassName,
}) => {
    return (
        <div className={cn("center", className)}>
            <p
                className={cn(
                    "text-neutral-550 w-40 shrink-0 text-sm",
                    labelClassName
                )}
            >
                {label}
            </p>
            {typeof value === "string" ? (
                <p
                    className={cn(
                        "text-primary-950 grow text-sm font-medium",
                        valueClassName
                    )}
                >
                    {value}
                </p>
            ) : (
                <div className={cn("grow truncate", valueClassName)}>
                    {value}
                </div>
            )}
        </div>
    );
};
