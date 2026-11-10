import { Avatar as AvatarPrimitive } from "radix-ui";
import {
    type ComponentPropsWithoutRef,
    type ComponentRef,
    type FC,
    forwardRef,
    type ForwardRefExoticComponent,
    type RefAttributes,
} from "react";
import type { IconType, IconWeight } from "~/global/types";
import { cn } from "~/global/utils/cn";

// region Types
export type AvatarProps = ComponentPropsWithoutRef<
    typeof AvatarPrimitive.Root
> & {
    active?: boolean;
};

type AvatarComponentProps = ForwardRefExoticComponent<
    AvatarProps & RefAttributes<ComponentRef<typeof AvatarPrimitive.Root>>
> & {
    Image: typeof AvatarImage;
    Fallback: typeof AvatarFallback;
    Icon: typeof AvatarIcon;
};

export type AvatarImageProps = ComponentPropsWithoutRef<
    typeof AvatarPrimitive.Image
>;
// endregion

// region Avatar Root
export const Avatar = forwardRef<
    ComponentRef<typeof AvatarPrimitive.Root>,
    AvatarProps
>(({ className, active, ...props }, ref) => (
    <div className="relative size-fit">
        <AvatarPrimitive.Root
            ref={ref}
            className={cn(
                "bg-primary/30 text-primary-700 center relative flex size-10 shrink-0 overflow-hidden rounded-full",
                className
            )}
            {...props}
        />

        {active && (
            <div className="bg-status-green absolute right-0 bottom-0 size-3 rounded-full border-[1.5px] border-surface" />
        )}
    </div>
)) as AvatarComponentProps;

Avatar.displayName = AvatarPrimitive.Root.displayName;
// endregion

// region AvatarImage
const AvatarImage = forwardRef<
    ComponentRef<typeof AvatarPrimitive.Image>,
    AvatarImageProps
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Image
        ref={ref}
        className={cn("aspect-square h-full w-full object-cover", className)}
        {...props}
    />
));

AvatarImage.displayName = AvatarPrimitive.Image.displayName;
// endregion

// region AvatarFallback
const AvatarFallback = forwardRef<
    ComponentRef<typeof AvatarPrimitive.Fallback>,
    ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Fallback
        ref={ref}
        className={cn(
            "font-jetbrains-mono flex h-full w-full items-center justify-center rounded-full font-bold uppercase",
            className
        )}
        {...props}
    />
));

AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;
// endregion

// region AvatarIcon
export interface AvatarIconProps {
    icon: IconType;
    className?: string;
    weight?: IconWeight;
    strokeWidth?: number;
}

const AvatarIcon: FC<AvatarIconProps> = ({
    strokeWidth,
    className,
    weight,
    icon: Icon,
}) => {
    return (
        <Icon
            className={cn("size-5", className)}
            strokeWidth={strokeWidth}
            weight={weight}
        />
    );
};
// endregion

Avatar.Icon = AvatarIcon;
Avatar.Image = AvatarImage;
Avatar.Fallback = AvatarFallback;
