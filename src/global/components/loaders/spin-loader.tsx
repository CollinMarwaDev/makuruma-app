import type { FC } from "react";
import type { IconProps } from "~/global/types";
import { cn } from "~/global/utils/cn";

export const SpinLoader: FC<IconProps> = ({ className }) => {
    return (
        <svg
            className={cn("text-secondary-950", className)}
            fill="none"
            height="72"
            width="72"
            viewBox="0 0 72 72"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g className="origin-center animate-spin">
                <path
                    d="M36 3C40.3336 3 44.6248 3.85357 48.6286 5.51197C52.6323 7.17038 56.2702 9.60114 59.3345 12.6655C62.3989 15.7298 64.8296 19.3677 66.488 23.3714C68.1464 27.3752 69 31.6664 69 36C69 40.3336 68.1464 44.6248 66.488 48.6286C64.8296 52.6323 62.3989 56.2702 59.3345 59.3345C56.2702 62.3989 52.6323 64.8296 48.6286 66.488C44.6248 68.1464 40.3336 69 36 69"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                />
            </g>
            <g className="animate-spin-reverse text-primary origin-center">
                <path
                    d="M36 19.5C38.1668 19.5 40.3124 19.9268 42.3143 20.756C44.3161 21.5852 46.1351 22.8006 47.6673 24.3327C49.1994 25.8649 50.4148 27.6839 51.244 29.6857C52.0732 31.6876 52.5 33.8332 52.5 36C52.5 38.1668 52.0732 40.3124 51.244 42.3143C50.4148 44.3161 49.1994 46.1351 47.6673 47.6673C46.1351 49.1994 44.3161 50.4148 42.3143 51.244C40.3124 52.0732 38.1668 52.5 36 52.5"
                    stroke="currentColor"
                    // opacity={0.15}
                    strokeWidth="6"
                    strokeLinecap="round"
                />
            </g>
        </svg>
    );
};
