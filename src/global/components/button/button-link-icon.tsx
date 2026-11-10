import { useNavigationState } from "~/global/utils/r3/hooks";
import { LinkWithQueryParams } from "~/global/components/link-with-query-params";
import type { FC } from "react";
import { useResolvedPath } from "react-router-dom";
import { ButtonIcon } from "~/global/components/button/button-icon";
import type { ButtonIconProps } from "~/global/components/button/common";
import { LoadingCircle } from "~/global/components/icons";

interface ButtonLinkIconProps extends ButtonIconProps {
    to: string;
    rel?: string;
    state?: object;
    target?: string;
    title: string;
}

export const ButtonLinkIcon: FC<ButtonLinkIconProps> = ({
    to,
    icon: Icon,
    state,
    className,
    title,
    target,
    rel,
    ...rest
}) => {
    const { isLoading, headingLocation } = useNavigationState();
    const { pathname } = useResolvedPath(to);
    const isNavigating = isLoading && headingLocation === pathname;

    return (
        <LinkWithQueryParams to={to} state={state} target={target} rel={rel}>
            <ButtonIcon
                title={title}
                className={className}
                iconClassName={"size-5 "}
                {...rest}
                icon={isNavigating ? LoadingCircle : Icon}
            />
        </LinkWithQueryParams>
    );
};
