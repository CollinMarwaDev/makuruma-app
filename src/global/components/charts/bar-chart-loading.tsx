import { type FC } from "react";
import { Card } from "~/global/components/card";
import { SkeletonLoader } from "~/global/components/loaders/skeleton-loader";
import { cn } from "~/global/utils/cn";

const BarChartLoading: FC<{
    containerClassName?: string;
    className?: string;
}> = ({ containerClassName, className }) => {
    return (
        <Card className={cn("space-y-4", containerClassName)}>
            <div className="center justify-start gap-3">
                <SkeletonLoader className="size-7 rounded-xl" />
                <SkeletonLoader className="w-32" />
            </div>
            <div className="center justify-start gap-4">
                <div className={"space-y-2"}>
                    <SkeletonLoader className="w-32" />
                    <div className={"center gap-2"}>
                        <SkeletonLoader className="h-5 w-1 rounded" />
                        <SkeletonLoader className="w-40 py-2.5" />
                    </div>
                </div>
                <div className={"space-y-2"}>
                    <SkeletonLoader className="w-32" />
                    <div className={"center gap-2"}>
                        <SkeletonLoader className="h-5 w-1 rounded" />
                        <SkeletonLoader className="w-40 py-2.5" />
                    </div>
                </div>
            </div>
            <div className={cn("h-80 flex-1", className)}>
                <SkeletonLoader className="size-full" />
            </div>
        </Card>
    );
};

export default BarChartLoading;
