import { ArchiveBoxIcon } from "@heroicons/react/24/outline";
import type { FC } from "react";
import { FadeOutIllustrationBackground } from "~/global/components/fade-out-illustration-background";
import { createIllustration, type IllustrationProps } from "~/global/components/illustration";

const DefaultEmptyState = createIllustration(ArchiveBoxIcon, "primary", "empty");

export interface EmptyStateIconProps extends IllustrationProps {
    /** Optional custom image; defaults to the brand illustration. */
    imageSrc?: string;
}

export const EmptyStateIcon: FC<EmptyStateIconProps> = ({ className, imageSrc }) =>
    imageSrc ? (
        <FadeOutIllustrationBackground className={className}>
            <img alt="" className="aspect-auto w-44" src={imageSrc} />
        </FadeOutIllustrationBackground>
    ) : (
        <DefaultEmptyState className={className} />
    );
