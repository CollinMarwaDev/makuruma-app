import { Command, useCommandState } from "cmdk";
import type { FC, ReactNode } from "react";
import { useComboboxContext } from "~/global/components/combobox/combobox-provider";
import { LoadingCircle } from "~/global/components/icons";

const ComboboxLoading: FC<{ children?: ReactNode }> = ({ children }) => {
    const { loading } = useComboboxContext();
    const hasNoSearchResults = useCommandState(
        (state) => state.filtered.count === 0
    );

    if (!(loading && hasNoSearchResults)) return null;

    return (
        <Command.Loading>
            {children ? (
                children
            ) : (
                <div className={"center flex-col space-y-3 py-7"}>
                    <LoadingCircle className={"size-6 opacity-80"} />
                    <p className={"text-sm text-gray-500"}>Loading data...</p>
                </div>
            )}
        </Command.Loading>
    );
};
export default ComboboxLoading;
