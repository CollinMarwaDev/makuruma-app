import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import {
    forwardRef,
    type ChangeEvent,
    type InputHTMLAttributes,
    useEffect,
    useRef,
    useState,
} from "react";
import { inputClassNames } from "~/global/components/form-controls/common";
import { cn } from "~/global/utils/cn";

export interface TextInputBasicProps
    extends InputHTMLAttributes<HTMLInputElement> {
    colorSwatchDefaultColor?: string;
    hasError?: boolean;
    showColorSwatch?: boolean;
}

const HEX_COLOR_REGEX = /^#[0-9a-fA-F]{6}$/;
const FALLBACK_COLOR = "#000000";

const getInputColor = (value: unknown) => {
    const color = typeof value === "string" ? value.trim() : "";

    return HEX_COLOR_REGEX.test(color) ? color : undefined;
};

export const TextInputBasic = forwardRef<HTMLInputElement, TextInputBasicProps>(
    (
        {
            colorSwatchDefaultColor,
            hasError,
            className,
            showColorSwatch,
            type,
            ...rest
        },
        ref
    ) => {
        const [showPassword, setShowPassword] = useState(false);
        const inputRef = useRef<HTMLInputElement | null>(null);
        const isPassword = type === "password";
        const colorFallback =
            getInputColor(colorSwatchDefaultColor) ??
            getInputColor(rest.defaultValue) ??
            getInputColor(rest.placeholder) ??
            FALLBACK_COLOR;
        const [swatchColor, setSwatchColor] = useState(colorFallback);
        const hasEndControl = isPassword || showColorSwatch;

        const setInputRef = (node: HTMLInputElement | null) => {
            inputRef.current = node;

            if (typeof ref === "function") {
                ref(node);
            } else if (ref) {
                ref.current = node;
            }
        };

        useEffect(() => {
            if (!showColorSwatch) return;

            setSwatchColor(colorFallback);
        }, [colorFallback, showColorSwatch]);

        const togglePasswordVisibility = () => {
            setShowPassword((prev) => !prev);
        };

        const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
            const nextColor =
                getInputColor(event.target.value) ?? colorFallback;

            setSwatchColor(nextColor);

            rest.onChange?.(event);
        };

        const handleColorChange = (event: ChangeEvent<HTMLInputElement>) => {
            const nextColor = event.target.value;

            setSwatchColor(nextColor);

            if (inputRef.current) {
                inputRef.current.value = nextColor;
                rest.onChange?.({
                    ...event,
                    currentTarget: inputRef.current,
                    target: inputRef.current,
                } as ChangeEvent<HTMLInputElement>);
            }
        };

        return (
            <div className="relative w-full">
                <input
                    ref={setInputRef}
                    type={isPassword && showPassword ? "text" : type}
                    {...rest}
                    className={cn(inputClassNames, className, {
                        "input-error": hasError,
                        "pr-12": hasEndControl,
                    })}
                    onChange={handleTextChange}
                />

                {isPassword && (
                    <button
                        type="button"
                        className="text-primary hover:text-primary-300 absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
                        onClick={togglePasswordVisibility}
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <EyeSlashIcon
                                className="size-5"
                                aria-hidden="true"
                            />
                        ) : (
                            <EyeIcon className="size-5" aria-hidden="true" />
                        )}
                    </button>
                )}

                {showColorSwatch && !isPassword && (
                    <label className="ring-secondary-200 absolute top-1 right-1 bottom-1 aspect-square cursor-pointer overflow-hidden rounded-full border border-surface shadow-sm ring-1">
                        <span
                            aria-hidden
                            className="block size-full"
                            style={{ backgroundColor: swatchColor }}
                        />
                        <input
                            aria-label={`${rest.name ?? "Color"} picker`}
                            className="absolute inset-0 size-full cursor-pointer opacity-0"
                            type="color"
                            value={swatchColor}
                            onChange={handleColorChange}
                        />
                    </label>
                )}
            </div>
        );
    }
);

TextInputBasic.displayName = "TextInputBasic";
