import type { FC } from "react";
import type { IconType, IconWeight } from "~/global/types";
import { cn } from "~/global/utils/cn";

interface SectionSeparatorProps {
    /** Additional class name for styling the section separator component. */
    className?: string;
    /** Text label to display before the horizontal line in the section separator. */
    title: string;
    /** Additional class name for styling the label text of section separator. */
    titleClassName?: string;
    /** Icon displayed before the title of the section separator. */
    icon: IconType;
    /** Weight used for styling the icon of the section separator. */
    iconWeight?: IconWeight;
    /** Additional class name for styling the icon of section separator. */
    iconClassName?: string;
}

/**
 * A functional React component that renders a labeled section separator,
 * consisting of a text label followed by a horizontal line. The separator
 * is customizable through props {@link SectionSeparatorProps}.
 *
 * @category component
 */
export const SectionSeparator: FC<SectionSeparatorProps> = ({
    className,
    title,
    icon: Icon,
    iconWeight = "BoldDuotone",
    titleClassName,
    iconClassName,
}) => {
    return (
        <div className={cn("center w-full gap-2", className)}>
            <Icon
                weight={iconWeight}
                className={cn("size-5 text-neutral-500", iconClassName)}
            />
            <h3 className={cn("font-semibold", titleClassName)}>{title}</h3>
            <hr className={"text-outline grow"} />
        </div>
    );
};
