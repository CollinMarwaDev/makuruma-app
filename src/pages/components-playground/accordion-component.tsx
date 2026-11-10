import { Accordion } from "~/global/components/accordation";
import { ComponentCard } from "~/global/components/component-card";
import { ComponentPlaygroupGrid } from "~/pages/components-playground/component-playgroup-grid";
import AccordionCard from "~/global/components/accordion-card";

export const AccordionComponent = () => {
    return (
        <ComponentCard title="Accordation component">
            <ComponentPlaygroupGrid>
                <Accordion type="multiple" className="space-y-6">
                    <Accordion.Item value="3">
                        <Accordion.Trigger>Default Accordion</Accordion.Trigger>
                        <Accordion.Content className="bg-primary-shades-50 h-20">
                            Content Here
                        </Accordion.Content>
                    </Accordion.Item>
                </Accordion>

                <AccordionCard
                    label={"Accordion Card"}
                    title={"Toggle Accordion"}
                >
                    Content Here
                </AccordionCard>
            </ComponentPlaygroupGrid>
        </ComponentCard>
    );
};
