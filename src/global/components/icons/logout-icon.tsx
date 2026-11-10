import type { FC } from "react";
import type { IconProps } from "~/global/types";

export const LogoutIcon: FC<IconProps> = ({
    className,
    strokeWidth = "1.5",
}) => {
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
                d="M8 16C8 18.828 8 20.243 8.879 21.121C9.757 22 11.172 22 14 22H15C17.828 22 19.243 22 20.121 21.121C21 20.243 21 18.828 21 16V8C21 5.172 21 3.757 20.121 2.879C19.243 2 17.828 2 15 2H14C11.172 2 9.757 2 8.879 2.879C8 3.757 8 5.172 8 8"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
            />
            <path
                d="M8 19.5C5.643 19.5 4.464 19.5 3.732 18.768C3 18.035 3 16.857 3 14.5V9.5C3 7.143 3 5.964 3.732 5.232C4.464 4.5 5.643 4.5 8 4.5"
                stroke="currentColor"
                strokeWidth={strokeWidth}
            />
            <path
                d="M6 12H15M15 12L12.5 14.5M15 12L12.5 9.5"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};
