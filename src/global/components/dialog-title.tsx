import { Dialog } from "radix-ui";
import type { FC } from "react";
import { cn } from "~/global/utils/cn";

interface DialogTitleProps {
    className?: string;
    title: string;
}

export const DialogTitle: FC<DialogTitleProps> = ({ className, title }) => {
    return (
        <Dialog.Title
            className={cn("text-primary-950 text-lg font-medium", className)}
        >
            {title}
        </Dialog.Title>
    );
};
