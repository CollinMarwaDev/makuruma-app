import { ComponentCard } from "~/global/components/component-card";
import { Button } from "~/global/components/button";
import { toast } from "~/global/utils/toast";

const CustomToastComponents = () => (
    <ComponentCard title="Custom Toast component">
        <div className={"center justify-start gap-4"}>
            <Button
                onClick={() => toast.error("You have failed to perform an action!")}
                variant={"outline"}
                className={"text-status-red"}
            >
                Error Toast
            </Button>
            <Button onClick={() => toast.success("You have successfully performed an action!")} variant={"filled"}>
                Success Toast
            </Button>
        </div>
    </ComponentCard>
);

export default CustomToastComponents;
