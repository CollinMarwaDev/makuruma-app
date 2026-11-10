import { CheckCircle, DangerTriangle, InfoCircle } from "@solar-icons/react/ssr";
import { toast as sonner } from "sonner";
import CustomToast from "~/global/components/custom-toast";

/** Brand-styled toasts. Requires `<Toaster />` (rendered once in App). */
export const toast = {
    error: (message: string, title = "Something went wrong") =>
        sonner.custom(() => <CustomToast Icon={DangerTriangle} iconClassName="text-status-red-pc" title={title} message={message} />),
    info: (message: string, title = "Heads up") =>
        sonner.custom(() => <CustomToast Icon={InfoCircle} iconClassName="text-primary" title={title} message={message} />),
    success: (message: string, title = "Success") =>
        sonner.custom(() => <CustomToast Icon={CheckCircle} iconClassName="text-status-green-pc" title={title} message={message} />),
};
