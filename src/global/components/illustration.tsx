import type { FC } from "react";
import { FadeOutIllustrationBackground } from "~/global/components/fade-out-illustration-background";
import type { IconProps, IconType } from "~/global/types";
import { cn } from "~/global/utils/cn";

type Tone = "primary" | "accent" | "success" | "danger" | "neutral";

const TONES: Record<Tone, string> = {
    accent: "bg-accent/15 text-accent ring-accent/10",
    danger: "bg-status-red-bg text-status-red-pc ring-status-red-pc/10",
    neutral: "bg-surface-container text-neutral-500 ring-outline/40",
    primary: "bg-primary-50 text-primary ring-primary/10",
    success: "bg-status-green-bg text-status-green-pc ring-status-green-pc/10",
};

export interface IllustrationProps extends IconProps {
    containerClassName?: string;
}

/**
 * Builds a brand-coloured illustration (icon in layered circles). Replaces the PNG
 * illustrations of the original kit so no image assets are required.
 */
export const createIllustration = (Icon: IconType, tone: Tone = "primary", label?: string) => {
    const Illustration: FC<IllustrationProps> = ({ className, containerClassName }) => (
        <FadeOutIllustrationBackground className={cn(containerClassName, className)}>
            <span
                role="img"
                aria-label={label}
                className={cn("m-3 grid aspect-square w-[min(9rem,60%)] min-w-16 place-items-center rounded-full ring-8", TONES[tone])}
            >
                <Icon className="size-1/2" strokeWidth={1.4} />
            </span>
        </FadeOutIllustrationBackground>
    );
    Illustration.displayName = `Illustration(${label ?? "icon"})`;
    return Illustration;
};
