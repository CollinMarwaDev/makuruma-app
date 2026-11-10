import { Badge } from "~/global/components/badge";
import { ComponentCard } from "~/global/components/component-card";

const BadgeComponent = () => {
    return (
        <ComponentCard
            title="Badge component"
            innerWrapperClassName="gap-3 flex"
        >
            <Badge label={"Badge"} />
            <Badge label={"Warning"} variant="warning" />
            <Badge label={"Danger"} variant="danger" />
            <Badge label={"Success"} variant="success" />
            <Badge label={"Disabled"} variant="disabled" />
        </ComponentCard>
    );
};
export default BadgeComponent;
