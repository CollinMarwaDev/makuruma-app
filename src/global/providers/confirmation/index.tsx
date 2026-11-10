import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import {
    ConfirmationModal,
    type ConfirmationOptions,
} from "~/global/providers/confirmation/confirmation-modal";

type Confirm = (options: ConfirmationOptions) => Promise<boolean>;

const ConfirmationContext = createContext<Confirm | null>(null);

/** Promise-based confirm dialog: `if (await confirm({ title })) { ... }` */
export const ConfirmationProvider = ({ children }: { children: ReactNode }) => {
    const [options, setOptions] = useState<ConfirmationOptions | null>(null);
    const resolver = useRef<(value: boolean) => void>(undefined);

    const confirm = useCallback<Confirm>((next) => {
        setOptions(next);
        return new Promise<boolean>((resolve) => {
            resolver.current = resolve;
        });
    }, []);

    const handleResolve = (value: boolean) => {
        resolver.current?.(value);
        setOptions(null);
    };

    return (
        <ConfirmationContext.Provider value={confirm}>
            {children}
            {options && <ConfirmationModal open {...options} onResolve={handleResolve} />}
        </ConfirmationContext.Provider>
    );
};

export const useConfirmation = () => {
    const confirm = useContext(ConfirmationContext);
    if (!confirm) throw new Error("useConfirmation must be used inside <ConfirmationProvider>");
    return confirm;
};
