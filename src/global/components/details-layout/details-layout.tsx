import type { ReactNode } from "react";
import { AsideSection } from "~/global/components/details-layout/aside-section";
import { MainSection } from "~/global/components/details-layout/main-section";

import { PageContainer } from "~/global/components/page-container";
import { cn } from "~/global/utils/cn";

type DetailsLayoutProps = {
    children: ReactNode;
    className?: string;
};

export const DetailsLayout = ({
    className,
    children,
}: DetailsLayoutProps) => {
    return (
        <PageContainer className={cn("flex p-0", className)}>
            {children}
        </PageContainer>
    );
};

DetailsLayout.AsideSection = AsideSection;
DetailsLayout.MainSection = MainSection;
