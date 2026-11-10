import { GalleryAdd } from "@solar-icons/react/ssr";
import type { FC } from "react";
import type { IconProps } from "~/global/types";

/**
 * Solar photo-style icon for image upload file picker fields.
 */
export const UploadImageIcon: FC<IconProps> = (props) => {
    return <GalleryAdd {...props} />;
};
