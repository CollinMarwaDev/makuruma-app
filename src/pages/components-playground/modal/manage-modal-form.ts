import { zodResolver } from "@hookform/resolvers/zod";
import { NoneEmptyStringSchema } from "~/global/utils/r3/zod-common";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import type { FormField } from "~/global/components/form-controls/types";
import {
    AtLeastOneArrayItemSchema,
    LabelAndValueSchema,
    UserSelectOptionSchema,
} from "~/global/utils/zod-common";

const ModalFormSchema = z.object({
    agreeTermsAndConditions: z.boolean(),
    description: NoneEmptyStringSchema("description"),
    dob: NoneEmptyStringSchema("dob"),
    email: z.string().email("Invalid email address"),
    name: z.string().min(1, "Name is required"),
    sex: LabelAndValueSchema,
    user: AtLeastOneArrayItemSchema(UserSelectOptionSchema).max(1),
});

export type ModalFormType = z.infer<typeof ModalFormSchema>;

export const useMangeModalForm = () => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        register,
    } = useForm<ModalFormType>({
        resolver: zodResolver(ModalFormSchema) as Resolver<ModalFormType>,
    });

    const fields: FormField<ModalFormType>[] = [
        {
            hasError: !!errors.name?.message,
            inputType: "text-input",
            label: "Name",
            name: "name",
            placeholder: "Enter your name",
            register,
        },
        {
            control,
            hasError: !!errors.dob?.message,
            inputType: "date-input",
            label: "Name",
            name: "dob",
        },
        {
            hasError: !!errors.email?.message,
            inputType: "text-input",
            label: "Email",
            name: "email",
            placeholder: "Enter your email",
            register,
        },
        {
            control,
            hasError: !!errors.sex?.message,
            inputType: "select-input",
            label: "Sex",
            name: "sex",
            options: [
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
            ],
            placeholder: "Enter your email",
        },
        {
            control,
            hasError: !!errors.user?.message,
            inputType: "combobox-input",
            label: "User",
            name: "user",
            options: [
                {
                    email: "6onnykato@gmail.com",
                    label: "Bonny Kato",
                    value: "1",
                },
                {
                    email: "hamisa-kato@outlook.com",
                    label: "Hamisa Kato",
                    value: "female",
                },
            ],
            placeholder: "Enter your email",
            type: "user",
        },
        {
            hasError: !!errors.description?.message,
            inputType: "textarea",
            label: "Description",
            name: "description",
            placeholder: "Enter your description here",
            register,
        },
        {
            inputType: "checkbox",
            label: "Agree terms and conditions",
            name: "agreeTermsAndConditions",
            register,
        },
    ];

    return { fields, handleSubmit };
};
