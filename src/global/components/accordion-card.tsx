import { Accordion } from "~/global/components/accordation";
import { AltArrowDown } from "@solar-icons/react/ssr";
import type { FC, ReactNode } from "react";
import Tooltip from "~/global/components/tooltip";
import { Card } from "~/global/components/card";
import { cn } from "~/global/utils/cn";

export interface AccordionCardProps {
    children: ReactNode;
    wrapperClassName?: string;
    className?: string;
    label: string;
    title: string;
}

const AccordionCard: FC<AccordionCardProps> = ({
    children,
    className,
    label,
    title,
    wrapperClassName,
}) => {
    return (
        <Accordion type="multiple">
            <Card className={cn("space-y-6", wrapperClassName)}>
                <Accordion.Item value={label} className={"border-none"}>
                    <Accordion.Trigger className={"items-between group"}>
                        <p className={"font-medium"}>{label}</p>
                        <Tooltip content={title}>
                            <div
                                className={
                                    "center border-outline size-6 rounded-lg border"
                                }
                            >
                                <AltArrowDown className="transition duration-100 ease-linear group-data-[state=open]:rotate-180" />
                            </div>
                        </Tooltip>
                    </Accordion.Trigger>
                    <Accordion.Content className={className}>
                        {children}
                    </Accordion.Content>
                </Accordion.Item>
            </Card>
        </Accordion>
    );
};

export default AccordionCard;
