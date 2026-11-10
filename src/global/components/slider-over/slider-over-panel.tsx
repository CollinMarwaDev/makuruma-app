import { XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog } from "radix-ui";
import type { FC, ReactNode } from "react";
import { ButtonIcon } from "~/global/components/button";
import type { DialogSize } from "~/global/types";
import { cn } from "~/global/utils/cn";

interface SlideOverPanelProps {
    children: ReactNode;
    className?: string;
    size?: DialogSize;
}

export const SliderOverPanel: FC<SlideOverPanelProps> = ({
    children,
    className,
    size = "sm",
}) => {
    return (
        <div
            className={cn(
                "bg-surface-container border-surface-container relative flex h-full flex-col rounded-xl border-4",
                { "w-[35rem]": size === "3xl" },
                { "w-[34rem]": size === "2xl" },
                { "w-[33rem]": size === "xl" },
                { "w-[32rem]": size === "lg" },
                { "w-[31rem]": size === "md" },
                { "w-[30rem]": size === "sm" },
                className
            )}
        >
            <Dialog.Close asChild className={"relative z-50"}>
                <ButtonIcon
                    icon={XMarkIcon}
                    title={"Close Slide Over"}
                    className="text-primary-shades-900 bg-surface-container absolute top-6 right-6 z-10 size-8 rounded-full p-1"
                />
            </Dialog.Close>
            {children}
        </div>
    );
};
