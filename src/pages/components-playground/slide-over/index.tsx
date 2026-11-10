import { SectionSeparator } from "~/global/components/section-seperator";
import { SlideOver } from "~/global/components/slider-over/slide-over";
import { UserSettingsIcon } from "~/global/components/icons";
import useRouteDialog from "~/global/hooks/useRouteDialog";
import { AvatarCard } from "~/global/components/avatar";
import { Button } from "~/global/components/button";
import { Card } from "~/global/components/card";

const SlideOverComponentPage = () => {
    const { open, closeDialog } = useRouteDialog();
    return (
        <SlideOver open={open} onClose={closeDialog}>
            <SlideOver.Panel>
                <SlideOver.Header title={"Slide Over Page Component"} />
                <SlideOver.Content>
                    <div className={"space-y-4"}>
                        <SectionSeparator
                            title={"User Info"}
                            icon={UserSettingsIcon}
                        />
                        <Card>
                            <AvatarCard>
                                <AvatarCard.Image
                                    src={"https://i.pravatar.cc/100"}
                                    alt={"John Doe"}
                                    containerClassName={"size-13"}
                                />
                                <AvatarCard.Content
                                    title={"John Doe"}
                                    titleClassName={"font-semibold"}
                                    subtitle={"SSB-0104 | Approver"}
                                    subtitleClassName={
                                        "text-sm text-neutral-500"
                                    }
                                />
                            </AvatarCard>
                        </Card>
                    </div>
                </SlideOver.Content>
                <SlideOver.Footer className={"flex items-center gap-4"}>
                    <Button
                        variant={"outline"}
                        onClick={closeDialog}
                        className={"w-full bg-surface"}
                    >
                        Close Dialog
                    </Button>
                    <Button onClick={closeDialog} className={"w-full"}>
                        Close Dialog
                    </Button>
                </SlideOver.Footer>
            </SlideOver.Panel>
        </SlideOver>
    );
};

export default SlideOverComponentPage;
