import { UserIcon } from "@heroicons/react/24/outline";
import { Button, ButtonIcon } from "~/global/components/button";
import { ComponentCard } from "~/global/components/component-card";
import { UserRounded } from "@solar-icons/react/ssr";

export const ButtonComponents = () => {
    return (
        <ComponentCard
            title="Button components"
            innerWrapperClassName="flex items-center gap-5 flex-wrap"
        >
            <Button> Default</Button>
            <Button variant="outline">outline</Button>
            <Button variant="tonal">Tonal</Button>
            <Button loading variant="filled">
                Loading
            </Button>
            <Button variant="text">Text</Button>
            <Button variant="primaryGradient">Gradient</Button>
            <Button variant="accent">Accent (orange)</Button>
            <Button variant="success">Success (green)</Button>
            <Button variant="danger">Danger</Button>

            <ButtonIcon title={"Button Icon"} icon={UserIcon} />
            <ButtonIcon
                title={"Button Icon with Weight"}
                icon={UserRounded}
                weight={"BoldDuotone"}
            />
            <ButtonIcon title={"Button Icon loading"} loading icon={UserIcon} />
        </ComponentCard>
    );
};
