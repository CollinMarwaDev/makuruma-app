import type { FC } from "react";
import type { IconProps } from "~/global/types";
import { cn } from "~/global/utils/cn";

export const CalendarIcon: FC<IconProps> = ({
    className,
    strokeWidth = "1.5",
}) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="20"
            viewBox="0 0 18 20"
            fill="none"
            className={cn("text-[#5A6066]", className)}
        >
            <path
                opacity="0.3"
                d="M16.9166 10.6306V10.2027C16.9166 8.76154 16.9166 7.60637 16.8514 6.66667H1.14855C1.08331 7.60637 1.08331 8.76154 1.08331 10.2027V10.6306C1.08331 14.2617 1.08331 16.0773 2.12674 17.2053C3.17018 18.3333 4.84956 18.3333 8.20831 18.3333H9.79165C13.1504 18.3333 14.8298 18.3333 15.8732 17.2053C16.9166 16.0773 16.9166 14.2617 16.9166 10.6306Z"
                fill="currentColor"
            />
            <path
                d="M9.79153 2.5H8.2082C4.84944 2.5 3.17006 2.5 2.12663 3.62803C1.49733 4.30836 1.24757 5.23875 1.14844 6.66667H16.8513C16.7522 5.23875 16.5024 4.30836 15.8731 3.62803C14.8297 2.5 13.1503 2.5 9.79153 2.5Z"
                fill="currentColor"
            />
            <path
                d="M14 1.66667V3.33333M4 1.66667V3.33333"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M8.99628 10.8333H9.00376M8.99628 14.1667H9.00376M12.3259 10.8333H12.3334M5.66669 10.8333H5.67416M5.66669 14.1667H5.67416"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M1.91669 6.66667H16.0834"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M1.08331 10.2027C1.08331 6.57161 1.08331 4.75607 2.12675 3.62803C3.17018 2.5 4.84956 2.5 8.20831 2.5H9.79165C13.1504 2.5 14.8298 2.5 15.8732 3.62803C16.9166 4.75607 16.9166 6.57161 16.9166 10.2027V10.6306C16.9166 14.2617 16.9166 16.0773 15.8732 17.2053C14.8298 18.3333 13.1504 18.3333 9.79165 18.3333H8.20831C4.84956 18.3333 3.17018 18.3333 2.12675 17.2053C1.08331 16.0773 1.08331 14.2617 1.08331 10.6306V10.2027Z"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M1.5 6.66667H16.5"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};
