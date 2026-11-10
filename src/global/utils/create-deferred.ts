export type DeferredReturnType<T> = {
    promise: Promise<T>;
    resolve: (value: T) => void;
    reject: (reason?: unknown) => void;
};

/**
 * Creates a deferred promise — a powerful utility that allows you to manually resolve or reject
 * a promise from outside its executor. This is useful for bridging promise behavior with user-driven
 * or event-driven interactions (e.g., modals, confirmations).
 *
 * Optionally, a timeout can be provided to automatically reject the promise after a given period.
 *
 * @template T The type of the value that the promise resolves to.
 * @param {number} [timeoutMs] - Optional timeout (in milliseconds). If set, the promise will auto-reject after this period.
 * @returns {@link DeferredReturnType} An object containing the controlled `promise`, and its corresponding `resolve` and `reject` functions.
 *
 * @example
 * const deferred = createDeferred<boolean>();
 * showConfirmationModal({
 *   onConfirm: () => deferred.resolve(true),
 *   onCancel: () => deferred.resolve(false),
 * });
 * const userConfirmed = await deferred.promise;
 */
export const createDeferred = <T>(
    timeoutMs?: number
): DeferredReturnType<T> => {
    let closed = false;
    let resolve!: (value: T) => void;
    let reject!: (reason?: unknown) => void;

    const promise = new Promise<T>((res, rej) => {
        resolve = (value) => {
            if (!closed) {
                closed = true;
                res(value);
            }
        };
        reject = (reason) => {
            if (!closed) {
                closed = true;
                rej(reason);
            }
        };

        if (timeoutMs) {
            setTimeout(() => {
                reject(new Error("Timeout exceeded"));
            }, timeoutMs);
        }
    });

    return { promise, reject, resolve };
};
