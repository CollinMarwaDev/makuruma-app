import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";
import { Dialog } from "radix-ui";
import type { FC } from "react";
import { Button } from "~/global/components/button";
import { cn } from "~/global/utils/cn";

export type ConfirmationType = "info" | "success" | "warning" | "error";

export interface ConfirmationOptions {
    title: string;
    description?: string;
    okayText?: string;
    cancelText?: string;
    type?: ConfirmationType;
}

const TONE: Record<ConfirmationType, { icon: typeof InformationCircleIcon; className: string }> = {
    error: { className: "bg-status-red-bg text-status-red-pc", icon: XCircleIcon },
    info: { className: "bg-primary-50 text-primary", icon: InformationCircleIcon },
    success: { className: "bg-status-green-bg text-status-green-pc", icon: CheckCircleIcon },
    warning: { className: "bg-status-yellow-bg text-status-yellow-pc", icon: ExclamationTriangleIcon },
};

interface ConfirmationModalProps extends ConfirmationOptions {
    open: boolean;
    onResolve: (confirmed: boolean) => void;
}

export const ConfirmationModal: FC<ConfirmationModalProps> = ({
    open,
    onResolve,
    title,
    description,
    okayText = "Confirm",
    cancelText = "Cancel",
    type = "info",
}) => {
    const { icon: Icon, className } = TONE[type];

    return (
        <Dialog.Root open={open} onOpenChange={(next) => !next && onResolve(false)}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px]" />
                <Dialog.Content className="bg-surface border-outline fixed top-1/2 left-1/2 z-50 w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-6 shadow-xl">
                    <div className="flex gap-4">
                        <span className={cn("grid size-11 shrink-0 place-items-center rounded-full", className)}>
                            <Icon className="size-6" />
                        </span>
                        <div className="space-y-1">
                            <Dialog.Title className="text-primary-950 text-base font-semibold">{title}</Dialog.Title>
                            <Dialog.Description className="text-sm text-neutral-500">{description}</Dialog.Description>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <Button variant="outline" onClick={() => onResolve(false)}>
                            {cancelText}
                        </Button>
                        <Button onClick={() => onResolve(true)}>{okayText}</Button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
