import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import type { ContainerElementType } from "~/global/types";
import { cn } from "~/global/utils/cn";

type ModalContentProps<T extends ContainerElementType = "div"> = {
    as?: T;
    children: ReactNode;
    className?: string;
} & ComponentPropsWithoutRef<T>;

export const ModalContent = <T extends ContainerElementType = "div">({
    as,
    children,
    className,
    ...otherProps
}: ModalContentProps<T>) => {
    const Element = (as || "div") as ElementType;
    return (
        <Element
            {...otherProps}
            className={cn("flex-1 px-6", className)}
        >
            {children}
        </Element>
    );
};
