import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { Button } from "~/global/components/button";
import { ComponentCard } from "~/global/components/component-card";
import { FadeOutIllustrationBackground } from "~/global/components/fade-out-illustration-background";
import { FilePickerCard } from "~/global/components/file-pickers";
import { Pagination } from "~/global/components/pagination";
import { ThemeToggle } from "~/global/components/theme-toggle";
import { ConfirmationProvider } from "~/global/providers/confirmation";
import { AccordionComponent } from "~/pages/components-playground/accordion-component";
import AvatarComponent from "~/pages/components-playground/avatar-components";
import BadgeComponent from "~/pages/components-playground/badge-component";
import { ButtonComponents } from "~/pages/components-playground/button-components";
import { ButtonLinkComponents } from "~/pages/components-playground/button-link-component";
import { ChipsButtonComponents } from "~/pages/components-playground/chips-button-components";
import { ComponentPlaygroupGrid } from "~/pages/components-playground/component-playgroup-grid";
import { ConfirmationComponent } from "~/pages/components-playground/confirmation-component";
import { DatePickerComponent } from "~/pages/components-playground/date-picker-component";
import { DropdownMenuComponent } from "~/pages/components-playground/dropdown-menu-component";
import EmptyStatesComponent from "~/pages/components-playground/empty-states-component";
import { FormControlsComponents } from "~/pages/components-playground/form-controls-components";
import { ModalAndSlideOverComponent } from "~/pages/components-playground/modal-and-slide-over-component";
import { LoadersComponents } from "~/pages/components-playground/modal/loaders-component";
import { PopoverComponent } from "~/pages/components-playground/popover-component";
import { ProgressComponent } from "~/pages/components-playground/progress-component";
import SkeletonLoaderComponent from "~/pages/components-playground/skeleton-loader-component";
import { TabLinkComponent } from "~/pages/components-playground/tab-link-component";
import TableComponent from "~/pages/components-playground/table/table-component";
import { ListParamsComponent } from "~/pages/components-playground/list-params-component";
import TimelineComponent from "~/pages/components-playground/timeline-component";
import BreadcrumbComponent from "~/pages/components-playground/breadcrumb-component";
import CustomToastComponents from "~/pages/components-playground/custom-toast-components";
import ChartComponents from "~/pages/components-playground/chart-components";
import TooltipComponent from "~/pages/components-playground/tooltip-component";

/**
 * `/components/playground` — live catalogue of every global component in
 * `src/global/components`, rendered with the Makuruma theme. Toggle light/dark at the top.
 */
const ComponentsPlayground = () => {
    return (
        <ConfirmationProvider>
            <section className="bg-background h-full min-h-screen flex-col space-y-10 overflow-y-auto p-6 md:p-10">
                <header className="flex flex-wrap items-center justify-between gap-4">
                    <Link to="/" className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm">
                        <ArrowLeftIcon className="size-4" /> Back to app
                    </Link>
                    <div className="text-center">
                        <h1 className="text-primary-950 text-2xl font-medium">Makuruma Logistics Components</h1>
                        <p className="text-muted-foreground text-sm">
                            Global kit in <code>src/global/components</code>: teal-blue primary, green success, orange accent.
                        </p>
                    </div>
                    <ThemeToggle showLabel className="border-outline border" />
                </header>
                <section className="space-y-4">
                    <ComponentPlaygroupGrid>
                        <BadgeComponent />
                        <AvatarComponent />
                    </ComponentPlaygroupGrid>
                    {/*<OtpInputComponent />*/}
                    <ComponentCard title="File upload">
                        <ComponentPlaygroupGrid>
                            <FilePickerCard mode="manual-upload" />
                            <LoadersComponents />
                        </ComponentPlaygroupGrid>
                    </ComponentCard>
                    <ComponentPlaygroupGrid>
                        <ConfirmationComponent />
                        <ComponentCard title="Loading button">
                            <Button loading>Submit</Button>
                        </ComponentCard>
                    </ComponentPlaygroupGrid>

                    <ComponentPlaygroupGrid>
                        <div className="space-y-4">
                            <TimelineComponent />
                            <ButtonLinkComponents />
                        </div>
                        <div className="space-y-4">
                            <ButtonComponents />
                            <TabLinkComponent />
                            <ComponentPlaygroupGrid>
                                <PopoverComponent />
                                <ChipsButtonComponents />
                            </ComponentPlaygroupGrid>
                        </div>
                    </ComponentPlaygroupGrid>

                    <ComponentPlaygroupGrid>
                        <ModalAndSlideOverComponent />
                        <ComponentPlaygroupGrid>
                            <DropdownMenuComponent />
                            <ProgressComponent />
                        </ComponentPlaygroupGrid>
                    </ComponentPlaygroupGrid>

                    <ComponentPlaygroupGrid>
                        <FormControlsComponents />
                        <div className="space-y-4">
                            <SkeletonLoaderComponent />
                            <DatePickerComponent />
                            <ComponentCard title="Pagination">
                                <Pagination totalPages={100} />
                            </ComponentCard>
                            <AccordionComponent />
                            <BreadcrumbComponent />
                            <ComponentPlaygroupGrid>
                                <CustomToastComponents />
                                <TooltipComponent />
                            </ComponentPlaygroupGrid>
                        </div>
                    </ComponentPlaygroupGrid>
                    <ComponentPlaygroupGrid>
                        <ComponentCard title="fade out illustration">
                            <FadeOutIllustrationBackground>
                                hello world
                            </FadeOutIllustrationBackground>
                        </ComponentCard>
                    </ComponentPlaygroupGrid>

                    <EmptyStatesComponent />

                    <TableComponent />
                    <ListParamsComponent />
                    <ChartComponents />
                </section>
            </section>
        </ConfirmationProvider>
    );
};
export default ComponentsPlayground;
