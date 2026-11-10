import { Button } from "~/global/components/button";
import { ComponentCard } from "~/global/components/component-card";
import Popover from "~/global/components/popover";

export const PopoverComponent = () => {
    return (
        <ComponentCard title="Popover component">
            <Popover>
                <Popover.Trigger asChild>
                    <Button variant="outline">Click to Open</Button>
                </Popover.Trigger>
                <Popover.Content>Put your content here</Popover.Content>
            </Popover>
        </ComponentCard>
    );
};
