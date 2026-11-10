import { Link, useLocation, type LinkProps } from "react-router-dom";

/** `<Link>` that keeps the current query string. */
export const LinkWithQueryParams = ({ to, ...rest }: LinkProps) => {
    const { search } = useLocation();
    const target = typeof to === "string" && !to.includes("?") ? `${to}${search}` : to;
    return <Link to={target} {...rest} />;
};
