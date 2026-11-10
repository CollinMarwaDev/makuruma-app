import { forwardRef, Fragment } from "react";
import {
    type ButtonProps,
    generateButtonClasses,
} from "~/global/components/button/common";
import { LoadingCircle } from "~/global/components/icons";

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    const {
        children,
        disabled,
        loadingText = "Please wait...",
        loading,
        loadingIconClassName,
        ...rest
    } = props;

    const buttonClassName = generateButtonClasses(props);

    return (
        <button
            {...rest}
            aria-disabled={loading || disabled}
            disabled={loading || disabled}
            className={buttonClassName}
            ref={ref}
        >
            {loading ? (
                <Fragment>
                    <LoadingCircle className={loadingIconClassName} />

                    {loadingText.length ? (
                        <span
                            className={"pl-1 tracking-wide whitespace-nowrap"}
                        >
                            {loadingText}
                        </span>
                    ) : null}
                </Fragment>
            ) : (
                children
            )}
        </button>
    );
});

Button.displayName = "Button";

export default Button;
