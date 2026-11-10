import type { FC } from "react";
import type { IconProps } from "~/global/types";

export const ExportIcon: FC<IconProps> = ({ className, strokeWidth = 1.5 }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="20"
            viewBox="0 0 16 20"
            fill="none"
            className={className}
        >
            <path
                d="M8.41663 1.66675H8.6439C11.3616 1.66675 12.7204 1.66675 13.6641 2.33161C13.9344 2.5221 14.1745 2.74802 14.3769 3.00249C15.0833 3.89064 15.0833 5.16955 15.0833 7.72735V9.84857C15.0833 12.3179 15.0833 13.5525 14.6925 14.5386C14.0643 16.1239 12.7357 17.3743 11.0513 17.9656C10.0036 18.3334 8.69178 18.3334 6.06814 18.3334C4.56892 18.3334 3.81931 18.3334 3.22061 18.1232C2.25812 17.7854 1.49892 17.0708 1.13993 16.165C0.916626 15.6015 0.916626 14.896 0.916626 13.4849V10.0001"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M15.0833 10C15.0833 11.5341 13.8397 12.7778 12.3056 12.7778C11.7507 12.7778 11.0966 12.6806 10.5572 12.8251C10.0779 12.9535 9.70353 13.3279 9.5751 13.8072C9.43056 14.3466 9.52778 15.0007 9.52778 15.5556C9.52778 17.0897 8.28412 18.3333 6.75 18.3333"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M1.75 6.25016C2.15961 6.67158 3.24981 8.3335 3.83333 8.3335M5.91667 6.25016C5.50706 6.67158 4.41686 8.3335 3.83333 8.3335M3.83333 8.3335L3.83333 1.66683"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};
