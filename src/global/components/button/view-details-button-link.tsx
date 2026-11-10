import { EyeIcon } from "@heroicons/react/24/outline";
import type { FC } from "react";
import type { To } from "react-router-dom";
import { ButtonLink } from "~/global/components/button/button-link";
import { cn } from "~/global/utils/cn";

/**
 * A button component that links to a details view, styled with an eye icon
 * @component
 *  View details button that navigates to the specified route
 * @example
 * <ViewDetailsButtonLink to="/products/123" />
 */

interface ViewDetailsButtonLinkProps {
    className?: string;
    title?: string;
    to: To;
}

export const ViewDetailsButtonLink: FC<ViewDetailsButtonLinkProps> = ({
    className,
    title,
    to,
}) => {
    return (
        <ButtonLink
            loadingText="Wait"
            variant={"outline"}
            to={to}
            className={cn(
                "flex w-fit items-center gap-1.5 p-1.5 px-3 text-xs",
                className
            )}
        >
            <EyeIcon className="size-4" />
            <span>{title ? title : "View"}</span>
        </ButtonLink>
    );
};
