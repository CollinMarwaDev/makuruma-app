import { TrashIcon } from "@heroicons/react/24/outline";
import { ButtonLink, ButtonLinkIcon } from "~/global/components/button";
import { ComponentCard } from "~/global/components/component-card";
import { TrashBinMinimalistic } from "@solar-icons/react/ssr";

export const ButtonLinkComponents = () => {
    return (
        <ComponentCard
            title="Button link components"
            innerWrapperClassName="flex items-center flex-wrap gap-5"
        >
            <ButtonLink to={""}>Default</ButtonLink>
            <ButtonLink to={""} variant="outline">
                outline
            </ButtonLink>
            <ButtonLink to={""} variant="tonal">
                Tonal
            </ButtonLink>
            <ButtonLink to={""} loading>
                Tonal
            </ButtonLink>
            <ButtonLink to={""} variant="text">
                Text
            </ButtonLink>
            <ButtonLink to={""} variant="primaryGradient">
                Gradient
            </ButtonLink>
            <ButtonLinkIcon
                title={"Button Link Icon"}
                to={""}
                icon={TrashIcon}
            />
            <ButtonLinkIcon
                to={""}
                title={"Button Link Icon with weight"}
                icon={TrashBinMinimalistic}
                weight={"BoldDuotone"}
            />
            <ButtonLinkIcon
                loading
                to={""}
                icon={TrashIcon}
                title={"Button Link Icon loading"}
            />
        </ComponentCard>
    );
};
