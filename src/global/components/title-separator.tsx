import { type FC } from "react";
import { cn } from "~/global/utils/cn";

type TitleSeparatorProps = {
    title: string;
    titleClassName?: string;
    wrapperClassName?: string;
};

/**
 * TitleSeparator is a functional component used to display a horizontal separator with a title.
 * It utilizes a `fieldset` and `legend` element to visually group content, styling the title
 * and the separator with customizable class names.
 *
 * Props:
 * @param {string} title - The text to be displayed as the title within the separator.
 * @param {string} titleClassName - Optional additional CSS class names for styling the title.
 * @param {string} wrapperClassName - Optional additional CSS class names for styling the separator's container.
 *
 * Returns:
 * A styled horizontal separator with a title.
 */
const TitleSeparator: FC<TitleSeparatorProps> = ({
    title,
    titleClassName,
    wrapperClassName,
}) => {
    return (
        <fieldset
            className={cn(
                "border-primary-shades-100 border-t",
                wrapperClassName
            )}
        >
            <legend className={cn("pr-4 font-semibold", titleClassName)}>
                {title}
            </legend>
        </fieldset>
    );
};

export default TitleSeparator;
