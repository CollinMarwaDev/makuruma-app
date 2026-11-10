import { UserIcon } from "@heroicons/react/24/solid";
import { Card } from "~/global/components/card";
import { ComponentCard } from "~/global/components/component-card";
import { Timeline } from "~/global/components/timeline";

const TimelineComponent = () => {
    return (
        <ComponentCard title="Timeline component">
            <Timeline>
                {[...Array(3).keys()].map((number, index) => (
                    <Timeline.Item key={number}>
                        <Timeline.Separator>
                            <Timeline.Circler Icon={UserIcon} />
                            <Timeline.Connector
                                className={"text-red-400"}
                                isLast={index === 2}
                            />
                        </Timeline.Separator>

                        <Timeline.Content>
                            <Card as={"div"} className="text-xs font-medium">
                                Hello World
                            </Card>
                        </Timeline.Content>
                    </Timeline.Item>
                ))}
            </Timeline>
        </ComponentCard>
    );
};
export default TimelineComponent;
