import { ComponentCard } from "~/global/components/component-card";
import { ParagraphLoading } from "~/global/components/loaders/paragraph-loader";
import { SkeletonLoader } from "~/global/components/loaders/skeleton-loader";
import { ComponentPlaygroupGrid } from "~/pages/components-playground/component-playgroup-grid";

const SkeletonLoaderComponent = () => {
    return (
        <ComponentCard title="Skeleton component">
            <ComponentPlaygroupGrid>
                {/* Basic paragraph loading example */}
                <ParagraphLoading />

                {/* Avatar with text loading example */}
                <div className="flex items-center gap-3">
                    <SkeletonLoader className="size-10 rounded-full" />

                    <div className="flex flex-1 items-center gap-3">
                        <SkeletonLoader className="size-7 rounded-full" />
                        <div className="w-32 space-y-1">
                            <SkeletonLoader className="rounded-full py-1.5" />
                            <SkeletonLoader className="rounded-full py-1" />
                        </div>
                    </div>
                </div>
                {/* Card loading example */}
                <div className="rounded-lg border border-gray-200 p-4 shadow-sm">
                    <SkeletonLoader className="h-40 w-full rounded-md" />
                    <div className="mt-4 space-y-2">
                        <SkeletonLoader className="h-6 w-3/4" />
                        <SkeletonLoader className="h-4 w-full" />
                        <SkeletonLoader className="h-4 w-full" />
                        <SkeletonLoader className="h-4 w-2/3" />
                    </div>
                    <div className="mt-6 flex justify-between">
                        <SkeletonLoader className="h-8 w-24 rounded-md" />
                        <SkeletonLoader className="h-8 w-24 rounded-md" />
                    </div>
                </div>

                {/* List loading example */}
                <div className="space-y-3">
                    {[...Array(4)].map((_, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <SkeletonLoader className="size-8 rounded-md" />
                            <div className="flex-1">
                                <SkeletonLoader className="h-4 w-full" />
                                <SkeletonLoader className="mt-1 h-3 w-4/5" />
                            </div>
                            <SkeletonLoader className="h-6 w-16 rounded-md" />
                        </div>
                    ))}
                </div>

                {/* Form loading example */}
                <div className="space-y-4">
                    <div>
                        <SkeletonLoader className="mb-1 h-4 w-24" />
                        <SkeletonLoader className="h-10 w-full rounded-md" />
                    </div>
                    <div>
                        <SkeletonLoader className="mb-1 h-4 w-32" />
                        <SkeletonLoader className="h-10 w-full rounded-md" />
                    </div>
                    <div>
                        <SkeletonLoader className="mb-1 h-4 w-28" />
                        <SkeletonLoader className="h-24 w-full rounded-md" />
                    </div>
                    <SkeletonLoader className="h-10 w-32 rounded-md" />
                </div>

                {/* Table loading example */}
                <div className="overflow-hidden rounded-lg border border-gray-200">
                    <div className="grid grid-cols-4 gap-4 border-b border-gray-200 bg-gray-50 p-3">
                        <SkeletonLoader className="h-4 w-3/4" />
                        <SkeletonLoader className="h-4 w-1/2" />
                        <SkeletonLoader className="h-4 w-2/3" />
                        <SkeletonLoader className="h-4 w-1/3" />
                    </div>
                    {[...Array(3)].map((_, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-4 gap-4 border-b border-gray-200 p-3 last:border-0"
                        >
                            <SkeletonLoader className="h-4 w-4/5" />
                            <SkeletonLoader className="h-4 w-2/3" />
                            <SkeletonLoader className="h-4 w-3/4" />
                            <SkeletonLoader className="h-4 w-1/2" />
                        </div>
                    ))}
                </div>
            </ComponentPlaygroupGrid>
        </ComponentCard>
    );
};
export default SkeletonLoaderComponent;
