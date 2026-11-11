import type { FC } from "react";
import { SpinLoader } from "~/global/components/loaders/spin-loader";

/** Whole-screen wait (session check, lazy routes): the kit SpinLoader centred on the page. */
export const FullPageLoader: FC<{ label?: string }> = ({ label = "Loading" }) => (
    <div className="center min-h-screen bg-background" role="status" aria-live="polite">
        <SpinLoader className="size-14" />
        <span className="sr-only">{label}</span>
    </div>
);
