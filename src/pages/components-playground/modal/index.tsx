import { CubeTransparentIcon } from "@heroicons/react/24/outline";
import { RenderFormField } from "~/global/components/form-controls/render-form-field";
import { Modal } from "~/global/components/modal/modal";
import useRouteDialog from "~/global/hooks/useRouteDialog";
import {
    type ModalFormType,
    useMangeModalForm,
} from "~/pages/components-playground/modal/manage-modal-form";

const ModalBasedRoute = () => {
    const { open, closeDialog } = useRouteDialog();
    const { fields, handleSubmit } = useMangeModalForm();

    const onSubmit = (data: ModalFormType) => {
        console.log("[form-data]", data);
    };

    return (
        <Modal open={open} onClose={closeDialog} top="lg">
            <Modal.Panel>
                <Modal.Header
                    Icon={CubeTransparentIcon}
                    title="Route Based Modal"
                    subtitle={"This is route based modal description"}
                />
                <Modal.Content className={""}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-2"
                    >
                        {fields.map((field) => (
                            <RenderFormField {...field} key={field.name} />
                        ))}
                        <Modal.Footer />
                    </form>
                </Modal.Content>
            </Modal.Panel>
        </Modal>
    );
};
export default ModalBasedRoute;
