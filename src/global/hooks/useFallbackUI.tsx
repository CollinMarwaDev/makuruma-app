import {
    getErrorMessage,
    isCustomErrorResponse,
    parseErrorResponse,
} from "~/global/utils/r3/utils";
import { memo } from "react";
import { GeneralFallbackUI } from "~/global/components/general-fallback-ui";
import type { IconType } from "~/global/types";
import { cn } from "~/global/utils/cn";

/**
 * Extracts a human-readable error message from various error types
 * @param error - The error object to process
 * @returns A string representation of the error message
 */
export const renderError = (error: unknown) => {
    if (isCustomErrorResponse(error)) {
        const parseError = parseErrorResponse(error);
        return parseError.data.message;
    }
    return getErrorMessage(error);
};

/**
 * Props for configuring the fallback UI component returned by useFallbackUI
 */
export interface UseFallbackUIProps {
    /** Label text for the call-to-action button (defaults to "Reload" if not provided) */
    ctaLabel?: string;
    /** URL to navigate to when the call-to-action button is clicked */
    ctaLink?: string;
    /** Description text explaining the error or fallback state (falls back to error message if not provided) */
    description?: string;
    /** Icon component to be displayed as the illustration */
    icon: IconType;
    /** Additional CSS classes to apply to the icon */
    iconClassName?: string;
    /** HTTP status code or custom error code to display */
    statusCode?: number;
    /** Main title text for the fallback UI */
    title: string;
}

/**
 * A hook that creates a memoized fallback UI component for error states.
 * It automatically extracts error messages from the current route error and
 * combines them with the provided configuration.
 *
 * @returns A memoized React component that renders the fallback UI
 */
export const useFallbackUI = ({
    icon,
    ctaLink,
    ctaLabel,
    description,
    iconClassName,
    statusCode,
    title,
}: UseFallbackUIProps) => {
    const message = "Something went wrong. Please try again.";

    const FallbackUIComponent = memo(
        ({ className }: { className?: string }) => (
            <GeneralFallbackUI
                icon={icon}
                iconClassName={iconClassName}
                description={description ?? message}
                statusCode={statusCode}
                title={title}
                ctaLink={ctaLink}
                ctaLabel={ctaLabel}
                wrapperClassName={cn("space-y-4", className)}
            />
        )
    );

    FallbackUIComponent.displayName = "FallbackUI";

    return FallbackUIComponent;
};
