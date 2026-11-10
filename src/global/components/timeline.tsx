import { createContext, type FC, type ReactNode, useContext } from "react";
import type { IconType, IconWeight } from "~/global/types";
import { cn } from "~/global/utils/cn";

interface TimelineBaseProps {
    className?: string;
    children?: ReactNode;
}

export const Timeline = ({ className, children }: TimelineBaseProps) => {
    return <div className={className}>{children}</div>;
};

interface TimelineItemProps extends TimelineBaseProps {
    isActive?: boolean;
    isCompleted?: boolean;
}

interface TimelineItemContextType {
    isActive?: boolean;
    isCompleted?: boolean;
}

const TimelineItemContext = createContext<TimelineItemContextType | null>(null);

export const useTimelineItemContext = () => {
    const context = useContext(TimelineItemContext);
    if (!context) {
        throw new Error(
            "useTimelineItem must be used within a TimelineProvider"
        );
    }
    return context;
};

const TimelineItem: FC<TimelineItemProps> = ({
    className,
    children,
    isActive,
    isCompleted,
}) => {
    return (
        <div className={cn("flex gap-5", className)}>
            <TimelineItemContext.Provider value={{ isActive, isCompleted }}>
                {children}
            </TimelineItemContext.Provider>
        </div>
    );
};

const TimelineSeparator: FC<TimelineBaseProps> = ({ className, children }) => {
    return (
        <div className={cn("center w-5 flex-col", className)}>{children}</div>
    );
};

interface TimelineCircleProps extends TimelineBaseProps {
    Icon?: IconType;
    weight?: IconWeight;
    iconClassName?: string;
}

const TimelineCircle: FC<TimelineCircleProps> = ({
    children,
    className,
    Icon,
    weight,
    iconClassName,
}) => {
    const { isActive, isCompleted } = useTimelineItemContext();

    return (
        <>
            {children ?? (
                <div
                    className={cn(
                        "center bg-primary-50 border-primary-shades-100 size-8 rounded-full border",
                        className,
                        { "bg-primary": isCompleted },
                        { "ring-primary ring-2": isActive }
                    )}
                >
                    {Icon && (
                        <Icon
                            weight={weight}
                            className={cn(
                                "text-primary size-4 rounded-full",
                                { "text-white": isCompleted },
                                iconClassName
                            )}
                        />
                    )}
                </div>
            )}
        </>
    );
};

interface TimelineConnectorProps extends TimelineBaseProps {
    isLast?: boolean;
}

const TimelineConnector: FC<TimelineConnectorProps> = ({
    className,
    children,
    isLast,
}) => {
    return (
        <div className={cn("center my-0.5 h-full w-5 flex-1", className)}>
            {children ?? (
                <p
                    className={cn(
                        "bg-primary-shades-100 my-0.5 h-full w-0.5 pt-0.5",
                        {
                            "pointer-events-none pt-0.5 opacity-1": isLast,
                        }
                    )}
                />
            )}
        </div>
    );
};

const TimelineContent: FC<TimelineBaseProps> = ({ className, children }) => {
    return (
        <div className={cn("-mt-1 flex-1 pb-7 text-sm", className)}>
            {children ?? <p>details goes here</p>}
        </div>
    );
};

Timeline.Separator = TimelineSeparator;
Timeline.Content = TimelineContent;
Timeline.Connector = TimelineConnector;
Timeline.Circler = TimelineCircle;
Timeline.Item = TimelineItem;
