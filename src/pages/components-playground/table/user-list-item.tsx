import type { FC } from "react";
import { AvatarCard } from "~/global/components/avatar";
import { TableCell } from "~/global/components/table/table-cell";
import { TableCellWithCheckbox } from "~/global/components/table/table-cell-with-checkbox";
import { TableRow } from "~/global/components/table/table-row";
import type { User } from "~/pages/components-playground/table/table-data";

export const UserListItem: FC<{ user: User }> = ({ user }) => {
    return (
        <TableRow rowId={user.id}>
            <TableCellWithCheckbox item={user}>
                <AvatarCard>
                    <AvatarCard.Content
                        title={user.name}
                        subtitle={user.email}
                    />
                </AvatarCard>
            </TableCellWithCheckbox>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>action</TableCell>
        </TableRow>
    );
};
