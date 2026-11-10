import {
    createContext,
    type ReactNode,
    useCallback,
    useContext,
    useEffect,
    useRef,
} from "react";

export interface ModalNestedOverlayRegistration {
    close: VoidFunction;
    isOpen: () => boolean;
}

interface ModalNestedOverlayContextValue {
    closeOpenOverlay: () => boolean;
    register: (registration: ModalNestedOverlayRegistration) => VoidFunction;
}

const ModalNestedOverlayContext = createContext<
    ModalNestedOverlayContextValue | undefined
>(undefined);

/**
 * Provides the registry used to dismiss portal-rendered nested overlays before
 * their parent modal.
 */
export const ModalNestedOverlayProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const registrations = useRef<ModalNestedOverlayRegistration[]>([]);

    const closeOpenOverlay = useCallback(() => {
        for (
            let index = registrations.current.length - 1;
            index >= 0;
            index -= 1
        ) {
            const registration = registrations.current[index];
            if (!registration.isOpen()) continue;

            registration.close();
            return true;
        }

        return false;
    }, []);

    const register = useCallback(
        (registration: ModalNestedOverlayRegistration) => {
            registrations.current.push(registration);

            return () => {
                const index = registrations.current.indexOf(registration);
                if (index !== -1) registrations.current.splice(index, 1);
            };
        },
        []
    );

    return (
        <ModalNestedOverlayContext.Provider
            value={{ closeOpenOverlay, register }}
        >
            {children}
        </ModalNestedOverlayContext.Provider>
    );
};

/** Returns the nearest modal's nested-overlay registry, or `undefined` outside a modal. */
export const useModalNestedOverlayContext = () =>
    useContext(ModalNestedOverlayContext);

/** Registers a controlled nested overlay with its nearest modal, when present. */
export const useModalNestedOverlayRegistration = (
    registration: ModalNestedOverlayRegistration
) => {
    const modalNestedOverlayContext = useModalNestedOverlayContext();
    const closeRef = useRef(registration.close);
    const isOpenRef = useRef(registration.isOpen);

    closeRef.current = registration.close;
    isOpenRef.current = registration.isOpen;

    useEffect(() => {
        if (!modalNestedOverlayContext) return;

        return modalNestedOverlayContext.register({
            close: () => closeRef.current(),
            isOpen: () => isOpenRef.current(),
        });
    }, [modalNestedOverlayContext]);
};
