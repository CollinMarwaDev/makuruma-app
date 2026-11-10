import type { FC } from "react";
import type { IconProps } from "~/global/types";

export const ChevronDownIcon: FC<IconProps> = (props) => {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-1"
            {...props}
        >
            <path
                d="M15 7.50004C15 7.50004 11.3176 12.5 9.99996 12.5C8.68237 12.5 5 7.5 5 7.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};
