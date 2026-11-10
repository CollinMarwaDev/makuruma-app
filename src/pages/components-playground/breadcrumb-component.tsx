import { Breadcrumb } from "~/global/components/breadcrumb";
import { ComponentCard } from "~/global/components/component-card";

const breadcrumbs = [
    {
        link: "/",
        route: "Home",
        routeId: "home",
    },
    {
        link: "/components-playground",
        route: "Components-Playground",
        routeId: "components",
    },
];

const BreadcrumbComponent = () => {
    return (
        <ComponentCard title="Breadcrumbs component">
            <Breadcrumb>
                <Breadcrumb.List>
                    {breadcrumbs.map((breadcrumb, index) => (
                        <>
                            <Breadcrumb.Item key={breadcrumb.routeId}>
                                <Breadcrumb.Link
                                    className="text-primary-950 hover:text-primary text-base font-semibold tracking-wide capitalize hover:underline"
                                    to={breadcrumb.link}
                                >
                                    {breadcrumb.route}
                                </Breadcrumb.Link>
                            </Breadcrumb.Item>

                            {index + 1 < breadcrumbs.length && (
                                <Breadcrumb.Separator key={breadcrumb.link} />
                            )}
                        </>
                    ))}
                </Breadcrumb.List>
            </Breadcrumb>
        </ComponentCard>
    );
};

export default BreadcrumbComponent;
