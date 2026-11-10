import type { FC } from "react";
import type { IconProps } from "~/global/types";

export const TriangleTextIcon: FC<IconProps> = ({
    className,
    strokeWidth = 1.5,
}) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="19"
            viewBox="0 0 18 19"
            fill="none"
            className={className}
        >
            <path
                d="M1 9.58366C1 5.85171 1 3.98573 2.15937 2.82636C3.31874 1.66699 5.18471 1.66699 8.91667 1.66699C12.6486 1.66699 14.5146 1.66699 15.674 2.82636C16.8333 3.98573 16.8333 5.85171 16.8333 9.58366C16.8333 13.3156 16.8333 15.1816 15.674 16.341C14.5146 17.5003 12.6486 17.5003 8.91667 17.5003C5.18471 17.5003 3.31874 17.5003 2.15937 16.341C1 15.1816 1 13.3156 1 9.58366Z"
                stroke="currentColor"
                strokeWidth={strokeWidth}
            />
            <path
                d="M6.4165 9.58398L11.4166 9.58403"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M7.25 12.5H10.5833"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M5.5835 6.66699H12.2502"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};
