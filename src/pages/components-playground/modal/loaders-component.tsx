import { ComponentCard } from "~/global/components/component-card";
import { LoadingCircle } from "~/global/components/icons";
import { SpinLoader } from "~/global/components/loaders/spin-loader";

export const LoadersComponents = () => {
    return (
        <ComponentCard
            title="Loaders component"
            innerWrapperClassName={"flex items-center gap-5"}
        >
            <LoadingCircle />
            <SpinLoader />
        </ComponentCard>
    );
};
