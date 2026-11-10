import { Button } from "~/global/components/button";
import { useComboboxContext } from "~/global/components/combobox/combobox-provider";
import { cn } from "~/global/utils/cn";

const ComboboxFooter = () => {
    const {
        close: closeCombobox,
        handleOptionsSelectionComplete,
        selectedOptions,
    } = useComboboxContext();

    const isDisabled = selectedOptions.length === 0;

    return (
        <footer
            className={cn(
                "border-primary-shades-100 flex items-center justify-end gap-2 border-t px-3 py-3"
            )}
        >
            <Button
                className="text-neutral-550 hover:text-primary-950 py-2"
                type={"button"}
                variant="text"
                onClick={closeCombobox}
            >
                Cancel
            </Button>

            <Button
                disabled={isDisabled}
                onClick={handleOptionsSelectionComplete}
                variant={"text"}
                className="text-primary font-medium xl:py-2"
            >
                Done
            </Button>
        </footer>
    );
};
export default ComboboxFooter;
