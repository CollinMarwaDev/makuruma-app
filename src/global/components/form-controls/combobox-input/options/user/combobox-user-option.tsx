import { CheckCircleIcon } from "@heroicons/react/24/outline";
import type { FC } from "react";
import { AvatarCard } from "~/global/components/avatar";
import type {
    ComboboxOptions,
    ComboboxUserOptionType,
} from "~/global/components/form-controls/combobox-input/combobox-types";
import { cn } from "~/global/utils/cn";

const ComboboxUserOption: FC<ComboboxOptions<ComboboxUserOptionType>> = ({
    option,
    selected,
}) => {
    return (
        <div className="items-between">
            <AvatarCard>
                <AvatarCard.Image
                    alt={option.label}
                    containerClassName="size-9"
                    fallBack={option.label}
                    src={option?.avatar ?? ""}
                />
                <AvatarCard.Content
                    title={option.label}
                    subtitle={option.email}
                />
            </AvatarCard>

            <CheckCircleIcon
                className={cn("size-5 opacity-0", { "opacity-100": selected })}
            />
        </div>
    );
};
export default ComboboxUserOption;
