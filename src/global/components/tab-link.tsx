import { NavLink, useLocation } from "react-router-dom";
import type { IconType } from "~/global/types";
import { type FC } from "react";
import { cn } from "~/global/utils/cn";

/** Properties for each individual tab */
export interface TabLinkItemProps {
    /** Hide the tab (e.g. when the user lacks permission) */
    hidden?: boolean;
    /** Pattern tested against the current path plus query string (e.g. `/tracking?view=go`) for the active state */
    matchPattern: RegExp;
    /** Display text for the tab */
    name: string;
    /** URL/route that the tab links to */
    url: string;
    /** Icon for that tab link label */
    icon?: IconType;
    /** Optional count shown as a pill after the label; hidden when 0 or undefined */
    count?: number;
    /** Text after the count, such as "+" when more exist than were counted. */
    countSuffix?: string;
}

/** Properties for the TabLinks component */
interface TabLinksProps {
    /** CSS class name applied to container element */
    containerClassName?: string;
    /** Array of tab configurations */
    tabs: TabLinkItemProps[];
}

/**
 * Renders a horizontal tab navigation component
 * @param props - Component properties
 * @param props.tabs - Array of tab configurations
 * @param props.containerClassName - Optional CSS class for container styling
 */
export const TabLinks: FC<TabLinksProps> = ({ tabs, containerClassName }) => {
    return (
        <div
            className={cn(
                "border-outline relative z-0 flex w-full gap-2 border-b px-6",
                containerClassName
            )}
        >
            {tabs.map((tab) => (
                <TabLinkItem key={tab.name} tab={{ ...tab }} />
            ))}
        </div>
    );
};

/**
 * Individual tab link item component
 * @param props - Component properties
 * @param props.tab - Tab configuration object
 */
const TabLinkItem: FC<{ tab: TabLinkItemProps }> = ({ tab }) => {
    const { pathname, search } = useLocation();
    const isActive = tab.matchPattern.test(pathname + search);
    const Icon = tab.icon;

    if (tab.hidden) return null;

    return (
        <>
            <NavLink
                to={tab.url}
                className={({ isPending }) =>
                    cn(
                        "border-transparent bg-surface px-4 py-2 text-center text-neutral-500",
                        "text-sm font-medium whitespace-nowrap hover:bg-surface/60",
                        "relative inline-flex cursor-pointer rounded-xl border",
                        "z-10 items-center gap-2 space-x-2 bg-transparent",
                        "transition-all duration-300 ease-linear",
                        {
                            "text-primary-600 border-outline translate-y-[1px] !rounded-b-none !border-b-surface":
                                isActive,
                        },
                        { "animate-pulse bg-surface/60": isPending }
                    )
                }
            >
                {Icon && (
                    <Icon
                        weight={"BoldDuotone"}
                        className={cn("size-5 shrink-0", {
                            "text-primary-600": isActive,
                        })}
                    />
                )}
                {tab.name}
                {tab.count !== undefined && tab.count > 0 && (
                    <span className="bg-status-red-pc flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white">
                        {tab.count}
                        {tab.countSuffix}
                    </span>
                )}
            </NavLink>
        </>
    );
};
