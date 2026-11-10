import { ComponentCard } from "~/global/components/component-card";
import { MoneyIcon, TextDocumentIcon } from "~/global/components/icons";
import { StatsCard, type StatsCardProps } from "~/global/components/stats-card";

const StatsCardComponent = () => {
    const stats: StatsCardProps[] = [
        { icon: TextDocumentIcon, title: "Quotation Issued", value: "5,000" },
        {
            icon: MoneyIcon,
            title: "Quotation Issued by Value",
            value: "120,000,000 TZS",
        },
    ];

    return (
        <ComponentCard
            title="Stats card component"
            innerWrapperClassName="grid grid-cols-2 gap-4"
        >
            {stats.map((stat, index) => (
                <StatsCard key={index} {...stat} />
            ))}
        </ComponentCard>
    );
};
export default StatsCardComponent;
