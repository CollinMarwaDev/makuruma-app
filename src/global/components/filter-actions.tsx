import { ChipsButton } from "~/global/components/button";
import { Hide } from "~/global/components/hide";
import { isNotEmpty } from "~/global/utils/is-not-empty";
import { useHandleActiveFilters } from "~/global/components/table-section/handle-active-filters";

const FilterActions = () => {
    const { formatValue, formatLabel, activeFilters } =
        useHandleActiveFilters();

    return (
        <Hide condition={!isNotEmpty(activeFilters)}>
            <div className={"flex flex-wrap gap-2 py-2"}>
                {activeFilters.map(({ label, value, onRemove }) => (
                    <ChipsButton key={label} onClick={onRemove}>
                        <ChipsButton.Label
                            label={`${formatLabel(label)}: ${formatValue(value)}`}
                        />
                    </ChipsButton>
                ))}
            </div>
        </Hide>
    );
};

export default FilterActions;
