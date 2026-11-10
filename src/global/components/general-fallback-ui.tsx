import type { FC } from "react";
import { ButtonLink } from "~/global/components/button";
import { Hide } from "~/global/components/hide";
import type { IconType } from "~/global/types";
import { cn } from "~/global/utils/cn";

/**
 * Props for the GeneralFallbackUI component
 */
interface Props {
    /** Label text for the call-to-action button (defaults to "Reload" if not provided) */
    ctaLabel?: string;
    /** URL to navigate to when the call-to-action button is clicked */
    ctaLink?: string;
    /** Description text explaining the error or fallback state */
    description: string;
    /** Icon component to be displayed as the illustration */
    icon: IconType;
    /** Additional CSS classes to apply to the illustration */
    iconClassName?: string;
    /** HTTP status code or custom error code to display */
    statusCode?: number;
    /** Main title text for the fallback UI */
    title: string;
    /** Additional CSS classes to apply to the title */
    titleClassName?: string;
    /** Additional CSS classes to apply to the wrapper div */
    wrapperClassName?: string;
}

/**
 * A reusable UI component for displaying error states, fallback content, or empty states.
 * Renders an illustration, title, description, and an optional call-to-action button.
 */
export const GeneralFallbackUI: FC<Props> = ({
    description,
    ctaLabel,
    icon: Icon,
    iconClassName,
    ctaLink,
    statusCode,
    title,
    titleClassName,
    wrapperClassName,
}) => {
    return (
        <div
            className={cn(
                "center min-h-40vh flex h-full flex-col space-y-4",
                wrapperClassName
            )}
        >
            <Icon
                className={cn("text-primary-shades-600 size-16", iconClassName)}
            />
            <div className={"text-center"}>
                {statusCode && (
                    <p className="text-primary pb-2 text-3xl font-semibold">
                        {statusCode}
                    </p>
                )}
                <h2 className={cn("pb-2 text-xl font-medium", titleClassName)}>
                    {title}
                </h2>
                <p
                    className={`text-primary-shades-600 max-w-md text-center text-sm`}
                >
                    {description}
                </p>
                <Hide condition={!ctaLink}>
                    <div className={"pt-7"}>
                        <ButtonLink variant={"tonal"} to={ctaLink!} replace>
                            {ctaLabel ?? "Reload"}
                        </ButtonLink>
                    </div>
                </Hide>
            </div>
        </div>
    );
};
