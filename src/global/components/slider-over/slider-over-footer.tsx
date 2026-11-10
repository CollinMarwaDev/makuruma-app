import { Children, type FC, type ReactNode } from "react";
import { cn } from "~/global/utils/cn";

interface SlideOverFooterProps {
    children?: ReactNode;
    className?: string;
}

/**
 * The slide-over footer: its buttons share the width equally (one button fills the row, two sit
 * side by side). Renders nothing when it has no children, so callers need no empty-footer check.
 */
export const SlideOverFooter: FC<SlideOverFooterProps> = ({
    children,
    className,
}) => {
    if (Children.toArray(children).length === 0) return null;

    return (
        <footer
            className={cn(
                "flex gap-4 rounded-b-lg p-6 pt-5 *:flex-1",
                className
            )}
        >
            {children}
        </footer>
    );
};
