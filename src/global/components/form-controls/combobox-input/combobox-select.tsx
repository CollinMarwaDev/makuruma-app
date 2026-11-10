import { useMemo } from "react";
import { Combobox } from "~/global/components/combobox/combobox";
import type {
    ComboboxSelectOptionType,
    ComboboxTriggerType,
} from "~/global/components/form-controls/combobox-input/combobox-types";
import {
    ComboboxDefaultOption,
    ComboboxDefaultTrigger,
} from "~/global/components/form-controls/combobox-input/options/default";

export interface ComboboxSelectProps extends ComboboxTriggerType {
    /** Adds a first option that clears the choice (value `""`), e.g. "— None —". */
    clearLabel?: string;
    emptyMessage?: string;
    onChange: (value: string) => void;
    options: ComboboxSelectOptionType[];
    /** Placeholder of the search box inside the list. */
    searchLabel?: string;
    /** Selected option value (`""` for none). */
    value: string;
}

/**
 * Single-choice searchable select for state-driven forms (no react-hook-form needed).
 * Type to narrow long lists (e.g. trailers by reg no) and pick exactly one option.
 * For react-hook-form fields use `ComboboxInput`.
 */
export const ComboboxSelect = ({
    clearLabel,
    emptyMessage,
    onChange,
    options,
    searchLabel,
    value,
    ...trigger
}: ComboboxSelectProps) => {
    const allOptions = useMemo(
        () => (clearLabel ? [{ label: clearLabel, value: "" }, ...options] : options),
        [clearLabel, options]
    );
    // A stable array, so the combobox only resets when the chosen value really changes.
    const selected = useMemo(
        () => options.filter((o) => String(o.value) === value),
        [options, value]
    );

    return (
        <Combobox
            defaultValue={selected}
            onChange={(next) => onChange(next[0] ? String(next[0].value) : "")}
        >
            <ComboboxDefaultTrigger {...trigger} />
            <Combobox.Panel>
                <Combobox.Header searchLabel={searchLabel ?? `Search ${trigger.label}`} />
                <Combobox.Empty message={emptyMessage} />
                <Combobox.Lists className="max-h-64 overflow-y-auto">
                    {allOptions.map((option) => (
                        <Combobox.Item value={option} key={String(option.value)}>
                            {(isSelected) => <ComboboxDefaultOption option={option} selected={isSelected} />}
                        </Combobox.Item>
                    ))}
                </Combobox.Lists>
            </Combobox.Panel>
        </Combobox>
    );
};
