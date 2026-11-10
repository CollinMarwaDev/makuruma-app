import { createContext, useContext, type Dispatch } from "react";

type DialogContextValue = { onClose: Dispatch<boolean>; open: boolean };

/** Shared by Modal and SlideOver so footers can close their parent dialog. */
export const DialogContext = createContext<DialogContextValue | null>(null);

export const useDialogContext = () => {
    const context = useContext(DialogContext);
    if (!context) throw new Error("useDialogContext must be used inside a Modal or SlideOver");
    return context;
};
