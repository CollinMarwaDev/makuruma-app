import { cn } from "~/global/utils/cn";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import type { FC } from "react";
import { Hide } from "~/global/components/hide";

export const ModalFormError: FC<{ className?: string; message?: string }> = ({
    className,
    message,
}) => {
    const resolvedMessage = message;

    return (
        <Hide condition={!resolvedMessage}>
            <div
                className={cn(
                    "center text-danger bg-danger/25 border-status-red-pc bg-status-red-bg mt-3 gap-2 rounded-3xl border p-2 pl-3",
                    className
                )}
            >
                <ExclamationTriangleIcon
                    strokeWidth={2}
                    className={"mt-0.5 size-4 shrink-0"}
                />
                <p className={"text-sm/none"}>{resolvedMessage}</p>
            </div>
        </Hide>
    );
};
