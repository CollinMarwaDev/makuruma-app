import type { FC } from "react";
import { Avatar } from "~/global/components/avatar";
import { cn } from "~/global/utils/cn";
import { getInitials } from "~/global/utils/string-utils";

/**
 * Props interface for person information displayed in the card
 */
interface PersonCardProps {
    /** URL of the person's avatar image */
    imageUrl?: string;
    /** Brief description text about the person */
    description?: string;
    /** Person's full name */
    fullName: string;
    /** Person's job position or role */
    position: string;
    /** Optional className for container customization */
    className?: string;
}

/**
 * Component that displays a person's information in a card format
 * including their avatar, name, description and position.
 *
 * @param props - The component props
 * @param props.avatar - URL of the person's avatar image (optional)
 * @param props.fullName - Person's full name
 * @param props.description - Brief description text about the person
 * @param props.position - Person's job position or role
 * @param props.className - Optional className for container customization
 *
 * @example
 * ```tsx
 * <PersonCard
 *   avatar="/path/to/avatar.jpg"
 *   fullName="John Doe"
 *   description="Product Manager"
 *   position="Senior Level"
 * />
 * ```
 */
export const PersonCard: FC<PersonCardProps> = ({
    imageUrl,
    fullName,
    description,
    position,
    className,
}) => {
    return (
        <div className={cn("flex items-start", className)}>
            <Avatar className="mr-3">
                <Avatar.Image src={imageUrl} />
                <Avatar.Fallback>{getInitials(fullName)}</Avatar.Fallback>
            </Avatar>
            <div className="space-y-1">
                <p className="text-primary-950 text-sm leading-5 font-semibold tracking-tight">
                    {fullName}
                </p>

                <div className="center justify-start gap-2 text-xs text-neutral-500">
                    <p>{description}</p>
                    <div className="size-1 rounded-full bg-neutral-500" />
                    <p>{position}</p>
                </div>
            </div>
        </div>
    );
};
