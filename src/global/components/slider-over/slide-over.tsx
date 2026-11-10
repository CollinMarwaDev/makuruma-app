import SlideOverActions from "~/global/components/slider-over/slide-over-actions";
import { SliderOverContent } from "~/global/components/slider-over/slider-over-contents";
import { SlideOverFooter } from "~/global/components/slider-over/slider-over-footer";
import { SliderOverHeader } from "~/global/components/slider-over/slider-over-header";
import { SliderOverPanel } from "~/global/components/slider-over/slider-over-panel";
import { DialogContext } from "~/global/providers/dialog-provider";
import type { Dispatch, ReactNode } from "react";
import { Dialog } from "radix-ui";
import { cn } from "~/global/utils/cn";

interface SlideOverProps {
    children: ReactNode;
    onClose: Dispatch<boolean>;
    open: boolean;
}

export const SlideOver = ({ onClose, open, children }: SlideOverProps) => {
    return (
        <DialogContext value={{ onClose, open }}>
            <Dialog.Root open={open} onOpenChange={onClose}>
                <Dialog.Portal>
                    <Dialog.Overlay
                        className={cn(
                            "from-secondary-950/80 fixed inset-0 top-0 z-30 bg-gradient-to-t",
                            "to-gray-900/50 backdrop-blur-[2px] transition-opacity",

                            "data-[state=open]:animate-in duration-200",
                            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
                            "data-[state=open]:fade-in-0"
                        )}
                    />

                    <Dialog.Content
                        className={cn(
                            "fixed top-0 right-0 z-35 h-full p-5 focus:ring-0",
                            "transition-transform duration-300 ease-in-out",
                            "data-[state=open]:animate-in data-[state=closed]:animate-out",
                            "data-[state=open]:slide-in-from-right-full data-[state=closed]:slide-out-to-right-full",
                            "data-[state=open]:duration-300"
                        )}
                    >
                        {children}
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </DialogContext>
    );
};

SlideOver.Panel = SliderOverPanel;
SlideOver.Header = SliderOverHeader;
SlideOver.Actions = SlideOverActions;
SlideOver.Content = SliderOverContent;
SlideOver.Footer = SlideOverFooter;
