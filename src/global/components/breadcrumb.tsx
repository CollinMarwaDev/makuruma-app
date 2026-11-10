import {
    ChevronRightIcon,
    EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import type {
    ComponentProps,
    ComponentPropsWithoutRef,
    ForwardRefExoticComponent,
    HTMLAttributes,
    RefAttributes,
} from "react";
import { forwardRef } from "react";
import { Link, type LinkProps } from "react-router-dom";
import { cn } from "~/global/utils/cn";

const BreadcrumbList = forwardRef<
    HTMLOListElement,
    ComponentPropsWithoutRef<"ol">
>(({ className, ...props }, ref) => (
    <ol
        ref={ref}
        className={cn(
            "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5",
            className
        )}
        {...props}
    />
));
BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = forwardRef<
    HTMLLIElement,
    ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
    <li
        ref={ref}
        className={cn("inline-flex items-center gap-1.5", className)}
        {...props}
    />
));
BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbLink = forwardRef<HTMLAnchorElement, LinkProps>(
    ({ className, ...props }, ref) => {
        return (
            <Link
                ref={ref}
                className={cn(
                    "hover:text-foreground transition-colors",
                    className
                )}
                {...props}
            />
        );
    }
);
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbPage = forwardRef<
    HTMLSpanElement,
    ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
    <span
        ref={ref}
        role="link"
        aria-disabled="true"
        aria-current="page"
        className={cn("text-foreground font-normal", className)}
        {...props}
    />
));
BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbSeparator = ({
    children,
    className,
    ...props
}: ComponentProps<"li">) => (
    <li
        role="presentation"
        aria-hidden="true"
        className={cn("[&>svg]:h-3.5 [&>svg]:w-3.5", className)}
        {...props}
    >
        {children ?? <ChevronRightIcon />}
    </li>
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

const BreadcrumbEllipsis = ({
    className,
    ...props
}: ComponentProps<"span">) => (
    <span
        role="presentation"
        aria-hidden="true"
        className={cn("flex h-9 w-9 items-center justify-center", className)}
        {...props}
    >
        <EllipsisHorizontalIcon className="h-4 w-4" />
        <span className="sr-only">More</span>
    </span>
);
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis";

type BreadcrumbProps = HTMLAttributes<HTMLDivElement>;

interface BreadcrumbComponent
    extends ForwardRefExoticComponent<
        BreadcrumbProps & RefAttributes<HTMLDivElement>
    > {
    Ellipsis: typeof BreadcrumbEllipsis;
    Item: typeof BreadcrumbItem;
    Link: typeof BreadcrumbLink;
    List: typeof BreadcrumbList;
    Page: typeof BreadcrumbPage;
    Separator: typeof BreadcrumbSeparator;
}

export const Breadcrumb = forwardRef<HTMLDivElement, BreadcrumbProps>(
    (props, ref) => {
        return <nav ref={ref} {...props} aria-label="breadcrumb" />;
    }
) as BreadcrumbComponent;

Breadcrumb.displayName = "Breadcrumb";

Breadcrumb.Ellipsis = BreadcrumbEllipsis;
Breadcrumb.Item = BreadcrumbItem;
Breadcrumb.Link = BreadcrumbLink;
Breadcrumb.List = BreadcrumbList;
Breadcrumb.Page = BreadcrumbPage;
Breadcrumb.Separator = BreadcrumbSeparator;
