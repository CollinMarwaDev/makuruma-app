import type { ReactNode } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import {
    type Control,
    type FieldValues,
    type Path,
    useController,
} from "react-hook-form";
import { ButtonLink } from "~/global/components/button";
import { Combobox, type ResetOn } from "~/global/components/combobox/combobox";
import type {
    ComboboxSelectOptionType,
    ComboboxTriggerType,
} from "~/global/components/form-controls/combobox-input/combobox-types";
import {
    comboboxInputOptionTypeMap,
    type ComboboxType,
    type ComboboxTypeToOptionType,
} from "~/global/components/form-controls/combobox-input/options";

export interface ComboboxProps<
    T extends ComboboxType = "default",
    TFieldValues extends FieldValues = FieldValues,
    Option extends ComboboxSelectOptionType = ComboboxTypeToOptionType<T>,
> extends ComboboxTriggerType {
    control: Control<TFieldValues>;
    defaultValue?: Option[];
    disabled?: boolean;
    hasError?: boolean;
    hidden?: boolean;
    /** Content below the results, such as bounded pagination controls. */
    footer?: ReactNode;
    /** Replaces the standard message when the current result page is empty. */
    emptyMessage?: string;
    loading?: boolean;
    multiselect?: boolean;
    name: Path<TFieldValues>;
    onSearch?: (query: string) => void;
    options: Option[];
    resetOn?: ResetOn;
    /** Disable local filtering when the resource owns search. */
    shouldFilter?: boolean;
    /** Accessible name for the search input; defaults to the field label plus Search. */
    searchLabel?: string;
    /** Controlled search text; onSearch runs immediately in this mode. */
    searchValue?: string;
    ctaLink?: string;
    ctaLabel?: string;
    type?: T;
}

/** Form-controlled selection with optional remote search, page feedback, and footer controls. */
export const ComboboxInput = <
    T extends ComboboxType = "default",
    TFieldValues extends FieldValues = FieldValues,
>({
    _prefix,
    "aria-describedby": describedBy,
    "aria-invalid": invalid,
    disabled,
    emptyMessage,
    errorMessage,
    footer,
    hasError,
    id,
    control,
    containerClassName,
    label,
    labelClassName,
    loading,
    multiselect,
    name,
    onSearch,
    options = [],
    placeholder,
    resetOn,
    searchLabel,
    searchValue,
    shouldFilter = true,
    ctaLink,
    ctaLabel,
    type = "default" as T,
}: ComboboxProps<T, TFieldValues>) => {
    const {
        selectOption: SelectOptionComponent,
        trigger: DefaultTriggerComponent,
        multiselectTrigger: MultiselectTriggerComponent,
        loader: LoaderComponent,
    } = comboboxInputOptionTypeMap[type];

    const TriggerComponent = multiselect
        ? MultiselectTriggerComponent
        : DefaultTriggerComponent;

    const {
        field: { onChange: handleChange, value },
    } = useController({ control, name });

    return (
        <Combobox
            defaultValue={value}
            multiple={multiselect}
            onChange={handleChange}
            loading={loading}
            resetTrigger={resetOn}
        >
            <div className="relative w-full">
                {ctaLink && (
                    <ButtonLink
                        variant="outline"
                        to={ctaLink}
                        className="absolute top-0 right-0 z-10 px-1 py-0.5"
                    >
                        <PlusIcon className="size-4" />
                        <p className="text-xs">{ctaLabel || "Add"}</p>
                    </ButtonLink>
                )}
                <TriggerComponent
                    _prefix={_prefix}
                    aria-describedby={describedBy}
                    aria-invalid={invalid}
                    containerClassName={containerClassName}
                    disabled={disabled}
                    errorMessage={errorMessage}
                    hasError={hasError}
                    id={id}
                    label={label}
                    labelClassName={labelClassName}
                    placeholder={placeholder}
                />
            </div>
            <Combobox.Panel shouldFilter={shouldFilter}>
                <Combobox.Header
                    onSearch={onSearch}
                    searchLabel={searchLabel ?? `Search ${label}`}
                    searchValue={searchValue}
                />
                <Combobox.Empty message={emptyMessage} />
                <Combobox.Loading>
                    {LoaderComponent && <LoaderComponent />}
                </Combobox.Loading>
                <Combobox.Lists className={"overflow-y-auto"}>
                    {options.map((option) => (
                        <Combobox.Item
                            value={option}
                            // The label too: several countries share one calling code.
                            key={`${String(option.value)}-${String(option.label)}`}
                        >
                            {(selected) => (
                                <SelectOptionComponent
                                    option={option}
                                    selected={selected}
                                />
                            )}
                        </Combobox.Item>
                    ))}
                </Combobox.Lists>
                {footer}
            </Combobox.Panel>
        </Combobox>
    );
};
