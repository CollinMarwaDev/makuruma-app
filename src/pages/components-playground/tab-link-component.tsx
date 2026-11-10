import { ComponentCard } from "~/global/components/component-card";
import { TabLinks } from "~/global/components/tab-link";
import { AddSquare, CartLarge2, Home } from "@solar-icons/react/ssr";

export const TabLinkComponent = () => {
    return (
        <ComponentCard title="Tab link component">
            <TabLinks
                tabs={[
                    {
                        
                        icon: CartLarge2,
                        matchPattern: new RegExp(`^/components-playground$`),
                        name: "Components",
                        url: "/components-playground",
                    },
                    {
                        
                        icon: Home,
                        matchPattern: new RegExp(`^/home$`),
                        name: "Home",
                        url: "/",
                    },
                    {
                        
                        icon: AddSquare,
                        matchPattern: new RegExp(`^/additional-route$`),
                        name: "Additional Route",
                        url: "/additional-route",
                    },
                ]}
            />
        </ComponentCard>
    );
};
