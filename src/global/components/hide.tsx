import type { FC, ReactNode } from "react";

type Condition = boolean | (() => boolean);

interface Props {
    /** Whether to hide the children's content. Can be a boolean or a function returning a boolean */
    condition?: Condition;
    /** Content to show/hide based on condition */
    children: ReactNode;
}

/**
 * Conditionally hides content based on a boolean condition.
 * Returns null when condition is true, and renders children when condition is false.
 *
 * @example
 * // Hide content based on boolean
 * <Hide condition={isLoading}>
 *   <p>Content shown when not loading</p>
 * </Hide>
 *
 * @example
 * // Hide using function condition
 * <Hide condition={() => user.age < 18}>
 *   <p>Adults only content</p>
 * </Hide>
 */
export const Hide: FC<Props> = ({ condition = true, children }) => {
    const shouldHide =
        typeof condition === "function" ? condition() : condition;
    return shouldHide ? null : children;
};
