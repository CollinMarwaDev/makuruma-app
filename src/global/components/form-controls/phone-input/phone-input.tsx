import {
    type ChangeEventHandler,
    type FC,
    type InputHTMLAttributes,
    useEffect,
    useId,
    useState,
} from "react";
import { InputWithSelect } from "~/global/components/input-with-select";
import type { Callable, LabelWithValue } from "~/global/types";
import { formatInputAdvanced } from "~/global/utils/format-input-advance";
import { countriesAndCodes } from "~/global/constants/country-constants";
import { cn } from "~/global/utils/cn";

export type PhoneValue = {
    countryCode: LabelWithValue;
    phoneNumber: string;
};

export interface PhoneInputProps
    extends Pick<
        InputHTMLAttributes<HTMLInputElement>,
        "aria-describedby" | "aria-invalid" | "id" | "name"
    > {
    containerClassName?: string;
    defaultValue?: PhoneValue;
    disabled?: boolean;
    hasError?: boolean;
    onChange?: Callable<PhoneValue>;
}

const countryCodes: LabelWithValue[] = countriesAndCodes.map(
    ({ phone, code }) => ({
        label: code,
        value: phone,
    })
);

/** Phone value editor that forwards input identity and validation attributes. */
export const PhoneInput: FC<PhoneInputProps> = ({
    containerClassName,
    defaultValue,
    disabled,
    hasError,
    onChange,
    ...rest
}) => {
    const generatedId = useId();
    const inputId = rest.id ?? generatedId;
    const [phoneNumber, setPhoneNumber] = useState<string>();
    const [countryCode, setCountryCode] = useState<LabelWithValue>({
        label: "TZ",
        value: "+255",
    });

    useEffect(() => {
        if (defaultValue) {
            setCountryCode(defaultValue.countryCode);
            setPhoneNumber(defaultValue.phoneNumber);
        }
    }, [defaultValue]);

    const handleChange: ChangeEventHandler<HTMLInputElement> = (value) => {
        const originalValue = value.target.value.replaceAll("-", "");
        if (isNaN(Number(originalValue)) || originalValue.length > 9) return;

        setPhoneNumber(originalValue);
        onChange?.({ countryCode, phoneNumber: originalValue });
    };

    const handleCountryCodeChange = (value: LabelWithValue) => {
        setCountryCode(value);
        if (phoneNumber) {
            onChange?.({ countryCode: value, phoneNumber });
        }
    };

    return (
        <InputWithSelect className={cn("gap-0", containerClassName)}>
            <InputWithSelect.Select
                aria-describedby={rest["aria-describedby"]}
                aria-invalid={rest["aria-invalid"]}
                aria-label="Country calling code"
                id={`${inputId}-country-code`}
                defaultValue={countryCode ?? { label: "TZ", value: "+255" }}
                className={"rounded-l-full rounded-r-none border-r-0"}
                onChange={handleCountryCodeChange}
                options={countryCodes}
                disabled={disabled}
                hasError={hasError}
                isPhone
            />
            <InputWithSelect.Input
                {...rest}
                id={inputId}
                className={"rounded-r-full"}
                onChange={handleChange}
                disabled={disabled}
                hasError={hasError}
                placeholder={"000-000-000"}
                value={
                    phoneNumber &&
                    formatInputAdvanced(String(phoneNumber), "###-###-###")
                }
            />
        </InputWithSelect>
    );
};
