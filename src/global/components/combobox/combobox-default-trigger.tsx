import { ChevronDownIcon, UserIcon } from "@heroicons/react/24/outline";
import type { FC } from "react";
import { useComboboxContext } from "~/global/components/combobox/combobox-provider";
import { FieldContainer } from "~/global/components/form-controls/common";
import Label from "~/global/components/form-controls/label";
import { TextInputWithPrefix } from "~/global/components/form-controls/text-input-fields/text-input-with-prefix";
import type { IconType } from "~/global/types";

interface Props {
    Icon?: IconType | string;
    placeholder?: string;
    containerClassName?: string;
    label?: string;
    hasError?: boolean;
    disabled?: boolean;
}

export const ComboboxDefaultTrigger: FC<Props> = ({
    Icon = UserIcon,
    placeholder = "Select user",
    containerClassName,
    hasError,
    label,
    disabled,
}) => {
    const { selectedOptions } = useComboboxContext();

    return (
        <FieldContainer className={containerClassName}>
            {label && <Label>{label}</Label>}

            <div className={"relative"}>
                <TextInputWithPrefix
                    _prefix={Icon}
                    placeholder={placeholder}
                    hasError={hasError}
                    disabled={disabled}
                    value={
                        selectedOptions.length
                            ? selectedOptions[0]?.label
                            : undefined
                    }
                    className={
                        "z-0 border-[1px] bg-surface text-foreground shadow-none placeholder:font-normal lg:py-2.5 xl:text-[14.5px]"
                    }
                />
                <ChevronDownIcon
                    strokeWidth={2}
                    className={
                        "text-muted absolute top-0 right-2 bottom-0 my-auto size-5"
                    }
                />
            </div>
        </FieldContainer>
    );
};
