import { Button } from "~/global/components/button";
import { ComponentCard } from "~/global/components/component-card";
import { useConfirmation } from "~/global/providers/confirmation";
import { ComponentPlaygroupGrid } from "~/pages/components-playground/component-playgroup-grid";

export const ConfirmationComponent = () => {
    const confirm = useConfirmation();

    const handleInfoConfirmation = async () => {
        const confirmed = await confirm({
            cancelText: "Cancel",
            description:
                "This is an informational message. Would you like to proceed with this action?",
            okayText: "Proceed",
            title: "Information",
            type: "info",
        });
        if (confirmed) {
            console.log("[Info confirmed]");
        } else console.log("[Info not confirmed]");
    };

    const handleSuccessConfirmation = async () => {
        const confirmed = await confirm({
            cancelText: "Back to customers",
            description:
                "A new customer profile has been successfully created. You can now view details, update their information, or proceed with other actions.",
            okayText: "View profile",
            title: "Customer Created Successfully",
            type: "success",
        });
        if (confirmed) {
            console.log("[Success confirmed]");
        } else console.log("[Success not confirmed]");
    };

    const handleWarningConfirmation = async () => {
        const confirmed = await confirm({
            cancelText: "Keep editing",
            description:
                "You have unsaved changes that will be lost if you continue. Are you sure you want to proceed?",
            okayText: "Discard changes",
            title: "Unsaved Changes",
            type: "warning",
        });
        if (confirmed) {
            console.log("[Warning confirmed]");
        } else console.log("[Warning not confirmed]");
    };

    const handleErrorConfirmation = async () => {
        const confirmed = await confirm({
            cancelText: "Cancel",
            description:
                "This action cannot be undone. All data associated with this item will be permanently deleted.",
            okayText: "Delete permanently",
            title: "Delete Item",
            type: "error",
        });
        if (confirmed) {
            console.log("[Error confirmed]");
        } else console.log("[Error not confirmed]");
    };

    return (
        <ComponentCard
            title="Confirmation Modals"
            innerWrapperClassName="space-y-4"
        >
            <ComponentPlaygroupGrid>
                <Button onClick={handleInfoConfirmation} variant="outline">
                    Info Confirmation
                </Button>
                <Button onClick={handleSuccessConfirmation} variant="filled">
                    Success Confirmation
                </Button>
                <Button onClick={handleWarningConfirmation} variant="tonal">
                    Warning Confirmation
                </Button>
                <Button onClick={handleErrorConfirmation} variant="filled">
                    Error Confirmation
                </Button>
            </ComponentPlaygroupGrid>
        </ComponentCard>
    );
};
