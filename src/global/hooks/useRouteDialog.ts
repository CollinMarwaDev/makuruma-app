import { useCallback, useEffect, useState } from "react";
import {serializeQueryParams} from "~/global/utils/r3/utils";
import {useSearchParamsState} from "~/global/utils/r3/hooks";
import { useNavigate } from "react-router-dom";

/**
 * A callback function type to be executed after the modal closes.
 */
type Callback = () => void;

/**
 * Return type for the `useRouteModal` hook.
 */
type DialogState = {
    /**
     * Represents whether the modal is open or not.
     */
    open: boolean;

    /**
     * Function to close the modal.
     */
    closeDialog: () => void;
};

/**
 * Options for the `useRouteModal` hook.
 */
interface UseDialogModal {
    /**
     * An optional callback function executed after the modal closes.
     */
    callback?: Callback;

    /**
     * Optional navigation details to redirect after the modal closes.
     */
    navigateTo?: {
        /**
         * The URL to navigate to.
         */
        url: string;

        /**
         * Whether to replace the current history entry with the new one.
         * Defaults to `false` if not provided.
         */
        replace?: boolean;
    };
}

/**
 * Custom hook to manage opening and closing modals based on routes.
 *
 * @param options - Configuration options for the modal behavior.
 * @returns An object containing the `open` state and the `closeModal` function.
 */
const useRouteDialog = (options?: UseDialogModal): DialogState => {
    const [searchParams] = useSearchParamsState();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setOpen(true);
    }, []);

    const queryParams = serializeQueryParams({ ...searchParams });

    /**
     * Function to handle the closing of the modal.
     * Executes any provided callback and handles navigation.
     */
    const closeDialog = useCallback(() => {
        setOpen(false);

        setTimeout(() => {
            if (options?.callback) {
                options.callback();
            }
            if (options?.navigateTo) {
                navigate(
                    searchParams
                        ? `${options.navigateTo.url}?${queryParams}`
                        : options.navigateTo.url,
                    {
                        replace: !!options?.navigateTo?.replace,
                    }
                );
            } else {
                navigate(-1); // Navigate back by default if no URL is provided.
            }
        }, 300); // Add a delay before executing the close logic.
    }, [navigate, options]);

    return { closeDialog, open };
};

export default useRouteDialog;
