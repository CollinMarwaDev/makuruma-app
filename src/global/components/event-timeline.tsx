import type { PersonType } from "~/global/utils/zod-common/id-full-name";
import { getRemainingTime } from "~/global/utils/get-remaining-time";
import type { IconType, IconWeight } from "~/global/types";
import { AvatarCard } from "~/global/components/avatar";
import { Timeline } from "~/global/components/timeline";
import { generateAvatar } from "~/global/utils/r3/utils";
import type { FC } from "react";
import { cn } from "~/global/utils/cn";

export interface EventTimelineItemProps {
    date?: string;
    icon: IconType;
    weight: IconWeight;
    iconClassName?: string;
    title: string;
    subtitle: string;
    subtitleClassName?: string;
    performedBy?: PersonType;
}

export const EventTimelineItem: FC<EventTimelineItemProps> = (event) => {
    return (
        <Timeline.Item>
            <Timeline.Separator>
                <Timeline.Circler
                    Icon={event.icon}
                    weight={event.weight}
                    iconClassName={"text-inherit"}
                    className={cn(
                        "border-transparent bg-surface-container text-neutral-500",
                        event.iconClassName
                    )}
                />
                <Timeline.Connector className={"py-3"} />
            </Timeline.Separator>

            <Timeline.Content className={"space-y-1 pt-2 text-sm"}>
                {event.performedBy && (
                    <div className="items-between">
                        <AvatarCard>
                            <AvatarCard.Image
                                containerClassName={"size-6"}
                                alt={event.performedBy.fullName}
                                src={
                                    event.performedBy.avatar ||
                                    generateAvatar(event.performedBy.fullName, {
                                        style: "initials",
                                    })
                                }
                            />
                            <AvatarCard.Content
                                title={event.performedBy.fullName}
                                titleClassName={"text-neutral-500"}
                            />
                        </AvatarCard>
                        <p className="text-xs text-neutral-500">
                            {getRemainingTime(event.date ?? "")}
                        </p>
                    </div>
                )}
                <p className="text-muted">{event.title}</p>
                <p
                    className={cn(
                        "text-xs text-neutral-500",
                        event.subtitleClassName
                    )}
                >
                    {event.subtitle}
                </p>
            </Timeline.Content>
        </Timeline.Item>
    );
};
