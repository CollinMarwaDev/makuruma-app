import type { FC } from "react";
import type { IconProps } from "~/global/types";

export const ChevronUpDownIcon: FC<IconProps> = ({
    className,
    strokeWidth = 1.5,
}) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="14"
            viewBox="0 0 12 14"
            fill="none"
            className={className}
        >
            <path
                d="M11 5.33346L5.99996 1.16683L1 5.3335"
                stroke="currentColor"
                strokeWidth={strokeWidth}
            />
            <path
                d="M11 8.66678L5.99996 12.8334L1 8.66675"
                stroke="currentColor"
                strokeWidth={strokeWidth}
            />
        </svg>
    );
};
