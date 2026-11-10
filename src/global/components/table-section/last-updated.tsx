import { ClientDateTime } from "~/global/components/client-date-time";

interface LastUpdatedProps {
    value?: string;
}

export const LastUpdated = ({ value }: LastUpdatedProps) => {
    return (
        <>
            Last Update:{" "}
            <ClientDateTime fallback="--" format="date-time" value={value} />
        </>
    );
};
