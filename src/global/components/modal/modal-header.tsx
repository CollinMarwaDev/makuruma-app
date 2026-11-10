import { Dialog } from "radix-ui";
import type { FC } from "react";
import { DialogTitle } from "~/global/components/dialog-title";
import type { IconType } from "~/global/types";
import { cn } from "~/global/utils/cn";

interface ModalHeaderProps {
    Icon: IconType;
    hideBottomBorder?: boolean;
    subtitle?: string;
    title: string;
}

export const ModalHeader: FC<ModalHeaderProps> = ({
    Icon,
    hideBottomBorder,
    subtitle,
    title,
}) => {
    return (
        <header
            className={cn(
                "relative w-full rounded-t-xl p-6 pb-3",
                "from-primary-50 bg-gradient-to-b via-transparent via-60% to-transparent"
            )}
        >
            <div className="center justify-start gap-4">
                <Icon
                    weight={"BoldDuotone"}
                    className={cn(
                        "size-12 rounded-full p-2.5 shadow-md",
                        "ring-outline/40 border-2 border-surface ring-2",
                        "text-primary bg-surface-container"
                    )}
                />
                <div>
                    <DialogTitle title={title} />
                    <Dialog.Description className="text-sm text-neutral-500">
                        {subtitle}
                    </Dialog.Description>
                </div>
            </div>

            {!hideBottomBorder && (
                <div className="bg-outline mt-4 h-[1px]"></div>
            )}
        </header>
    );
};
