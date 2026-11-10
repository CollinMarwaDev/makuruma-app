import { useEffect, useId } from "react";

/** Ids of the mounted pages and forms that currently hold changes the user hasn't saved. */
const unsavedWork = new Set<string>();

/**
 * Registers a page or form as holding unsaved changes while `isDirty` is true, so code outside
 * it (such as a workspace switch, which reloads the page) can ask before throwing the work away.
 * `useNavigationPrompt` calls this, so any form protected by it is covered already.
 *
 * @example
 * useRegisterUnsavedWork(formState.isDirty);
 */
export const useRegisterUnsavedWork = (isDirty: boolean) => {
    const id = useId();

    useEffect(() => {
        setUnsavedWork(id, isDirty);

        return () => setUnsavedWork(id, false);
    }, [id, isDirty]);
};

/** Marks one page or form (by id) as holding unsaved changes or not. */
export const setUnsavedWork = (id: string, isDirty: boolean) => {
    if (isDirty) unsavedWork.add(id);
    else unsavedWork.delete(id);
};

/** True while any mounted page or form has unsaved changes. */
export const hasUnsavedWork = (): boolean => unsavedWork.size > 0;

/**
 * Forgets every unsaved-work registration and drops the browser's leave-page prompt. Call it
 * only after the user chose to discard, right before a deliberate full page load.
 */
export const discardUnsavedWork = () => {
    unsavedWork.clear();
    if (typeof window !== "undefined") window.onbeforeunload = null;
};
