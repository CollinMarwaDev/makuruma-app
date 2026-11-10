import { ClipboardIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Button, ButtonLink } from "~/global/components/button";
import { ComponentCard } from "~/global/components/component-card";
import { Modal } from "~/global/components/modal/modal";
import { SlideOver } from "~/global/components/slider-over/slide-over";
import { ConfirmationComponent } from "~/pages/components-playground/confirmation-component";

export const ModalAndSlideOverComponent = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [openSlideOver, setOpenSlideOver] = useState(false);

    return (
        <ComponentCard
            title="Modal & Slideover component"
            innerWrapperClassName="gap-2 flex items-center"
        >
            <Button
                className="text-xs"
                onClick={() => setOpenDialog(true)}
                variant="outline"
            >
                Open Modal
            </Button>

            <ButtonLink to={"modal"} className="text-xs" variant="outline">
                Route Based Modal
            </ButtonLink>
            <Button
                className="text-xs"
                onClick={() => setOpenSlideOver(true)}
                variant="outline"
            >
                Open slide over
            </Button>

            <ButtonLink to={"slide-over"} className="text-xs" variant="outline">
                Slide over Route Based
            </ButtonLink>

            <Modal open={openDialog} onClose={() => setOpenDialog(false)}>
                <Modal.Panel>
                    <Modal.Header
                        Icon={ClipboardIcon}
                        title="Title goes here"
                        subtitle={"This modal description that is goes here"}
                    />
                    <Modal.Content className={""}>
                        Main contents <ConfirmationComponent />
                    </Modal.Content>
                    <Modal.Footer />
                </Modal.Panel>
            </Modal>

            <SlideOver
                open={openSlideOver}
                onClose={() => setOpenSlideOver(false)}
            >
                <SlideOver.Panel>
                    <SlideOver.Header title="Title" />
                    <SlideOver.Content className={"center"}>
                        Contents
                    </SlideOver.Content>
                    <SlideOver.Footer>Footer</SlideOver.Footer>
                </SlideOver.Panel>
            </SlideOver>
        </ComponentCard>
    );
};
