import PickedFileCard from "~/global/components/file-pickers/picked-file-card";
import { FileIcon } from "~/global/components/icons";
import { useFilePicker } from "~/global/hooks/useFilePicker";
import { cn } from "~/global/utils/cn";

export const SampleFilePicker = () => {
    const {
        getRootProps,
        isDragActive,
        unPickFileById,
        getInputProps,
        pickedFiles,
    } = useFilePicker({
        mode: "single",
    });

    return (
        //     <label {...getRootProps()}>
        //         upload file here for {JSON.stringify(pickedFiles, null, 2)}
        //         <input {...getInputProps()} />
        //     </label>
        // );

        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={cn(
                    "border-primary bg-primary-shades-50 center rounded-xl border-2 border-dashed py-6",
                    {
                        "bg-[#EBF1FD]": isDragActive,
                    }
                    // { "border-status-red-pc/80 bg-status-red-bg/10": hasError }
                )}
            >
                <label className="center flex-col space-y-1">
                    <input {...getInputProps()} />
                    <FileIcon className="size-20" />
                    <div className="text-center">
                        <p className="text-primary font-medium">
                            Click to upload
                        </p>
                        <p className="text-primary-shades-500 text-sm">
                            {"Maximum file size: 12 MB"}
                        </p>
                    </div>
                </label>
            </div>

            {pickedFiles && (
                <PickedFileCard file={pickedFiles} onRemove={unPickFileById} />
            )}
        </div>
    );
};
