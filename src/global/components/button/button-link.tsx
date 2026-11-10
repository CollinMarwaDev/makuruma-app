import { useNavigationState } from "~/global/utils/r3/hooks";
import { forwardRef, Fragment } from "react";
import { Link, type LinkProps, useResolvedPath } from "react-router-dom";
import {
    generateButtonClasses,
    type GenerateButtonClasses,
} from "~/global/components/button/common";
import { LoadingCircle } from "~/global/components/icons";
import { cn } from "~/global/utils/cn";

interface ButtonLink extends LinkProps, GenerateButtonClasses {
    outline?: boolean;
    loading?: boolean;
    loadingText?: string;
}

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLink>(
    (props, ref) => {
        const { children, loading, to, loadingText, ...rest } = props;

        const { isLoading, headingLocation } = useNavigationState();
        const { pathname } = useResolvedPath(to);

        const isNavigating = isLoading && headingLocation === pathname;

        const buttonLinkClassName = generateButtonClasses({
            ...props,
            loading: isNavigating || loading,
        });

        return (
            <Link
                to={to}
                ref={ref}
                {...rest}
                className={cn("center gap-2", buttonLinkClassName)}
            >
                {loading || isNavigating ? (
                    <Fragment>
                        <LoadingCircle className={"size-4"} />

                        <span
                            className={"pl-1 tracking-wide whitespace-nowrap"}
                        >
                            {loadingText ?? "Please wait..."}
                        </span>
                    </Fragment>
                ) : (
                    children
                )}
            </Link>
        );
    }
);

ButtonLink.displayName = "ButtonLink";
