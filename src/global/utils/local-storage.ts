const PREFIX = "makuruma:";

const read = <T>(key: string): T | undefined => {
    try {
        const raw = localStorage.getItem(PREFIX + key);
        return raw === null ? undefined : (JSON.parse(raw) as T);
    } catch {
        return undefined;
    }
};

/** Namespaced, JSON-encoded localStorage helpers that never throw. */
export const lStorage = {
    get<TData = unknown>(key: string, defaultValue?: TData): TData | undefined {
        return read<TData>(key) ?? defaultValue;
    },
    getMany(keys: string[]) {
        return keys.map((key) => lStorage.get(key));
    },
    remove(key: string | string[]): void {
        try {
            (Array.isArray(key) ? key : [key]).forEach((k) => localStorage.removeItem(PREFIX + k));
        } catch {
            /* storage unavailable */
        }
    },
    set<TData = unknown>(key: string, value: TData): void {
        try {
            localStorage.setItem(PREFIX + key, JSON.stringify(value));
        } catch {
            /* storage unavailable */
        }
    },
    setMany(data: Record<string, unknown>): void {
        Object.entries(data).forEach(([key, value]) => lStorage.set(key, value));
    },
};
