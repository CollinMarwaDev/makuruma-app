import {
    LockClosedIcon,
    PencilSquareIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import { Button } from "~/global/components/button";
import { ComponentCard } from "~/global/components/component-card";
import { DropdownMenu } from "~/global/components/dropdown";
import { EllipsisMenu } from "~/global/components/ellipsis-menu";

export const DropdownMenuComponent = () => {
    const handleClick = () => {
        alert("clicked");
    };

    const defaultItems = Array(4).fill({
        label: "Click me",
        onClick: handleClick,
    });

    const iconItems = [
        {
            Icon: PencilSquareIcon,
            label: "Edit",
            onClick: handleClick,
        },
        {
            Icon: TrashIcon,
            label: "Delete",
            onClick: handleClick,
        },
        {
            Icon: LockClosedIcon,
            danger: true,
            divider: true,
            label: "Danger zone",
            onClick: handleClick,
        },
    ];

    return (
        <ComponentCard
            title="Dropdown menu componet"
            innerWrapperClassName="flex gap-2 items-center"
        >
            <DropdownMenu>
                <DropdownMenu.Trigger asChild>
                    <Button variant="outline" className="text-xs">
                        Default
                    </Button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Content>
                    {defaultItems.map((item, index) => (
                        <DropdownMenu.Item key={index} {...item} />
                    ))}
                </DropdownMenu.Content>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenu.Trigger asChild>
                    <Button variant="outline" className="text-xs">
                        With Icon
                    </Button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Content>
                    {iconItems.map((item, index) => (
                        <DropdownMenu.Item key={index} {...item} />
                    ))}
                </DropdownMenu.Content>
            </DropdownMenu>
            <EllipsisMenu menuItems={iconItems} />
        </ComponentCard>
    );
};
