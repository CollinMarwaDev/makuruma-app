import type { FC } from "react";
import { SkeletonLoader } from "~/global/components/loaders/skeleton-loader";

export const ParagraphLoading: FC<{ lines?: number }> = ({ lines = 3 }) => {
    return (
        <div className={"group space-y-1"}>
            {[...Array(Math.round(lines))].map((_, index) => (
                <SkeletonLoader
                    className={
                        "even:bg-primary-shades-200/80 rounded-none py-1.5 first:rounded-t"
                    }
                    key={index}
                />
            ))}
            <SkeletonLoader className={"w-1/2 py-1.5"} />
        </div>
    );
};
