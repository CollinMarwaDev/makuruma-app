import { XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog } from "radix-ui";
import type { ComponentPropsWithoutRef, ElementType } from "react";
import { ButtonIcon } from "~/global/components/button";
import type { DialogSize } from "~/global/types";
import { cn } from "~/global/utils/cn";

type ModalPanelProps<T extends ElementType = "div"> = {
    as?: T;
    hideCloseIcon?: boolean;
    size?: DialogSize;
    top?: DialogSize;
} & ComponentPropsWithoutRef<T>;

export const ModalPanel = <T extends ElementType = "div">({
    as,
    children,
    className,
    hideCloseIcon = false,
    size = "2xl",
}: ModalPanelProps<T>) => {
    const Component = (as || "div") as ElementType;
    return (
        <Component
            className={cn(
                "border-surface-container bg-surface relative space-y-2 rounded-3xl border-4 pb-3",
                { "w-[40rem]": size === "3xl" },
                { "w-[38rem]": size === "2xl" },
                { "w-[36rem]": size === "xl" },
                { "w-[34rem]": size === "lg" },
                { "w-[32rem]": size === "md" },
                { "w-[30rem]": size === "sm" },
                className
            )}
        >
            {!hideCloseIcon && (
                <Dialog.Close asChild>
                    <ButtonIcon
                        icon={XMarkIcon}
                        title={"Close Panel"}
                        className="text-primary-shades-900 absolute top-6 right-6 z-10 size-8 rounded-full bg-surface p-1"
                    />
                </Dialog.Close>
            )}
            {children}
        </Component>
    );
};
