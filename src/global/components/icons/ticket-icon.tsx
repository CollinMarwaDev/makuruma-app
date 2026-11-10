import type { FC } from "react";
import type { IconProps } from "~/global/types";

export const TicketIcon: FC<IconProps> = ({ className }) => {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                opacity="0.4"
                d="M2 10.5C2 7.18629 4.68629 4.5 8 4.5H16C19.3137 4.5 22 7.18629 22 10.5V11.5C20.6193 11.5 19.5 12.6193 19.5 14C19.5 15.3807 20.6193 16.5 22 16.5V17.5C22 20.8137 19.3137 23.5 16 23.5H8C4.68629 23.5 2 20.8137 2 17.5V16.5C3.38071 16.5 4.5 15.3807 4.5 14C4.5 12.6193 3.38071 11.5 2 11.5V10.5Z"
                fill="currentColor"
            />
            <path
                d="M9 14H15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
};
