import type { FC } from "react";
import { Combobox } from "~/global/components/combobox/combobox";
import { SkeletonLoader } from "~/global/components/loaders/skeleton-loader";

export const ComboboxUserLoader: FC = () => {
    return (
        <Combobox.Loading>
            <div className="items-between p-2">
                <div className="flex items-center gap-2">
                    <SkeletonLoader className="size-9 rounded-full" />
                    <div className="flex flex-col gap-1">
                        <SkeletonLoader className="h-4 w-24" />
                        <SkeletonLoader className="h-3 w-32" />
                    </div>
                </div>
                <SkeletonLoader className="size-5 rounded-full" />
            </div>
        </Combobox.Loading>
    );
};
