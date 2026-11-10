import type { FC } from "react";
import type { IconProps } from "~/global/types";

export const SearchIcon: FC<IconProps> = ({ className, strokeWidth = 1.5 }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className={className}
        >
            <path
                d="M16.9268 17.0401L20.4 20.4001M11.4 7.2001C13.3882 7.2001 15 8.81187 15 10.8001M19.28 11.4401C19.28 15.77 15.7699 19.2801 11.44 19.2801C7.11006 19.2801 3.59998 15.77 3.59998 11.4401C3.59998 7.11018 7.11006 3.6001 11.44 3.6001C15.7699 3.6001 19.28 7.11018 19.28 11.4401Z"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
            />
        </svg>
    );
};
