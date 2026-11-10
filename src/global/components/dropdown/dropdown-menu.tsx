import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { DropdownSearchInput } from "~/global/components/dropdown/dropdown-search-input";
import { DropdownSubContent } from "~/global/components/dropdown/dropdown-sub-content";
import { DropdownSubTrigger } from "~/global/components/dropdown/dropdown-sub-trigger";
import { DropdownMenuContent } from "./dropdown-menu-content";
import { DropdownMenuItem } from "./dropdown-menu-item";
import { DropdownMenuSeparator } from "./dropdown-menu-separator";
import { DropdownMenuCheckboxItem } from "~/global/components/dropdown/dropdown-menu-checkbox-item";

export const DropdownMenu = (
    props: DropdownMenuPrimitive.DropdownMenuProps
) => {
    return <DropdownMenuPrimitive.Root {...props} />;
};

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

DropdownMenu.Trigger = DropdownMenuTrigger;
DropdownMenu.Search = DropdownSearchInput;
DropdownMenu.Arrrow = DropdownMenuPrimitive.Arrow;
DropdownMenu.SubTrigger = DropdownSubTrigger;
DropdownMenu.Sub = DropdownMenuPrimitive.Sub;
DropdownMenu.SubContent = DropdownSubContent;
DropdownMenu.Content = DropdownMenuContent;
DropdownMenu.Item = DropdownMenuItem;
DropdownMenu.CheckboxItem = DropdownMenuCheckboxItem;
DropdownMenu.Portal = DropdownMenuPortal;
DropdownMenu.Separator = DropdownMenuSeparator;
