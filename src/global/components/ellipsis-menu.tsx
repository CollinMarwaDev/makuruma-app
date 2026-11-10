import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import type { FC } from "react";
import { ButtonIcon } from "~/global/components/button";
import { DropdownMenu, type DropdownMenuType } from "~/global/components/dropdown";

export const EllipsisMenu: FC<{
    menuItems: DropdownMenuType[];
    loading?: boolean;
    title?: string;
}> = ({ menuItems, title, loading }) => {
    return (
        <DropdownMenu>
            <DropdownMenu.Trigger asChild>
                <ButtonIcon
                    loading={loading}
                    title={title || "Menu"}
                    icon={EllipsisVerticalIcon}
                    className="size-9"
                />
            </DropdownMenu.Trigger>

            <DropdownMenu.Content>
                {menuItems.map((item, index) => (
                    <DropdownMenu.Item key={index} {...item} />
                ))}
            </DropdownMenu.Content>
        </DropdownMenu>
    );
};
