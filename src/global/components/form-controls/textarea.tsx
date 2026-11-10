import { forwardRef, useId } from "react";
import TextareaAutosize, {
    type TextareaAutosizeProps,
} from "react-textarea-autosize";
import {
    ErrorMessage,
    FieldContainer,
    inputClassNames,
} from "~/global/components/form-controls/common";
import Label from "~/global/components/form-controls/label";
import { cn } from "~/global/utils/cn";

export interface TextareaFieldProps extends TextareaAutosizeProps {
    containerClassName?: string;
    errorMessage?: string;
    hasError?: boolean;
    label: string;
    labelClassName?: string;
}

/** Autosizing textarea with a unique label target and connected validation feedback. */
export const TextareaField = forwardRef<
    HTMLTextAreaElement,
    TextareaFieldProps
>(
    (
        {
            className,
            containerClassName,
            errorMessage,
            hasError,
            id,
            rows = 4,
            label,
            labelClassName,
            ...otherProps
        },
        ref
    ) => {
        const generatedId = useId();
        const inputId = id ?? generatedId;
        const errorId = errorMessage ? `${inputId}-error` : undefined;
        return (
            <FieldContainer className={containerClassName}>
                <Label className={labelClassName} htmlFor={inputId}>
                    {label}
                </Label>
                <TextareaAutosize
                    {...otherProps}
                    aria-describedby={
                        [otherProps["aria-describedby"], errorId]
                            .filter(Boolean)
                            .join(" ") || undefined
                    }
                    aria-invalid={
                        hasError || !!errorMessage || otherProps["aria-invalid"]
                    }
                    id={inputId}
                    className={cn(
                        inputClassNames,
                        "resize-none",
                        { "input-error": hasError },
                        className
                    )}
                    ref={ref}
                    rows={rows}
                    autoComplete={"off"}
                    minRows={2}
                    maxRows={4}
                />
                <ErrorMessage id={errorId} message={errorMessage} />
            </FieldContainer>
        );
    }
);

TextareaField.displayName = "InputField";
