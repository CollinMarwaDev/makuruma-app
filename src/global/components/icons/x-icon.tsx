import type { FC } from "react";
import type { IconProps } from "~/global/types";

export const XIcon: FC<IconProps> = ({
    className,
    strokeWidth = 1.67,
}) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className={className}
        >
            <path
                d="M15 5L5 15M5 5L15 15"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};