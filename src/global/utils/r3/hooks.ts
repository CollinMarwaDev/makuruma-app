/**
 * Local replacements for the private `r3-utils/hooks` package used by the
 * original component kit. Kept small and dependency-free.
 */
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    type ChangeEvent,
} from "react";
import { useSearchParams } from "react-router-dom";

type ParamValue = string | number | boolean | null | undefined;
type ParamRecord = Record<string, ParamValue>;

/** Read/merge URL search params as a plain object. `undefined`/`null`/"" removes a key. */
export function useSearchParamsState<T extends object = Record<string, string | undefined>>() {
    const [params, setParams] = useSearchParams();

    const state = useMemo(
        () => Object.fromEntries(params.entries()) as Partial<Record<keyof T, string>> & T,
        [params]
    );

    const setState = useCallback(
        (next: Partial<Record<keyof T, ParamValue>> | ParamRecord) => {
            setParams(
                (prev) => {
                    const merged = new URLSearchParams(prev);
                    Object.entries(next).forEach(([key, value]) => {
                        if (value === undefined || value === null || value === "") merged.delete(key);
                        else merged.set(key, String(value));
                    });
                    return merged;
                },
                { replace: true, preventScrollReset: true }
            );
        },
        [setParams]
    );

    return [state, setState] as const;
}

/** Returns a debounced version of `callback` that runs `delay` ms after the last call. */
export function useDebounce<T>(callback: (value: T) => void, delay = 400) {
    const callbackRef = useRef(callback);
    const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => () => clearTimeout(timer.current), []);

    return useCallback(
        (value: T) => {
            clearTimeout(timer.current);
            timer.current = setTimeout(() => callbackRef.current(value), delay);
        },
        [delay]
    );
}

/**
 * Navigation state. The app uses `<BrowserRouter>` (no data router / loaders), so
 * navigations are synchronous and never "busy". Kept so kit components keep their API.
 */
export function useNavigationState(): {
    headingLocation?: string;
    isBusy: boolean;
    isLoading: boolean;
    isSubmitting: boolean;
} {
    return { headingLocation: undefined, isBusy: false, isLoading: false, isSubmitting: false };
}

const SELECT_SEPARATOR = ",";

const useSelectedIds = (key: string) => {
    const [params, setParams] = useSearchParamsState<Record<string, string>>();
    const selected = useMemo(
        () => new Set((params[key] ?? "").split(SELECT_SEPARATOR).filter(Boolean)),
        [params, key]
    );
    const save = (ids: Set<string>) =>
        setParams({ [key]: [...ids].join(SELECT_SEPARATOR) || undefined });
    return { save, selected };
};

/** Toggle one row id in the `key` search param. */
export function useHandleSelectItem<T extends { id: string | number }>(item: T, key: string) {
    const { selected, save } = useSelectedIds(key);
    const checkboxRef = useRef<HTMLInputElement>(null);
    const id = String(item.id);

    useEffect(() => {
        if (checkboxRef.current) checkboxRef.current.checked = selected.has(id);
    }, [selected, id]);

    const toggleItemSelection = (event: ChangeEvent<HTMLInputElement>) => {
        const next = new Set(selected);
        if (event.target.checked) next.add(id);
        else next.delete(id);
        save(next);
    };

    return { checkboxRef, isSelected: selected.has(id), toggleItemSelection };
}

/** Select/deselect all rows; keeps the header checkbox indeterminate state in sync. */
export function useHandleSelectAllItems<T extends { id: string | number }>(data: T[], key: string) {
    const { selected, save } = useSelectedIds(key);
    const checkboxRef = useRef<HTMLInputElement>(null);
    const count = data.filter((row) => selected.has(String(row.id))).length;

    useEffect(() => {
        if (!checkboxRef.current) return;
        checkboxRef.current.checked = data.length > 0 && count === data.length;
        checkboxRef.current.indeterminate = count > 0 && count < data.length;
    }, [count, data.length]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        save(event.target.checked ? new Set(data.map((row) => String(row.id))) : new Set());
    };

    return { checkboxRef, handleChange, selectedCount: count };
}
