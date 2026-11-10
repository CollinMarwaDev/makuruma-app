import { UserIcon } from "@heroicons/react/24/solid";
import { AvatarCard } from "~/global/components/avatar/avatar-card";
import { Avatar } from "~/global/components/avatar/avatar-primitive";
import { ComponentCard } from "~/global/components/component-card";

const AvatarComponent = () => {
    return (
        <ComponentCard
            title="Avatar component"
            innerWrapperClassName="flex items-center gap-5 divide-x divide-primary-100"
        >
            <Avatar className="mr-3">
                <Avatar.Icon icon={UserIcon} />
            </Avatar>

            <Avatar className="mr-3">
                <Avatar.Fallback>BK</Avatar.Fallback>
            </Avatar>

            <Avatar className="mr-3">
                <Avatar.Image src="https://i.pravatar.cc/100" />
            </Avatar>

            <Avatar active>
                <Avatar.Image src="https://i.pravatar.cc/100" />
            </Avatar>

            <AvatarCard className="pr-3">
                <AvatarCard.Image
                    active
                    src={"https://i.pravatar.cc/100"}
                    alt={""}
                />
                <AvatarCard.Content
                    title="Rosemary Mlyapatali"
                    subtitle="Direct Sales Staff"
                />
            </AvatarCard>

            <AvatarCard.Content
                title="Same Boys 2012"
                titleClassName="font-medium"
                subtitle="26 members"
            />
        </ComponentCard>
    );
};
export default AvatarComponent;
