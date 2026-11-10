import { Label as LabelPrimitive } from "radix-ui";
import type { FC, LabelHTMLAttributes } from "react";
import { cn } from "~/global/utils/cn";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
    optional?: boolean;
}

const Label: FC<LabelProps> = ({
    children,
    htmlFor,
    className,
    optional,
    ...rest
}) => (
    <LabelPrimitive.Root
        {...rest}
        htmlFor={htmlFor}
        className={cn(
            "items-between text-primary-950 text-xs leading-6",
            className
        )}
    >
        <span>{children}</span>
        {optional && (
            <small className="text-muted font-light tracking-wide">
                ( Optional )
            </small>
        )}
    </LabelPrimitive.Root>
);

export default Label;
