import {
    forwardRef,
    type HTMLAttributes,
    type ReactNode,
    useMemo,
} from "react";
import Label from "~/global/components/form-controls/label";
import { cn } from "~/global/utils/cn";

export interface CheckboxProps extends HTMLAttributes<HTMLInputElement> {
    checked?: boolean;
    containerClassName?: string;
    label?: ReactNode;
    name?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, className, containerClassName, id: inputId, ...rest }, ref) => {
        const id = useMemo(() => {
            return inputId ?? Math.random().toString(36).slice(2);
        }, [inputId]);

        return (
            <div className={cn("flex items-center gap-2", containerClassName)}>
                <input
                    ref={ref}
                    type={"checkbox"}
                    className={cn(
                        "text-primary focus:ring-primary/50 size-4.5 border-[#D0D5DD] focus:ring",
                        "shrink-0 cursor-pointer rounded-md",
                        className
                    )}
                    id={id}
                    {...rest}
                />
                <Label className={"cursor-pointer text-sm"} htmlFor={id}>
                    {label}
                </Label>
            </div>
        );
    }
);

Checkbox.displayName = "Checkbox";
export default Checkbox;
