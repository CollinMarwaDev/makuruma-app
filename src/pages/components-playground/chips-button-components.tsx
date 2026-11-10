import { UserGroupIcon } from "@heroicons/react/24/solid";
import { ChipsButton } from "~/global/components/button";
import { ComponentCard } from "~/global/components/component-card";

export const ChipsButtonComponents = () => {
    return (
        <ComponentCard
            title="Chips buttons"
            innerWrapperClassName="flex items-center gap-1 flex-wrap"
        >
            <ChipsButton>
                <ChipsButton.Icon Icon={UserGroupIcon} />
                <ChipsButton.Label label={"bonny kato"} />
            </ChipsButton>

            <ChipsButton>
                <ChipsButton.Image
                    src={"https://i.pravatar.cc/100"}
                    fallBack={"BK"}
                    alt={""}
                />
                <ChipsButton.Label label={"bonny kato"} />
            </ChipsButton>

            <ChipsButton>
                <ChipsButton.Image src={""} fallBack={"BK"} alt={""} />
                <ChipsButton.Label label={"bonny kato"} />
            </ChipsButton>

            <ChipsButton>
                <ChipsButton.Label label={"bonny kato"} />
            </ChipsButton>
        </ComponentCard>
    );
};
