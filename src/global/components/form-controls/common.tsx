import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { type FC, type HTMLAttributes, useEffect, useRef } from "react";
import { cn } from "~/global/utils/cn";

export const FieldContainer: FC<HTMLAttributes<HTMLDivElement>> = ({
    children,
    className,
}) => (
    <div className={cn("relative w-full space-y-1.5", className)}>
        {children}
    </div>
);

/** Visible field feedback; pass an id to connect it with aria-describedby. */
export const ErrorMessage: FC<
    HTMLAttributes<HTMLParagraphElement> & { message?: string }
> = ({ className, message, ...props }) =>
    message ? (
        <p {...props} className={cn("text-status-red-pc text-xs", className)}>
            {message}
        </p>
    ) : null;

export const ErrorIcon = () => {
    return (
        <ExclamationCircleIcon className="pointer-events-none absolute top-0 right-2 bottom-0 my-auto h-5 w-5 text-red-500" />
    );
};

//🤔Thinking to move it into a tailwindcss file.
export const inputClassNames = cn(
    "spin-button-none w-full overflow-hidden rounded-3xl border-2 border-surface",
    "font-normal tracking-wider text-foreground ring-1 ring-secondary-200 bg-secondary-50",
    "placeholder:text-sm placeholder:font-light placeholder:text-muted-foreground",
    "focus:border-primary px-4 spin-button-none shadow-sm shadow-outline",
    "focus:outline-none focus:ring-primary/40 disabled:opacity-60 sm:text-sm",
    "sm:leading-6 py-2.5 md:text-sm lg:py-2  2xl:ring-2"
);

interface FormErrorSummaryProps {
    errors: { id: string; message: string }[];
    submitCount: number;
}

/** Announces multiple validation failures and links to the existing controls after submit. */
export const FormErrorSummary = ({
    errors,
    submitCount,
}: FormErrorSummaryProps) => {
    const headingRef = useRef<HTMLParagraphElement>(null);
    const hasMultipleErrors = errors.length > 1;
    useEffect(() => {
        if (submitCount && hasMultipleErrors) headingRef.current?.focus();
    }, [hasMultipleErrors, submitCount]);
    if (!hasMultipleErrors) return null;
    return (
        <div
            className="border-status-red-pc rounded-xl border p-3 text-sm"
            role="alert"
        >
            <p className="font-medium" ref={headingRef} tabIndex={-1}>
                Check these fields to continue
            </p>
            <ul className="mt-2 list-inside list-disc">
                {errors.map((error) => (
                    <li key={error.id}>
                        <a
                            className="text-status-red-pc underline"
                            href={`#${error.id}`}
                            onClick={(event) => {
                                event.preventDefault();
                                document.getElementById(error.id)?.focus();
                            }}
                        >
                            {error.message}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};
