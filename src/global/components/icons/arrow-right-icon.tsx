import type { FC } from "react";
import type { IconProps } from "~/global/types";

export const ArrowRightIcon: FC<IconProps> = ({
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
                d="M4.16663 9.99984H15.8333M15.8333 9.99984L9.99996 4.1665M15.8333 9.99984L9.99996 15.8332"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};
