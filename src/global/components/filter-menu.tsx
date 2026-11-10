import { generateButtonClasses } from "~/global/components/button/common";
import type { BaseFilter } from "~/global/components/table-section/search-and-filters";
import { TriangleTextIcon } from "~/global/components/icons";
import { DropdownMenu } from "~/global/components/dropdown";
import { Hide } from "~/global/components/hide";
import type { FC } from "react";
import { cn } from "~/global/utils/cn";

export interface FilterMenuProps {
    label: string;
    onClick: VoidFunction;
    subItems?: BaseFilter[];
}

const FilterMenu: FC<{ filters: FilterMenuProps[] }> = ({ filters }) => {
    return (
        <Hide condition={!filters?.length}>
            <DropdownMenu>
                <DropdownMenu.Trigger asChild>
                    <div
                        className={cn(
                            generateButtonClasses({ variant: "outline" }),
                            "flex items-center gap-2 rounded-xl py-2.5 text-sm",
                            "text-primary-shades-600 bg-faded-container border-2 border-surface",
                            "ring-outline/40 shadow-outline shadow-sm ring-2"
                        )}
                    >
                        <TriangleTextIcon className={"size-4"} />
                        <p>Filter</p>
                    </div>
                </DropdownMenu.Trigger>

                {filters && filters.length > 0 && (
                    <DropdownMenu.Content>
                        {filters?.map((filter) =>
                            !filter.subItems?.length ? (
                                <DropdownMenu.Item
                                    key={filter.label}
                                    label={filter.label}
                                    onClick={filter.onClick}
                                />
                            ) : (
                                <DropdownMenu.Sub key={filter.label}>
                                    <DropdownMenu.SubTrigger
                                        label={filter.label}
                                    />
                                    <DropdownMenu.SubContent>
                                        {filter.subItems?.map((subItem) => (
                                            <DropdownMenu.Item
                                                key={subItem.label}
                                                label={subItem.label}
                                                onClick={subItem.onClick}
                                            />
                                        ))}
                                    </DropdownMenu.SubContent>
                                </DropdownMenu.Sub>
                            )
                        )}
                    </DropdownMenu.Content>
                )}
            </DropdownMenu>
        </Hide>
    );
};

export default FilterMenu;
