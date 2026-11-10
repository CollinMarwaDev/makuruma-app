import { type ComponentProps, type ReactNode, useState } from "react";
import { Button } from "~/global/components/button";
import { DropdownMenu } from "~/global/components/dropdown";
import { TriangleTextIcon } from "~/global/components/icons";
import { SearchBox } from "~/global/components/search-box";
import { Hide } from "~/global/components/hide";
import { cn } from "~/global/utils/cn";

export type BaseFilter = {
    label: string;
    onClick: VoidFunction;
};

export type Filter = {
    label: string;
    onClick: VoidFunction;
    subItems?: BaseFilter[];
    content?: (closeDropdown: VoidFunction) => ReactNode;
};

export interface TableSectionSearchAndFiltersProps
    extends Omit<ComponentProps<"div">, "children"> {
    placeholder?: string;
    filters?: Filter[];
}

export const TableSectionSearchAndFilters = ({
    className,
    filters,
    placeholder,
    ...otherProps
}: TableSectionSearchAndFiltersProps) => {
    const [open, setOpen] = useState(false);
    const closeDropdown = () => setOpen(false);

    return (
        <div
            {...otherProps}
            className={cn("flex items-center gap-3", className)}
        >
            <SearchBox
                placeholder={placeholder ?? "Type to search"}
                className="placeholder:text-primary-shades-600"
            />

            <Hide condition={!filters?.length}>
                <DropdownMenu open={open} onOpenChange={setOpen}>
                    <DropdownMenu.Trigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "flex items-center gap-2 rounded-xl py-2.5 text-sm",
                                "text-primary-shades-600 bg-faded-container border-2 border-surface",
                                "ring-outline/40 shadow-outline shadow-sm ring-2"
                            )}
                        >
                            <TriangleTextIcon className="size-4" />
                            <p>Filter</p>
                        </Button>
                    </DropdownMenu.Trigger>

                    {filters && filters.length > 0 && (
                        <DropdownMenu.Content>
                            {filters.map((filter) =>
                                filter.content ? (
                                    <DropdownMenu.Sub key={filter.label}>
                                        <DropdownMenu.SubTrigger
                                            label={filter.label}
                                        />
                                        <DropdownMenu.SubContent className="p-0">
                                            {filter.content(closeDropdown)}
                                        </DropdownMenu.SubContent>
                                    </DropdownMenu.Sub>
                                ) : !filter.subItems?.length ? (
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
                                            {filter.subItems.map((subItem) => (
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
        </div>
    );
};
