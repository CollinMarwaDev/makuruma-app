import { Component, type ErrorInfo, type FC, type ReactNode } from "react";
import { errorMap } from "~/global/components/error-boundary/error-map";
import { WarningIcon } from "~/global/components/error-boundary/icons";
import { GeneralFallbackUI } from "~/global/components/general-fallback-ui";
import { type UseFallbackUIProps } from "~/global/hooks/useFallbackUI";
import { cn } from "~/global/utils/cn";
import { isCustomErrorResponse, parseErrorResponse } from "~/global/utils/r3/utils";

interface ErrorFallbackProps {
    /** The caught error; `{ status, data }` objects map to the status-specific illustrations. */
    error: unknown;
    className?: string;
    ctaLabel?: string;
    ctaLink?: string;
}

/** Shows the illustrated fallback UI for an error (HTTP status aware). */
export const ErrorFallback: FC<ErrorFallbackProps> = ({ error, className, ...otherProps }) => {
    let fallbackUIProp: UseFallbackUIProps = { icon: WarningIcon, title: "Unexpected Error" };

    if (isCustomErrorResponse(error)) {
        const { data, status } = parseErrorResponse(error);
        fallbackUIProp = { description: data?.message, ...(errorMap[status] || fallbackUIProp) };
    } else if (error instanceof Error) {
        fallbackUIProp = { ...fallbackUIProp, description: error.message };
    }

    return (
        <GeneralFallbackUI
            {...fallbackUIProp}
            {...otherProps}
            description={fallbackUIProp.description ?? "Something went wrong. Please try again."}
            iconClassName="size-60"
            wrapperClassName={cn("bg-surface-container/30 flex-1 rounded-lg", className)}
        />
    );
};

/** Catches render errors in its subtree and shows {@link ErrorFallback}. */
export class GeneralErrorBoundary extends Component<
    { children: ReactNode; className?: string },
    { error: unknown }
> {
    state = { error: null as unknown };

    static getDerivedStateFromError(error: unknown) {
        return { error };
    }

    componentDidCatch(error: unknown, info: ErrorInfo) {
        console.error(error, info.componentStack);
    }

    render() {
        if (this.state.error) return <ErrorFallback error={this.state.error} className={this.props.className} />;
        return this.props.children;
    }
}
