import type { ComponentProps, FC, MouseEventHandler } from "react";
import Button from "~/global/components/button/button";
import { useDialogContext } from "~/global/providers/dialog-provider";
import { cn } from "~/global/utils/cn";

interface ModalFooterProps {
    saveBtnLabel?: string;
    className?: string;
    loading?: boolean;
    onCancel?: () => void;
    saveBtnType?: ComponentProps<"button">["type"];
    saveBtnClassName?: string;
    cancelBtnLabel?: string;
    disabled?: boolean;
    onSave?: () => void;
}

export const ModalFooter: FC<ModalFooterProps> = ({
    saveBtnLabel,
    saveBtnType = "submit",
    saveBtnClassName,
    className,
    loading,
    onCancel,
    cancelBtnLabel,
    disabled,
    onSave: handleSave,
}) => {
    const { onClose: setOpen } = useDialogContext();

    const handleOnClick = () => {
        if (onCancel) onCancel();
        else setOpen(false);
    };

    const handleSaveClick: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.stopPropagation();
        handleSave?.();
    };

    return (
        <footer
            className={cn(
                "grid-cols-2 grid gap-4 px-6 pt-8 pb-4",
                className
            )}
        >
            <Button
                className={
                    "text-primary-950 min-w-24 focus:ring-gray-500/60 active:ring-gray-500/60"
                }
                variant="outline"
                onClick={handleOnClick}
                type={"button"}
            >
                {cancelBtnLabel ?? "Cancel"}
            </Button>

            <Button
                type={saveBtnType}
                className={cn(
                    "min-w-24 disabled:cursor-not-allowed disabled:opacity-50",
                    saveBtnClassName
                )}
                disabled={disabled}
                loading={loading}
                onClick={handleSaveClick}
            >
                {saveBtnLabel ?? "Submit"}
            </Button>
        </footer>
    );
};
