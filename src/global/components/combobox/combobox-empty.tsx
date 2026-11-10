import { Command, useCommandState } from "cmdk";
import { useComboboxContext } from "~/global/components/combobox/combobox-provider";

const ComboboxEmpty = ({ message }: { message?: string }) => {
    const { loading } = useComboboxContext();
    const { filtered, search } = useCommandState((state) => state);

    if (loading && !filtered.count) return null;
    return (
        <Command.Empty className={"center flex-col py-5"}>
            {/* <SearchXIcon className={"size-8 text-dark-green"} /> */}
            <p className={"text-neutral-550 text-center text-sm"}>
                {message ??
                    (search
                        ? "No record matching your search query"
                        : "No records")}
            </p>
        </Command.Empty>
    );
};
export default ComboboxEmpty;
