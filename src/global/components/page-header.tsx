import type { FC } from "react";
import { cn } from "~/global/utils/cn";

interface Props {
    title: string;
    subtitle?: string;
    className?: string;
    titleClassName?: string;
    subTitleClassName?: string;
}

const PageHeader: FC<Props> = ({
    title,
    subtitle,
    className,
    titleClassName,
    subTitleClassName,
}) => {
    return (
        <section className={cn("space-y-1", className)}>
            <h1 className={cn("text-2xl capitalize", titleClassName)}>
                {title}
            </h1>
            <p className={cn("text-sm text-neutral-400", subTitleClassName)}>
                {subtitle}
            </p>
        </section>
    );
};
export default PageHeader;
