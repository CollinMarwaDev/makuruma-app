import type { FC } from "react";
import type { IconProps } from "~/global/types";

export const UserListIcon: FC<IconProps> = (props) => {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <g
                opacity="0.4"
                className={props.weight == "BoldDuotone" ? "hidden" : ""}
            >
                <path
                    d="M4.23393 12.7471C3.2187 13.3613 0.556833 14.6156 2.17809 16.1851C2.97006 16.9518 3.85211 17.5001 4.96106 17.5001H11.289C12.3979 17.5001 13.28 16.9518 14.072 16.1851C15.6932 14.6156 13.0313 13.3613 12.0161 12.7471C9.63542 11.3066 6.61462 11.3066 4.23393 12.7471Z"
                    fill="currentColor"
                />
                <path
                    d="M11.25 5.83333C11.25 7.67428 9.7576 9.16667 7.91665 9.16667C6.0757 9.16667 4.58331 7.67428 4.58331 5.83333C4.58331 3.99238 6.0757 2.5 7.91665 2.5C9.7576 2.5 11.25 3.99238 11.25 5.83333Z"
                    fill="currentColor"
                />
            </g>
            <g className={props.weight == "BoldDuotone" ? "" : "hidden"}>
                <path
                    d="M4.23393 12.7471C3.2187 13.3613 0.556833 14.6156 2.17809 16.1851C2.97006 16.9518 3.85211 17.5001 4.96106 17.5001H11.289C12.3979 17.5001 13.28 16.9518 14.072 16.1851C15.6932 14.6156 13.0313 13.3613 12.0161 12.7471C9.63542 11.3066 6.61462 11.3066 4.23393 12.7471Z"
                    stroke="currentColor"
                    strokeWidth="1.13"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M11.25 5.83333C11.25 7.67428 9.7576 9.16667 7.91665 9.16667C6.0757 9.16667 4.58331 7.67428 4.58331 5.83333C4.58331 3.99238 6.0757 2.5 7.91665 2.5C9.7576 2.5 11.25 3.99238 11.25 5.83333Z"
                    stroke="currentColor"
                    strokeWidth="1.13"
                />
            </g>
            <path
                d="M14.1667 4.16675L18.3334 4.16675"
                stroke="currentColor"
                strokeWidth="1.13"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M14.1667 6.66675L18.3334 6.66675"
                stroke="currentColor"
                strokeWidth="1.13"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M16.6667 9.16675L18.3334 9.16675"
                stroke="currentColor"
                strokeWidth="1.13"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};
