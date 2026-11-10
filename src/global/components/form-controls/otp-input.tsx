import React, { useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";

interface OTPProps {
    length?: number;
    onComplete: (otp: string) => void;
    onError?: (error: string) => void;
    disabled?: boolean;
    autoFocus?: boolean;
    placeholder?: string;
    className?: string;
    inputClassName?: string;
    errorClassName?: string;
    allowedPattern?: RegExp;
}

interface OTPFormData {
    otp: string[];
}

const OTPInput: React.FC<OTPProps> = ({
    length = 6,
    onComplete,
    onError,
    disabled = false,
    autoFocus = false,
    placeholder = "",
    className = "",
    inputClassName = "",
    errorClassName = "",
    allowedPattern = /^[0-9]$/,
}) => {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const completedOtpRef = useRef("");

    const {
        control,
        watch,
        setValue,
        formState: { errors },
        setError,
        clearErrors,
    } = useForm<OTPFormData>({
        defaultValues: {
            otp: Array(length).fill(""),
        },
        mode: "onChange",
    });

    const watchedValues = watch("otp");

    // Auto-focus first input on mount
    useEffect(() => {
        if (autoFocus && inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [autoFocus]);

    // Check if OTP is complete and call onComplete
    useEffect(() => {
        const otpString = watchedValues.join("");
        if (
            otpString.length === length &&
            !watchedValues.includes("") &&
            completedOtpRef.current !== otpString
        ) {
            completedOtpRef.current = otpString;
            onComplete(otpString);
            return;
        }

        if (otpString.length !== length || watchedValues.includes("")) {
            completedOtpRef.current = "";
        }
    }, [watchedValues, length, onComplete]);

    const handleInputChange = (index: number, value: string) => {
        // Only allow single character and match pattern
        if (value.length > 1) {
            value = value.slice(-1);
        }

        if (value && !allowedPattern.test(value)) {
            return;
        }

        // Clear any existing errors
        clearErrors();

        // Update the value
        const newOtp = [...watchedValues];
        newOtp[index] = value;
        setValue("otp", newOtp);

        // Move to next input if value is entered
        if (value && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (
        index: number,
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        // Handle backspace
        if (e.key === "Backspace") {
            e.preventDefault();
            const newOtp = [...watchedValues];

            if (newOtp[index]) {
                // Clear current field
                newOtp[index] = "";
                setValue("otp", newOtp);
            } else if (index > 0) {
                // Move to previous field and clear it
                newOtp[index - 1] = "";
                setValue("otp", newOtp);
                inputRefs.current[index - 1]?.focus();
            }
        }
        // Handle arrow keys
        else if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === "ArrowRight" && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
        // Handle Enter
        else if (e.key === "Enter") {
            const otpString = watchedValues.join("");
            if (otpString.length === length) {
                onComplete(otpString);
            } else {
                const errorMsg = "Please complete all fields";
                setError("otp", { message: errorMsg, type: "manual" });
                if (onError) onError(errorMsg);
            }
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, length);

        // Validate pasted data
        if (pastedData.split("").every((char) => allowedPattern.test(char))) {
            const newOtp = Array(length).fill("");
            pastedData.split("").forEach((char, index) => {
                if (index < length) {
                    newOtp[index] = char;
                }
            });
            setValue("otp", newOtp);

            // Focus the next empty field or the last field
            const nextEmptyIndex = newOtp.findIndex((val) => val === "");
            const focusIndex =
                nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex;
            inputRefs.current[focusIndex]?.focus();
        }
    };

    const handleFocus = (index: number) => {
        // Select all text when focusing
        inputRefs.current[index]?.select();
    };

    return (
        <div className={`otp-container ${className}`}>
            <div className="flex justify-center gap-2">
                {Array.from({ length }, (_, index) => (
                    <Controller
                        key={index}
                        name={`otp.${index}`}
                        control={control}
                        render={({ field }) => (
                            <input
                                {...field}
                                ref={(el) => {
                                    inputRefs.current[index] = el;
                                    field.ref(el);
                                }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                disabled={disabled}
                                placeholder={placeholder}
                                className={`h-12 w-12 rounded-lg border text-center text-lg font-semibold bg-surface text-foreground focus:border-primary focus:ring-2 focus:ring-primary/40 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${field.value ? "border-status-green-pc bg-status-green-bg" : "border-outline"} ${errors.otp?.[index] ? "border-status-red-pc bg-status-red-bg" : ""} ${inputClassName} `}
                                onChange={(e) =>
                                    handleInputChange(index, e.target.value)
                                }
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                onFocus={() => handleFocus(index)}
                                autoComplete="one-time-code"
                            />
                        )}
                    />
                ))}
            </div>

            {errors.otp && (
                <div
                    className={`mt-2 text-center text-sm text-red-600 ${errorClassName}`}
                >
                    {errors.otp.message || "Please fill in all fields"}
                </div>
            )}
        </div>
    );
};

export default OTPInput;
