import Tooltip from "~/global/components/tooltip";
import { ComponentCard } from "~/global/components/component-card";
import { Button } from "~/global/components/button";

const TooltipComponent = () => {
    return (
        <ComponentCard title="Tooltip component">
            <Tooltip content={"Hovered Tooltip"}>
                <Button variant={"outline"}>Hover Me</Button>
            </Tooltip>
        </ComponentCard>
    );
};

export default TooltipComponent;
