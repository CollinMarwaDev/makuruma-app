import type { FC } from "react";
import { Combobox } from "~/global/components/combobox/combobox";
import { SkeletonLoader } from "~/global/components/loaders/skeleton-loader";

export const ComboboxDefaultLoader: FC = () => {
    return (
        <Combobox.Loading>
            <div className="space-y-2 p-3">
                {[...Array(4)].map((_, index) => (
                    <SkeletonLoader className="py-4" key={index} />
                ))}
            </div>
        </Combobox.Loading>
    );
};
