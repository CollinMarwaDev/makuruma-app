import { ComponentCard } from "~/global/components/component-card";
import { ProgressBar } from "~/global/components/progress-bar";

export const ProgressComponent = () => {
    return (
        <ComponentCard title="Progress component">
            <ProgressBar progress={50} />
        </ComponentCard>
    );
};
