import { Card } from "~/global/components/card";
import { SkeletonLoader } from "~/global/components/loaders/skeleton-loader";
import { useStableIds } from "~/global/hooks/useStableIds";

const PieChartLoading = () => {
    const stableIds = useStableIds(4);

    return (
        <Card className="col-span-1 flex flex-col justify-between space-y-4">
            <div className="center justify-start gap-3">
                <SkeletonLoader className="size-8 rounded-xl" />
                <SkeletonLoader className="w-32" />
            </div>
            <div className="items-between grow flex-col gap-10 rounded-xl p-4">
                <SkeletonLoader className="mx-auto size-[24vh] rounded-full" />
                <div className="center grow gap-8 text-gray-500">
                    {stableIds.map((stableId) => (
                        <div key={stableId} className="center flex-col gap-1">
                            <SkeletonLoader className="h-1 w-4 shrink-0 rounded-full p-0" />
                            <SkeletonLoader className="w-14 py-1.5" />
                            <SkeletonLoader className="w-6 py-2.5" />
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};

export default PieChartLoading;
