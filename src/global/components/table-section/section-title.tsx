import type { FC, ReactNode } from "react";

export interface TableSectionTitleProps {
    title: string;
    subtitle?: ReactNode;
    children?: ReactNode;
}

const SectionTitle: FC<TableSectionTitleProps> = ({
    title,
    subtitle,
    children,
}) => {
    return (
        <div className={"items-between gap-4"}>
            <div className={"space-y-1"}>
                <h2 className={"text-xl font-semibold"}>{title}</h2>
                <p className={"text-xs text-neutral-500"}>{subtitle}</p>
            </div>
            {children}
        </div>
    );
};

export default SectionTitle;
