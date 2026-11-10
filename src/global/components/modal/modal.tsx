import { Dialog } from "radix-ui";
import { type Dispatch, type ReactNode } from "react";
import { DialogTitle } from "~/global/components/dialog-title";
import { ModalContent } from "~/global/components/modal/modal-content";
import { ModalFooter } from "~/global/components/modal/modal-footer";
import { ModalFormError } from "~/global/components/modal/modal-form-error";
import { ModalHeader } from "~/global/components/modal/modal-header";
import { ModalPanel } from "~/global/components/modal/modal-panel";
import {
    ModalNestedOverlayProvider,
    useModalNestedOverlayContext,
} from "~/global/components/modal/modal-nested-overlay-context";
import { DialogContext } from "~/global/providers/dialog-provider";
import type { DialogSize } from "~/global/types";
import { cn } from "~/global/utils/cn";

interface ModalProps extends Dialog.DialogProps {
    className?: string;
    onClose: Dispatch<boolean>;
    open: boolean;
    overlayClassName?: string;
    top?: DialogSize;
}

interface ModalDialogContentProps {
    children: ReactNode;
    className?: string;
    top: DialogSize;
}

const ModalDialogContent = ({
    children,
    className,
    top,
}: ModalDialogContentProps) => {
    const nestedOverlayContext = useModalNestedOverlayContext();
    const handleNestedOverlayDismissal = () => {
        return nestedOverlayContext?.closeOpenOverlay() ?? false;
    };

    return (
        <Dialog.Content
            className={cn(
                "fixed top-0 left-1/2 z-45 -translate-x-1/2",
                "focus:ring-0 focus:outline-none",
                { "top-[10vh] xl:top-[14vh]": top === "3xl" },
                { "top-[8vh] xl:top-[12vh]": top === "2xl" },
                { "top-[6vh] xl:top-[8vh]": top === "xl" },
                { "top-[4vh] xl:top-[6vh]": top === "lg" },
                { "top-[3vh] xl:top-[4vh]": top === "md" },
                { "top-[2vh] xl:top-[3vh]": top === "sm" },

                "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-50",
                "data-[state=open]:animate-in data-[state=closed]:animate-out",
                "data-[state=closed]:fade-out data-[state=open]:fade-in",
                "data-[state=open]:duration-300",
                "transition-all duration-200",
                className
            )}
            onEscapeKeyDown={(event) => {
                if (!handleNestedOverlayDismissal()) return;

                event.preventDefault();
            }}
            onPointerDownOutside={(event) => {
                if (!handleNestedOverlayDismissal()) return;

                event.preventDefault();
            }}
        >
            {children}
        </Dialog.Content>
    );
};

export const Modal = ({
    children,
    className,
    onClose,
    open,
    overlayClassName,
    top = "lg",
    ...otherProps
}: ModalProps) => {
    const modal = (
        <DialogContext.Provider value={{ onClose, open }}>
            <Dialog.Root {...otherProps} open={open} onOpenChange={onClose}>
                <Dialog.Portal>
                    <Dialog.Overlay
                        className={cn(
                            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
                            "z-40 to-gray-900/50 backdrop-blur-[2px] transition-opacity",
                            "from-secondary-950/80 fixed inset-0 bg-gradient-to-t",
                            "data-[state=open]:animate-in duration-200",
                            "data-[state=open]:fade-in-0",
                            overlayClassName
                        )}
                    />

                    <ModalDialogContent className={className} top={top}>
                        {children}
                    </ModalDialogContent>
                </Dialog.Portal>
            </Dialog.Root>
        </DialogContext.Provider>
    );

    return <ModalNestedOverlayProvider>{modal}</ModalNestedOverlayProvider>;
};

Modal.Header = ModalHeader;
Modal.Description = Dialog.Description;
Modal.Title = DialogTitle;
Modal.FormError = ModalFormError;
Modal.Footer = ModalFooter;
Modal.Content = ModalContent;
Modal.Panel = ModalPanel;
