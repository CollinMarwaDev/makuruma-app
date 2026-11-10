import type { FC } from "react";
import type { IconProps } from "~/global/types";

export const XWithinTriangleIcon: FC<IconProps> = ({
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
                d="M10 2L18 16H2L10 2Z"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
            <path
                d="M8 8L12 12M12 8L8 12"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};