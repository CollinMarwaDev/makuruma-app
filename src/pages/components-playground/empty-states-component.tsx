import { ComponentPlaygroupGrid } from "~/pages/components-playground/component-playgroup-grid";
import { PageSearchIcon } from "~/global/components/error-boundary/icons/page-search-icon";
import { WarningIcon } from "~/global/components/error-boundary/icons/warning-icon";
import { GeneralFallbackUI } from "~/global/components/general-fallback-ui";
import { EmptyStateIcon } from "~/global/components/error-boundary/icons";
import { ComponentCard } from "~/global/components/component-card";
import { ServerIcon } from "~/global/components/icons/server-icon";

/**
 * Component that showcases different empty state UI examples
 */
export const EmptyStatesComponent = () => {
    return (
        <ComponentCard title="Empty States">
            <ComponentPlaygroupGrid>
                {/* No Data Empty State */}
                <div className="rounded-lg border border-gray-200 p-4">
                    <h3 className="mb-2 text-sm font-medium">No Data</h3>
                    <div className="rounded-lg bg-gray-50 py-4">
                        <GeneralFallbackUI
                            icon={EmptyStateIcon}
                            title="No Data Found"
                            description="There are no items to display at this time."
                            iconClassName="size-40"
                        />
                    </div>
                </div>

                {/* Search Not Found Empty State */}
                <div className="rounded-lg border border-gray-200 p-4">
                    <h3 className="mb-2 text-sm font-medium">
                        Search Not Found
                    </h3>
                    <div className="rounded-lg bg-gray-50 py-4">
                        <GeneralFallbackUI
                            icon={PageSearchIcon}
                            title="No Results Found"
                            description="We couldn't find any results matching your search criteria."
                            iconClassName="size-40"
                        />
                    </div>
                </div>

                {/* Error Empty State */}
                <div className="rounded-lg border border-gray-200 p-4">
                    <h3 className="mb-2 text-sm font-medium">Error State</h3>
                    <div className="rounded-lg bg-gray-50 py-4">
                        <GeneralFallbackUI
                            icon={WarningIcon}
                            title="Something Went Wrong"
                            description="An error occurred while loading the data. Please try again later."
                            iconClassName="size-40"
                            ctaLabel="Retry"
                            ctaLink="#"
                        />
                    </div>
                </div>

                {/* Server Error Empty State */}
                <div className="rounded-lg border border-gray-200 p-4">
                    <h3 className="mb-2 text-sm font-medium">Server Error</h3>
                    <div className="rounded-lg bg-gray-50 py-4">
                        <GeneralFallbackUI
                            icon={ServerIcon}
                            title="Server Error"
                            description="We're experiencing some server issues. Please try again later."
                            iconClassName="size-40"
                            statusCode={500}
                        />
                    </div>
                </div>
            </ComponentPlaygroupGrid>
        </ComponentCard>
    );
};

export default EmptyStatesComponent;
