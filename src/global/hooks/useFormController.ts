import {
    type FieldValues,
    type Path,
    useController,
    type UseControllerProps,
    useFormContext,
} from "react-hook-form";

export const useFormController = <
    TFieldValues extends FieldValues = FieldValues,
>(
    props: UseControllerProps<TFieldValues, Path<TFieldValues>>
) => {
    const { control } = useFormContext<TFieldValues>();

    return useController({
        control,
        ...props,
    });
};
