import type { FC } from "react";
import { LoadingCircle } from "~/global/components/icons";

interface LoadingSpinnerProps {
    className?: string;
}

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({ className }) => {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <LoadingCircle className={className} />
        </div>
    );
};
