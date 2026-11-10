import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef, MouseEventHandler } from "react";
import type { IconType, IconWeight } from "~/global/types";
import { cn } from "~/global/utils/cn";

export interface ButtonIconProps extends ButtonProps {
    icon: IconType;
    weight?: IconWeight;
    iconClassName?: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    iconStrokeWidth?: string | number | undefined;
}

const buttonVariants = cva(
    cn(
        "relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium",
        "cursor-pointer transition-all duration-150 focus:outline-none",
        "focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "active:scale-[0.98] text-center whitespace-nowrap",
        "disabled:cursor-not-allowed disabled:opacity-50"
    ),

    {
        defaultVariants: {
            variant: "filled",
        },
        variants: {
            variant: {
                /** Teal brand action (default). */
                filled: "bg-primary text-primary-foreground border border-primary-600 shadow-sm hover:bg-primary-600",
                /** Orange call-to-action for the single most important action on a page. */
                accent: "bg-accent text-accent-foreground border border-accent-500 shadow-sm hover:bg-accent-500",
                /** Green confirmation (complete, approve, mark paid). */
                success: "bg-status-green text-white border border-status-green-pc shadow-sm hover:opacity-90",
                /** Destructive action. */
                danger: "bg-status-red text-white border border-status-red-pc shadow-sm hover:opacity-90",
                outline:
                    "text-primary-950 border border-outline bg-surface hover:bg-faint hover:shadow-sm",
                /** Logo-blue gradient. */
                primaryGradient:
                    "bg-gradient-to-br from-secondary-500 to-secondary-700 text-white border border-secondary-400/40 hover:opacity-90",
                text: "text-primary-950 hover:bg-faint",
                tonal: "bg-primary-50 text-primary border border-primary-100 hover:bg-primary-100",
            },
        },
    }
);

type ButtonVariants = VariantProps<typeof buttonVariants>;

export interface ButtonProps
    extends ComponentPropsWithoutRef<"button">,
        ButtonVariants {
    loading?: boolean;
    loadingIconClassName?: string;
    loadingText?: string;
}

export interface GenerateButtonClasses extends ButtonVariants {
    className?: string;
    loading?: boolean;
}

export const generateButtonClasses = ({
    className,
    loading,
    variant,
}: GenerateButtonClasses) => {
    return cn(
        buttonVariants({ variant }),
        {
            "cursor-wait opacity-70": loading,
        },
        { "cursor-pointer opacity-100": !loading },
        className
    );
};
